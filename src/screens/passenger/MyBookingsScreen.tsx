import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { BookingCard } from '@/components/passenger/BookingCard';
import { useMyBookings, useCancelBooking } from '@/hooks/useBooking';

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
      <Text style={styles.emptyEmoji}>{activeTab === 'active' ? '🎟️' : '📋'}</Text>
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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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
          <Text style={styles.errorEmoji}>⚠️</Text>
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
    </SafeAreaView>
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
  tabActive: { borderBottomColor: Colors.primary },
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
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: {
    paddingTop: Spacing['5xl'],
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  emptyEmoji: { fontSize: 56 },
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorEmoji: { fontSize: 48 },
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
