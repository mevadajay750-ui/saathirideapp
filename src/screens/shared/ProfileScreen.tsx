import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { AvatarPicker } from '@/components/profile/AvatarPicker';
import { StatCard } from '@/components/profile/StatCard';
import { StarRating } from '@/components/profile/StarRating';
import { RatingRow } from '@/components/profile/RatingRow';
import { useProfileData, useUploadAndSavePhoto, useSwitchRole } from '@/hooks/useProfile';
import { useUserRatings, usePendingRatings } from '@/hooks/useRatings';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { signOut } from '@/services/auth.service';
import { formatRating, formatPhone } from '@/utils/formatters';
import type {
  DriverTabScreenProps,
  PassengerTabScreenProps,
  RootStackParamList,
} from '@/navigation/types';

type Props = DriverTabScreenProps<'Profile'> | PassengerTabScreenProps<'Profile'>;

export default function ProfileScreen(_props: Props) {
  const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isDriver = user?.role === 'driver' || user?.role === 'both';

  const { data: profile, isLoading, refetch, isRefetching } = useProfileData();
  const { data: ratings = [], isLoading: ratingsLoading } = useUserRatings(user?.id ?? '');
  const { data: pending = [] } = usePendingRatings();

  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadAndSavePhoto();

  const { mutateAsync: switchRole, isPending: isSwitching } = useSwitchRole();

  const displayUser = profile ?? user;

  const handlePhotoPick = useCallback(
    async (uri: string) => {
      try {
        await uploadPhoto(uri);
      } catch {
        Alert.alert('Upload failed', 'Could not update photo. Try again.');
      }
    },
    [uploadPhoto],
  );

  const handleSwitchRole = useCallback(() => {
    const next = isDriver ? 'passenger' : 'driver';
    Alert.alert(
      `Switch to ${next}?`,
      isDriver
        ? 'You will see the passenger view. Switch back anytime.'
        : 'You will see the driver view. Switch back anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Switch to ${next}`,
          onPress: async () => {
            try {
              await switchRole(next);
            } catch {
              Alert.alert('Failed', 'Could not switch role. Try again.');
            }
          },
        },
      ],
    );
  }, [isDriver, switchRole]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          clearAuth();
        },
      },
    ]);
  }, [clearAuth]);

  const handleRatePending = useCallback(
    (item: (typeof pending)[0]) => {
      stackNavigation.navigate('RateRide', {
        rideId: item.rideId,
        rateeId: item.rateeId,
        rateeName: item.rateeName,
      });
    },
    [stackNavigation],
  );

  if (isLoading && !displayUser) {
    return (
      <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => stackNavigation.navigate('Notifications')}
            style={styles.bellBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name={Icons.bell} size={IconSize.lg} color={Colors.white} />
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => stackNavigation.navigate('EditProfile')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.editBtnRow}>
              <Text style={styles.editBtn}>Edit</Text>
              <AppIcon name={Icons.edit} size={IconSize.sm} color={Colors.primary200} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identityCard}>
          <AvatarPicker
            name={displayUser?.name ?? ''}
            photoUrl={displayUser?.photoUrl}
            size={88}
            isUploading={isUploading}
            onPick={handlePhotoPick}
          />
          <View style={styles.identityInfo}>
            <Text style={styles.name}>{displayUser?.name}</Text>
            <Text style={styles.phone}>{formatPhone(displayUser?.phone ?? '')}</Text>
            <View style={styles.rolePill}>
              <AppIcon
                name={isDriver ? Icons.car : Icons.passenger}
                size={IconSize.sm}
                color={Colors.primaryDeep}
              />
              <Text style={styles.roleLabel}>{isDriver ? 'Driver' : 'Passenger'}</Text>
            </View>
          </View>
        </View>

        {(displayUser?.avgRating ?? 0) > 0 && (
          <View style={styles.ratingCard}>
            <StarRating value={displayUser?.avgRating ?? 0} size="lg" readonly />
            <Text style={styles.ratingAvg}>{formatRating(displayUser?.avgRating ?? 0)} avg</Text>
            <Text style={styles.ratingCount}>
              {ratings.length} review{ratings.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <StatCard
            icon={isDriver ? Icons.car : Icons.passenger}
            value={displayUser?.totalRides ?? 0}
            label={isDriver ? 'Rides offered' : 'Rides taken'}
          />
          <StatCard
            icon={Icons.star}
            value={
              (displayUser?.avgRating ?? 0) > 0 ? formatRating(displayUser?.avgRating ?? 0) : '—'
            }
            label="Avg rating"
          />
          <StatCard
            icon={Icons.calendar}
            value={displayUser?.createdAt ? new Date(displayUser.createdAt).getFullYear() : '—'}
            label="Member since"
          />
        </View>

        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate your recent rides</Text>
            {pending.map((item) => (
              <TouchableOpacity
                key={item.rideId}
                style={styles.pendingRatingCard}
                onPress={() => handleRatePending(item)}
                activeOpacity={0.85}
              >
                <View style={styles.pendingLeft}>
                  <AppIcon name={Icons.star} size={IconSize.lg} color={Colors.accent} />
                  <View>
                    <Text style={styles.pendingName}>Rate {item.rateeName}</Text>
                    <Text style={styles.pendingRoute}>
                      {item.originCity} → {item.destinationCity}
                    </Text>
                  </View>
                </View>
                <AppIcon name={Icons.forward} size={IconSize.lg} color={Colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isDriver && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your vehicle</Text>
            {displayUser?.vehicle ? (
              <View style={styles.vehicleCard}>
                <AppIcon name={Icons.carSport} size={IconSize.xl} color={Colors.primary} />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {displayUser.vehicle.make} {displayUser.vehicle.model}
                  </Text>
                  <Text style={styles.vehicleMeta}>
                    {displayUser.vehicle.color} · {displayUser.vehicle.plateNumber}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => stackNavigation.navigate('EditProfile')}>
                  <Text style={styles.editVehicleText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addVehicleCard}
                onPress={() => stackNavigation.navigate('EditProfile')}
              >
                <AppIcon name={Icons.add} size={IconSize.lg} color={Colors.primary} />
                <Text style={styles.addVehicleText}>Add vehicle details</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews ({ratings.length})</Text>
          {ratingsLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.base }} />
          ) : ratings.length === 0 ? (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>
                {isDriver
                  ? 'Complete rides to receive reviews from passengers.'
                  : 'Take rides to receive reviews from drivers.'}
              </Text>
            </View>
          ) : (
            ratings.slice(0, 5).map((rating) => <RatingRow key={rating.id} rating={rating} />)
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSwitchRole}
            disabled={isSwitching}
          >
            <AppIcon
              name={isDriver ? Icons.passenger : Icons.car}
              size={IconSize.lg}
              color={Colors.textSecondary}
              style={styles.actionIcon}
            />
            <Text style={styles.actionLabel}>
              {isSwitching ? 'Switching…' : isDriver ? 'Switch to passenger' : 'Switch to driver'}
            </Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, styles.signOutRow]} onPress={handleSignOut}>
            <AppIcon
              name={Icons.logOut}
              size={IconSize.lg}
              color={Colors.error}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionLabel, styles.signOutLabel]}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>SaathiRide v1.0.0 (MVP)</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  bellBtn: {
    position: 'relative',
  },
  editBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtn: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.primary200,
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  bellBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    color: Colors.white,
  },

  scroll: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
    gap: Spacing.base,
  },

  identityCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  identityInfo: { flex: 1, gap: Spacing.xs },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.textBrand,
  },
  phone: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  roleLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.primaryDeep,
  },

  ratingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingAvg: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
  },
  ratingCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  pendingRatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#FDCFA4',
  },
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  pendingName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.accentDark,
  },
  pendingRoute: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  vehicleInfo: { flex: 1 },
  vehicleName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  vehicleMeta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editVehicleText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  addVehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary200,
  },
  addVehicleText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primary,
  },

  noReviews: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  noReviewsText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.6,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionIcon: { width: 28 },
  actionLabel: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  actionChevron: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.lg,
    color: Colors.gray300,
  },
  signOutRow: { paddingTop: Spacing.md },
  signOutLabel: { color: Colors.error },

  version: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
