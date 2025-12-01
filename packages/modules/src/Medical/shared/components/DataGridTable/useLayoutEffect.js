// @flow
import { useEffect, useLayoutEffect as useOriginalLayoutEffect } from 'react';

const useLayoutEffect =
  typeof window === 'undefined' ? useEffect : useOriginalLayoutEffect;

export default useLayoutEffect;
