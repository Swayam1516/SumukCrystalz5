'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerCleaner
 * Ensures stale or failing service workers on localhost are cleanly unregistered,
 * preventing 'TypeError: Failed to convert value to Response' network rejections.
 */
export default function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});
    }
  }, []);

  return null;
}
