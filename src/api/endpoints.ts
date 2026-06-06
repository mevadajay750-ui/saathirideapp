export const Endpoints = {
  AUTH_SEND_OTP: '/auth/otp/send',
  AUTH_VERIFY_OTP: '/auth/otp/verify',
  AUTH_REFRESH: '/auth/refresh',

  USER_ME: '/users/me',
  USER_UPDATE: '/users/me',

  RIDES_CREATE: '/rides',
  RIDES_SEARCH: '/rides/search',
  RIDES_MY: '/rides/mine',
  RIDE_DETAIL: (id: string) => `/rides/${id}`,
  RIDE_UPDATE: (id: string) => `/rides/${id}`,
  RIDE_CANCEL: (id: string) => `/rides/${id}/cancel`,

  BOOKING_CREATE: (rideId: string) => `/rides/${rideId}/bookings`,
  BOOKINGS_MY: '/bookings/mine',
  BOOKING_UPDATE: (id: string) => `/bookings/${id}`,

  RATING_CREATE: '/ratings',
} as const;
