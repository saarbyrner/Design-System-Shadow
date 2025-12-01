// @flow
import { useState, useEffect } from 'react';
import { useLocation, useInRouterContext } from 'react-router-dom';

/**
 * Hook that returns the location hash from useLocation when on the single page application,
 * otherwise, it returns our custom implementation
 */
export default function useLocationHash() {
  const isInContext = useInRouterContext();
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);

    if (!isInContext) {
      window.addEventListener('hashchange', onHashChange);
    }

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isInContext]);

  try {
    // throws error if isInContext === false
    const location = useLocation();
    return location.hash;
  } catch (err) {
    return hash;
  }
}
