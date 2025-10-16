import type { AppDispatch } from '@/store';
import { setLastActiveNow } from '@/store/sessionSlice';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';

export default function ActivityTracker(): null {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  useEffect(() => {
    // On mount mark activity
    dispatch(setLastActiveNow());

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') dispatch(setLastActiveNow());
    });
    return () => sub.remove();
  }, [dispatch]);

  useEffect(() => {
    // Mark activity on route change
    dispatch(setLastActiveNow());
  }, [pathname, dispatch]);

  return null;
}
