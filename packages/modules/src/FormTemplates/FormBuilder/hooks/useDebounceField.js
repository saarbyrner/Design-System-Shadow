// @flow

import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

type Props = {
  initialValue: string,
  onUpdate: (value: string) => void,
  delay?: number,
};

export const useDebounceField = ({
  initialValue,
  onUpdate,
  delay = 400,
}: Props) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const debouncedUpdate = useRef(
    debounce((value) => {
      onUpdateRef.current(value);
    }, delay)
  ).current;

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleChange = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedUpdate(newValue);
    },
    [debouncedUpdate]
  );

  return {
    value: localValue,
    onChange: handleChange,
  };
};

export default useDebounceField;
