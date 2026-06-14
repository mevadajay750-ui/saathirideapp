import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { BookingCard } from '@/components/passenger/BookingCard';
import { useMyBookings, useCancelBooking } from '@/hooks/useBooking';
import { styles } from './styles';

type Tab = 'active' | 'past';

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const { data, isLoading, isRefetching, refetch, error } = useMyBookings();
  const { mutate: cancelBooking, variables: cancellingId } = useCancelBooking();

  const bookings = activeTab === 'active' ? data?.active ?? [] : data?.past ?? [];

  const handleCancel = useCallback(
    (bookingId: string) => {
      cancelBooking(bookingId);
    },
    [cancelBooking],
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <AppIcon
        name={activeTab === 'active' ? Icons.ticket : Icons.list}
        size={IconSize['2xl']}
        color={Colors.gray400}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'active' ? 'No active bookings' : 'No past bookings'}
      </Text>
      <Text style={styles.emptyBody}>
        {activeTab === 'active'
          ? 'Search for a ride and request a booking — it only takes a minute.'
          : 'Your completed and cancelled bookings will appear here.'}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My bookings</Text>
      </View>

      <View style={styles.tabs}>
        {(['active', 'past'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'active' ? 'Active' : 'Past'}
              {tab === 'active' && (data?.active?.length ?? 0) > 0 && (
                <Text style={styles.tabCount}> ({data?.active?.length})</Text>
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
          <Text style={styles.errorText}>Could not load bookings</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
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
            <BookingCard
              booking={item}
              onCancel={handleCancel}
              isCancelling={cancellingId === item.id}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}
