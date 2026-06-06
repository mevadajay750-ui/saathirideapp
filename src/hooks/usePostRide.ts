import { useState, useCallback } from 'react';
import { createRide, CreateRidePayload } from '@/services/rides.service';
import { Ride } from '@/types';

export function usePostRide() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRide, setCreatedRide] = useState<Ride | null>(null);

  const postRide = useCallback(async (payload: CreateRidePayload): Promise<Ride | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const ride = await createRide(payload);
      setCreatedRide(ride);
      return ride;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to post ride. Please check your connection and try again.';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCreatedRide(null);
    setError(null);
  }, []);

  return { isLoading, error, createdRide, postRide, reset };
}
