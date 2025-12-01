// @flow
import { useRef, useLayoutEffect } from 'react';

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
