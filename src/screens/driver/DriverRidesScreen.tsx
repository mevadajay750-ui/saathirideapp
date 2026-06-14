import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { RideCard } from '@/components/driver/RideCard';
import { useMyRides, useRideBookings } from '@/hooks/useDriverRides';
import { Ride } from '@/types';
import type { DriverTabScreenProps, DriverTabNavigation } from '@/navigation/types';

type Props = DriverTabScreenProps<'DriverRides'>;
type Tab = 'upcoming' | 'past';

function RideCardWithBookings({ ride, onPress }: { ride: Ride; onPress: () => void }) {
  const { data: bookings } = useRideBookings(ride.id);
  return (
    <RideCard
      ride={ride}
      confirmedBookings={bookings?.confirmed ?? []}
      pendingCount={bookings?.pending?.length ?? 0}
      onPress={onPress}
    />
  );
}

export default function DriverRidesScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { data, isLoading, isRefetching, refetch, error } = useMyRides();

  const rootNavigation = navigation as DriverTabNavigation;
  const rides = activeTab === 'upcoming' ? data?.upcoming ?? [] : data?.past ?? [];

  const handleRidePress = useCallback(
    (rideId: string) => {
      rootNavigation.navigate('RideDetail', { rideId });
    },
    [rootNavigation],
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <AppIcon
        name={activeTab === 'upcoming' ? Icons.carSport : Icons.list}
        size={IconSize['2xl']}
        color={Colors.gray400}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'No upcoming rides' : 'No past rides'}
      </Text>
      <Text style={styles.emptyBody}>
        {activeTab === 'upcoming'
          ? "You haven't posted any rides yet.\nTap 'Post ride' to get started."
          : 'Your completed and cancelled rides will appear here.'}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity style={styles.postBtn} onPress={() => navigation.navigate('PostRide')}>
          <Text style={styles.postBtnText}>Post a ride</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My rides</Text>
      </View>

      <View style={styles.tabs}>
        {(['upcoming', 'past'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'upcoming' ? 'Upcoming' : 'Past'}
              {tab === 'upcoming' && (data?.upcoming?.length ?? 0) > 0 && (
                <Text style={styles.tabCount}> ({data?.upcoming?.length})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <AppIcon name={Icons.warning} size={IconSize['2xl']} color={Colors.textMuted} />
          <Text style={styles.errorText}>Could not load rides</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <RideCardWithBookings ride={item} onPress={() => handleRidePress(item.id)} />
          )}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.transparent,
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bodySemiBold,
  },
  tabCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.primary400,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  emptyTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  postBtnText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  retryBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});
