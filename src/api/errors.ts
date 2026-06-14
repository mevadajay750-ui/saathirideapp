export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = 'API_ERROR', status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const axiosErr = error as {
    response?: { status?: number; data?: { message?: string; code?: string } };
    message?: string;
  };

  const status = axiosErr.response?.status;
  const body = axiosErr.response?.data;
  const message = body?.message ?? axiosErr.message ?? 'Something went wrong';
  const code = body?.code ?? 'API_ERROR';

  return new ApiError(message, code, status);
}
