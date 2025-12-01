// @flow
import { useState, useEffect, useCallback, useRef } from 'react';

// custom hook to listen to clicks outside an element

const useClickOutside = (onClickOutside: () => void, disabled?: boolean) => {
  const ref = useRef<null | HTMLElement>(null);
  const [isClickedOutside, setIsClickedOutside] = useState(false);

  const handleClick = useCallback(
    (event) => {
      if (!ref.current?.contains(event.target)) {
        setIsClickedOutside(true);
        onClickOutside();
      }
    },
    [onClickOutside]
  );

  useEffect(() => {
    if (disabled) {
      return () => {};
    }

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [disabled, handleClick]);

  useEffect(() => {
    if (isClickedOutside) {
      window.removeEventListener('click', handleClick);
    }
  }, [isClickedOutside, handleClick]);

  return ref;
};

export default useClickOutside;
