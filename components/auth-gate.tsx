import { INACTIVITY_LOCK_TIMEOUT } from '@/constants/env';

import { useSession } from '@/store/sessionSlice';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

export default function AuthGate({ children }: PropsWithChildren) {
  const { lastActiveAt, token } = useSession();
  const pathname = usePathname();
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  const checkLocked = useCallback(() => {
    if (!token || !lastActiveAt) return false;
    return Date.now() - lastActiveAt > INACTIVITY_LOCK_TIMEOUT;
  }, [token, lastActiveAt]);

  useEffect(() => {
    // check lock state every second: maybe set to 10 seconds or 1 minute in production
    if (['/lock', '/login'].includes(pathname)) {
      setIsLocked(false);
      return;
    }
    const interval = setInterval(() => {
      setIsLocked(checkLocked());
    }, 1000);

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [checkLocked, pathname]);

  useFocusEffect(() => {
    if (!token && pathname !== '/login') {
      router.replace('/login');
    }
    if (token && isLocked && pathname !== '/lock') {
      router.replace('/lock');
    }
  });

  return <>{children}</>;
}
