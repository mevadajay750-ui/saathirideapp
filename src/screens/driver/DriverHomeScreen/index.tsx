import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import type { AppIconName } from '@/theme';
import { AppLogo, AppIcon, Button, ScreenWrapper } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';
import type { DriverTabScreenProps } from '@/navigation/types';
import { styles } from './styles';

type Props = DriverTabScreenProps<'DriverHome'>;

const TIPS: { icon: AppIconName; text: string }[] = [
  { icon: Icons.wallet, text: 'Drivers earn back fuel + toll costs on every shared ride' },
  { icon: Icons.star, text: 'Drivers with 4.5+ rating get 3× more booking requests' },
  { icon: Icons.shield, text: 'Passengers are verified — name and photo shown before you accept' },
];

export default function DriverHomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, {firstName} 👋</Text>
          <Text style={styles.headerSub}>Ready to share your next ride?</Text>
        </View>
        {(user?.avgRating ?? 0) > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingValue}>{user!.avgRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.ctaCard}>
          <AppLogo size={56} borderRadius={14} />
          <Text style={styles.ctaTitle}>Post your next ride</Text>
          <Text style={styles.ctaBody}>
            Going intercity? Add your trip and let passengers join you. Takes less than 2 minutes.
          </Text>
          <Button
            label="Post a ride"
            onPress={() => navigation.navigate('PostRide')}
            variant="primary"
            size="lg"
          />
        </View>

        {(user?.totalRides ?? 0) > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user?.totalRides ?? 0}</Text>
              <Text style={styles.statLabel}>Rides shared</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>★ {user?.avgRating?.toFixed(1) ?? '—'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        )}

        <Text style={styles.tipsTitle}>Tips for drivers</Text>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <AppIcon name={tip.icon} size={IconSize.lg} color={Colors.primary} />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}
