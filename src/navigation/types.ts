import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Welcome: undefined;
  Phone: undefined;
  OTP: { phone: string };
  ProfileSetup: undefined;
  FontTest: undefined;
};

export type DriverTabParamList = {
  DriverHome: undefined;
  PostRide: undefined;
  DriverRides: undefined;
  Profile: undefined;
};

export type PassengerTabParamList = {
  PassengerHome: undefined;
  SearchRide: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  DriverTabs: undefined;
  PassengerTabs: undefined;
  RideDetail: { rideId: string };
  BookingDetail: { bookingId: string };
  RateRide: { rideId: string; rateeId: string; rateeName: string };
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type DriverTabScreenProps<T extends keyof DriverTabParamList> = BottomTabScreenProps<
  DriverTabParamList,
  T
>;

export type PassengerTabScreenProps<T extends keyof PassengerTabParamList> = BottomTabScreenProps<
  PassengerTabParamList,
  T
>;
