import { Platform } from 'react-native';
import Config from 'react-native-config';

export const APP_NAME = 'SaathiRide';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = Config.API_BASE_URL ?? 'http://localhost:3000/v1';

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300;
export const OTP_RETRY_SECONDS = 30;

export const MAX_SEATS = 4;
export const MIN_PRICE_INR = 50;
export const MAX_PRICE_INR = 5000;

export const RATING_WINDOW_HOURS = 168;
export const BOOKING_CANCEL_CUTOFF_HOURS = 2;
export const BOOKING_AUTO_EXPIRE_HOURS = 12;

export const PLATFORM = Platform.OS;

export const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;
export const INDIA_PHONE_PREFIX = '+91';
