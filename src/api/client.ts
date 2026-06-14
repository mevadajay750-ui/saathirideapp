import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/constants';
import { Endpoints } from '@/api/endpoints';
import { ApiError, parseApiError } from '@/api/errors';
import { useAuthStore } from '@/store/auth.store';

interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processRefreshQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
}

function unwrapResponse<T>(response: AxiosResponse<ApiEnvelope<T> | T>): AxiosResponse<T> {
  const payload = response.data;

  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as ApiEnvelope<T>).success === true
  ) {
    return {
      ...response,
      data: (payload as ApiEnvelope<T>).data as T,
    };
  }

  return response as AxiosResponse<T>;
}

function isAuthRefreshRequest(url?: string): boolean {
  return url?.includes(Endpoints.AUTH_REFRESH) ?? false;
}

function isAuthVerifyRequest(url?: string): boolean {
  return url?.includes(Endpoints.AUTH_VERIFY) ?? false;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    throw new ApiError('Session expired', 'UNAUTHORIZED', 401);
  }

  const response = await refreshClient.post<ApiEnvelope<RefreshResponse>>(Endpoints.AUTH_REFRESH, {
    refresh_token: refreshToken,
  });

  const envelope = response.data;
  if (!envelope.success || !envelope.data) {
    throw new ApiError(envelope.message ?? 'Token refresh failed', 'UNAUTHORIZED', 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = envelope.data;
  useAuthStore.getState().setTokens(accessToken, newRefreshToken);
  return accessToken;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => unwrapResponse(response),
  async (error: AxiosError<ApiEnvelope>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRefreshRequest(originalRequest.url) ||
      isAuthVerifyRequest(originalRequest.url)
    ) {
      const message = error.response?.data?.message ?? error.message ?? 'Request failed';
      const code = error.response?.data?.code ?? 'API_ERROR';
      return Promise.reject(new ApiError(message, code, status));
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = await refreshAccessToken();
      processRefreshQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processRefreshQueue(refreshError, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(parseApiError(refreshError));
    } finally {
      isRefreshing = false;
    }
  },
);

export { ApiError, parseApiError };
