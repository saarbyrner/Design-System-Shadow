// @flow
import { useEffect, useState } from 'react';

/**
 * Custom hook to track whether the browser tab/window is focused (active).
 */
const useIsTabActive = (): boolean => {
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  useEffect(() => {
    const handleFocus = () => {
      setIsTabActive(true);
    };

    const handleBlur = () => {
      setIsTabActive(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isTabActive;
};

export default useIsTabActive;
