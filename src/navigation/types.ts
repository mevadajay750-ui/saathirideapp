import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthIntent = 'signup' | 'login';

export type AuthStackParamList = {
  Welcome: undefined;
  Phone: { intent?: AuthIntent };
  OTP: { phone: string };
  ProfileSetup: undefined;
  VehicleSetup: undefined;
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
  MyBookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  DriverTabs: undefined;
  PassengerTabs: NavigatorScreenParams<PassengerTabParamList> | undefined;
  RideDetail: { rideId: string };
  SearchResults: {
    originCity: string;
    destinationCity: string;
    originCityId: string;
    destinationCityId: string;
    date: string;
    seats: number;
  };
  RideBooking: { rideId: string; seats: number };
  BookingDetail: { bookingId: string };
  RateRide: { rideId: string; rateeId: string; rateeName: string };
  EditProfile: undefined;
  Notifications: undefined;
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

export type DriverTabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<DriverTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type PassengerTabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PassengerTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
