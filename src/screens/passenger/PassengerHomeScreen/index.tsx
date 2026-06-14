import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { format } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import type { AppIconName } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { SearchForm } from '@/components/passenger/SearchForm';
import { useRideSearch } from '@/hooks/useRideSearch';
import { useAuthStore } from '@/store/auth.store';
import type { PassengerTabScreenProps, PassengerTabNavigation } from '@/navigation/types';
import { styles } from './styles';

type Props = PassengerTabScreenProps<'PassengerHome'>;

const POPULAR_ROUTES: { from: string; to: string; icon: AppIconName }[] = [
  { from: 'Ahmedabad', to: 'Vadodara', icon: Icons.road },
  { from: 'Ahmedabad', to: 'Surat', icon: Icons.city },
  { from: 'Ahmedabad', to: 'Rajkot', icon: Icons.water },
  { from: 'Mumbai', to: 'Pune', icon: Icons.mountain },
];

export default function PassengerHomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const { params, updateParam, commit, isLoading } = useRideSearch();
  const [errors, setErrors] = useState<{ originCity?: string; destinationCity?: string }>({});

  const rootNavigation = navigation as PassengerTabNavigation;

  const handleSearch = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!params.originCity) newErrors.originCity = 'Select origin city';
    if (!params.destinationCity) newErrors.destinationCity = 'Select destination city';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const ok = commit();
    if (ok && params.originCity && params.destinationCity) {
      rootNavigation.navigate('SearchResults', {
        originCity: params.originCity.name,
        destinationCity: params.destinationCity.name,
        originCityId: params.originCity.id,
        destinationCityId: params.destinationCity.id,
        date: format(params.date, 'yyyy-MM-dd'),
        seats: params.seats,
      });
    }
  }, [params, commit, rootNavigation]);

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {firstName}! 👋</Text>
          <Text style={styles.headerSub}>Where are you headed?</Text>
        </View>
        {(user?.avgRating ?? 0) > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingValue}>{user!.avgRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <SearchForm
              params={params}
              onUpdate={updateParam}
              onSearch={handleSearch}
              isLoading={isLoading}
              errors={errors}
            />
          </View>

          <Text style={styles.popularTitle}>Popular routes</Text>
          <View style={styles.popularGrid}>
            {POPULAR_ROUTES.map((route, i) => (
              <View key={i} style={styles.popularCard}>
                <AppIcon name={route.icon} size={IconSize.xl} color={Colors.primary} />
                <Text style={styles.popularFrom}>{route.from}</Text>
                <AppIcon name={Icons.down} size={IconSize.sm} color={Colors.primary400} />
                <Text style={styles.popularTo}>{route.to}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>How SaathiRide works</Text>
          {(
            [
              {
                icon: Icons.search,
                step: 'Search',
                desc: 'Find drivers going your way on the same day',
              },
              {
                icon: Icons.checkCircle,
                step: 'Book',
                desc: 'Request a seat — driver confirms within a few hours',
              },
              {
                icon: Icons.cash,
                step: 'Pay',
                desc: 'Pay cash directly to the driver at your meeting point',
              },
            ] as { icon: AppIconName; step: string; desc: string }[]
          ).map((item, i) => (
            <View key={i} style={styles.howRow}>
              <View style={styles.howIconWrap}>
                <AppIcon name={item.icon} size={IconSize.lg} color={Colors.primary} />
              </View>
              <View style={styles.howContent}>
                <Text style={styles.howStep}>{item.step}</Text>
                <Text style={styles.howDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
