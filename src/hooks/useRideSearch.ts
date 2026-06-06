/**
 * useRideSearch — manages search params state + TanStack Query fetch.
 *
 * Separates "search params" (what the user typed) from
 * "committed search" (what was actually submitted).
 * Results only fetch when the user taps Search — not on every keystroke.
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { searchRides } from '@/services/rides.service';
import { Ride } from '@/types';
import { City, CITIES } from '@/data/cities';
import type { RootStackParamList } from '@/navigation/types';

export type SortOption = 'departure' | 'price_asc' | 'price_desc' | 'rating';

export interface SearchParams {
  originCity: City | null;
  destinationCity: City | null;
  date: Date;
  seats: number;
}

export interface CommittedSearch {
  originCity: City;
  destinationCity: City;
  date: Date;
  seats: number;
}

export type SearchResultsRouteParams = RootStackParamList['SearchResults'];

const DEFAULT_PARAMS: SearchParams = {
  originCity: null,
  destinationCity: null,
  date: new Date(),
  seats: 1,
};

function cityFromId(id: string, fallbackName: string): City {
  return CITIES.find((c) => c.id === id) ?? { id, name: fallbackName, state: '' };
}

export function committedSearchFromRoute(params: SearchResultsRouteParams): CommittedSearch {
  return {
    originCity: cityFromId(params.originCityId, params.originCity),
    destinationCity: cityFromId(params.destinationCityId, params.destinationCity),
    date: parseISO(params.date),
    seats: params.seats,
  };
}

function paramsFromCommitted(committed: CommittedSearch): SearchParams {
  return {
    originCity: committed.originCity,
    destinationCity: committed.destinationCity,
    date: committed.date,
    seats: committed.seats,
  };
}

export function useRideSearch(initialCommitted?: CommittedSearch | null) {
  const [params, setParams] = useState<SearchParams>(() =>
    initialCommitted ? paramsFromCommitted(initialCommitted) : DEFAULT_PARAMS,
  );
  const [committed, setCommitted] = useState<CommittedSearch | null>(initialCommitted ?? null);
  const [sortBy, setSortBy] = useState<SortOption>('departure');

  const {
    data: rawResults = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'rides',
      'search',
      committed?.originCity.id,
      committed?.destinationCity.id,
      committed ? format(committed.date, 'yyyy-MM-dd') : null,
      committed?.seats,
    ],
    queryFn: () => {
      if (!committed) return [];
      return searchRides({
        originCity: committed.originCity.id,
        destinationCity: committed.destinationCity.id,
        date: format(committed.date, 'yyyy-MM-dd'),
        seats: committed.seats,
      });
    },
    enabled: !!committed,
    staleTime: 1000 * 60,
  });

  const results = sortRides(rawResults, sortBy);

  const commit = useCallback(() => {
    if (!params.originCity || !params.destinationCity) return false;
    if (params.originCity.id === params.destinationCity.id) return false;
    setCommitted({
      originCity: params.originCity,
      destinationCity: params.destinationCity,
      date: params.date,
      seats: params.seats,
    });
    return true;
  }, [params]);

  const updateParam = useCallback(
    <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setCommitted(null);
  }, []);

  return {
    params,
    updateParam,
    committed,
    results,
    isLoading,
    isFetching,
    error,
    hasSearched: !!committed,
    hasResults: results.length > 0,
    sortBy,
    setSortBy,
    commit,
    reset,
    refetch,
  };
}

function sortRides(rides: Ride[], sortBy: SortOption): Ride[] {
  const copy = [...rides];
  switch (sortBy) {
    case 'departure':
      return copy.sort(
        (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
      );
    case 'price_asc':
      return copy.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    case 'price_desc':
      return copy.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    case 'rating':
      return copy.sort((a, b) => b.driverRating - a.driverRating);
    default:
      return copy;
  }
}
