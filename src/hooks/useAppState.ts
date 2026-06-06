import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setAppState(nextState);
    });

    return () => subscription.remove();
  }, []);

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
  };
}
