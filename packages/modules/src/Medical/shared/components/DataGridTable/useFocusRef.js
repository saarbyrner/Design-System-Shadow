// @flow
import { useRef } from 'react';
import useLayoutEffect from './useLayoutEffect';

const useFocusRef = (isSelected: boolean) => {
  const ref = useRef<any>(null);

  useLayoutEffect(() => {
    if (!isSelected) return;
    ref.current?.focus({ preventScroll: true });
  }, [isSelected]);

  return {
    ref,
    tabIndex: isSelected ? 0 : -1,
  };
};

export default useFocusRef;
