import { useEffect } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export function useAnonymousAuth() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        signInAnonymously(auth).catch(error => {
          console.error('Anonymous sign-in failed:', error);
        });
      }
    });

    return () => unsubscribe();
  }, []);
}
