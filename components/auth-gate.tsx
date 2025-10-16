import { INACTIVITY_LOCK_TIMEOUT } from '@/constants/env';

import { useSession } from '@/store/sessionSlice';
import { Redirect, usePathname } from 'expo-router';
import React, { useMemo, type PropsWithChildren } from 'react';

export default function AuthGate({ children }: PropsWithChildren) {
  const { lastActiveAt, token } = useSession();
  const pathname = usePathname();

  const isLocked = useMemo(() => {
    if (!token || !lastActiveAt) return false;
    return Date.now() - lastActiveAt > INACTIVITY_LOCK_TIMEOUT;
  }, [token, lastActiveAt]);

  if (!token && pathname !== '/login') {
    return <Redirect href="/login" />;
  }

  if (token && isLocked && pathname !== '/lock') {
    return <Redirect href="/lock" />;
  }

  return <>{children}</>;
}
