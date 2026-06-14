import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { ScreenWrapper } from '@/components/common';
import { RideResultCard } from '@/components/passenger/RideResultCard';
import { SearchFilters } from '@/components/passenger/SearchFilters';
import { EmptyResults } from '@/components/passenger/EmptyResults';
import { committedSearchFromRoute, useRideSearch } from '@/hooks/useRideSearch';
import { Ride } from '@/types';
import type { RootScreenProps } from '@/navigation/types';

type Props = RootScreenProps<'SearchResults'>;

export default function SearchResultsScreen({ route, navigation }: Props) {
  const { originCity, destinationCity } = route.params;

  const initialCommitted = useMemo(() => committedSearchFromRoute(route.params), [route.params]);

  const { params, results, isLoading, isFetching, error, sortBy, setSortBy, refetch, hasSearched } =
    useRideSearch(initialCommitted);

  const handleRidePress = useCallback(
    (ride: Ride) => {
      navigation.navigate('RideBooking', {
        rideId: ride.id,
        seats: params.seats,
      });
    },
    [navigation, params.seats],
  );

  const handleModifySearch = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loaderText}>Finding rides…</Text>
        </View>
      );
    }

    if (error) {
      return <EmptyResults variant="error" onRetry={() => refetch()} />;
    }

    if (!hasSearched || results.length === 0) {
      return (
        <EmptyResults
          variant="no_results"
          originCity={originCity}
          destinationCity={destinationCity}
          onModifySearch={handleModifySearch}
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListHeaderComponent={
          <SearchFilters selected={sortBy} onSelect={setSortBy} resultCount={results.length} />
        }
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <RideResultCard
            ride={item}
            seatsRequested={params.seats}
            onPress={() => handleRidePress(item)}
          />
        )}
      />
    );
  };

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerRoute}>
            {originCity} → {destinationCity}
          </Text>
          <Text style={styles.headerMeta}>
            {params.seats} seat{params.seats !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  backText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.white,
    width: 48,
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerRoute: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  headerMeta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.primary200,
    marginTop: 2,
  },
  content: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loaderText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
  },
});
