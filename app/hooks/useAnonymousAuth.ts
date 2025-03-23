import { useEffect, useRef } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export function useAnonymousAuth() {
  const isSigningIn = useRef(false); // 🚫 prevent duplicate sign-ins

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user && !isSigningIn.current) {
        isSigningIn.current = true;

        signInAnonymously(auth)
          .then(() => {
            console.log('Anonymous sign-in successful');
          })
          .catch((error) => {
            console.error('Anonymous sign-in failed:', error);
          })
          .finally(() => {
            isSigningIn.current = false;
          });
      }
    });

    return () => unsubscribe();
  }, []);
}
