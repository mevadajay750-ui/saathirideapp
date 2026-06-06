/**
 * Countdown timer hook for OTP resend button
 * Usage: const { secondsLeft, isRunning, start, reset } = useCountdown(30);
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    setSecondsLeft(initialSeconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [initialSeconds, stop]);

  const reset = useCallback(() => {
    stop();
    setSecondsLeft(0);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    start,
    reset,
  };
}
