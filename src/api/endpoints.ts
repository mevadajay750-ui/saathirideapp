export const Endpoints = {
  AUTH_VERIFY: '/auth/verify',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  USER_ME: '/users/me',
  USER_UPDATE: '/users/me',
  VEHICLE_UPSERT: '/users/me/vehicle',

  RIDES_CREATE: '/rides',
  RIDES_SEARCH: '/rides/search',
  RIDES_MY: '/rides/my',
  RIDE_DETAIL: (id: string) => `/rides/${id}`,

  BOOKINGS_CREATE: '/bookings',
  BOOKINGS_MY: '/bookings/my',
  RIDE_BOOKINGS: (rideId: string) => `/bookings/ride/${rideId}`,
  BOOKING_ACCEPT: (id: string) => `/bookings/${id}/accept`,
  BOOKING_DECLINE: (id: string) => `/bookings/${id}/decline`,
  BOOKING_CANCEL: (id: string) => `/bookings/${id}/cancel`,

  RATING_CREATE: '/ratings',
  RATINGS_USER: (id: string) => `/ratings/user/${id}`,
  RATINGS_PENDING: '/ratings/pending',
  RIDE_MY_RATING: (rideId: string) => `/ratings/ride/${rideId}/me`,

  DEVICES: '/devices',
} as const;
