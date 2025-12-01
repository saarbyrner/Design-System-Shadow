// @flow
import { useRef, useEffect } from 'react';

export type useSeamlessInfiniteScrollArgs = {
  enabled: boolean,
  onEndReached: () => void,
};
// A hook that provides seamless infinite scroll functionality using Intersection Observer
// It returns a ref to be attached to the element we want to observe
// When the element is fully in view, it calls the onEndReached callback
// The hook can be enabled or disabled using the enabled parameter
// Usage:
// const { watchRef } = useSeamlessInfiniteScroll({ enabled: true, onEndReached: () => { ... } });
// <div ref={watchRef}></div>
export const useSeamlessInfiniteScroll = ({
  enabled,
  onEndReached,
}: useSeamlessInfiniteScrollArgs) => {
  // ref to hold the element we want to observe
  const watchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // if not enabled or no ref, do nothing
    if (!enabled || !watchRef.current) {
      return;
    }
    // create an intersection observer
    const options = { root: null, rootMargin: '0px', threshold: 1.0 };
    // create the observer, which will call onEndReached when the element is fully in view
    const observer = new IntersectionObserver((entries) => {
      // If the watch element is visible, call the onEndReached function
      if (entries[0].isIntersecting) {
        onEndReached();
      }
    }, options);
    // Start observing the watch element
    observer.observe(watchRef.current);
    // Cleanup function to stop observing when the component unmounts
    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, [enabled, onEndReached, watchRef.current]);

  return { watchRef };
};
