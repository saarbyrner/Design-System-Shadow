// @flow
import { useState, useEffect, useCallback } from 'react';
import { bannerHeightsValue } from '@kitman/common/src/variables/bannerHeights';

const useAppHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(bannerHeightsValue.desktop);

  // Memoize the calculation function to stabilize its identity
  const calculateAndSetHeaderHeight = useCallback(() => {
    const appHeaderElement = document.getElementsByClassName('appHeader')[0];
    // Query for mobileNavBarElement inside this function so it's always fresh
    const mobileNavBarElement = document.getElementsByClassName(
      'ip-mainNavBarMobile__wrapper'
    )[0];

    let newHeight = 0; // Default to 0 if elements aren't found

    if (appHeaderElement) {
      // Default to appHeaderElement's height if it's visible
      newHeight = appHeaderElement.offsetHeight;
      const appHeaderDisplayStyle = window.getComputedStyle(
        appHeaderElement,
        null
      ).display;

      if (appHeaderDisplayStyle === 'none' && mobileNavBarElement) {
        newHeight = mobileNavBarElement.offsetHeight;
      }
    } else if (mobileNavBarElement) {
      // Fallback if only mobileNavBarElement is found (e.g., appHeaderElement is missing)
      newHeight = mobileNavBarElement.offsetHeight;
    }

    // Only update state if the calculated height is different and greater than 0
    // (Avoids setting height to 0 if elements are briefly missing during resize)
    if (newHeight > 0) {
      setHeaderHeight((currentHeight) =>
        currentHeight !== newHeight ? newHeight : currentHeight
      );
    } else {
      // This prevents the height from collapsing to 0 if elements are briefly gone
      setHeaderHeight((currentHeight) =>
        currentHeight > 0 ? currentHeight : bannerHeightsValue.desktop
      );
    }
  }, []);

  useEffect(() => {
    let observer;
    let timeoutId;

    const setupObserverAndCalculate = () => {
      const appHeaderElement = document.getElementsByClassName('appHeader')[0];
      const mobileNavBarElement = document.getElementsByClassName(
        'ip-mainNavBarMobile__wrapper'
      )[0];

      // Check if elements exist. If not, try again shortly.
      // This retry mechanism helps if the header elements aren't in the DOM immediately
      if (!appHeaderElement && !mobileNavBarElement) {
        timeoutId = setTimeout(setupObserverAndCalculate, 50); // Retry after 50ms
        return;
      }

      // Elements found, perform initial calculation
      calculateAndSetHeaderHeight();

      // Set up ResizeObserver to watch for size changes on the header elements
      if (window.ResizeObserver) {
        observer = new ResizeObserver(calculateAndSetHeaderHeight);
        if (appHeaderElement) {
          observer.observe(appHeaderElement);
        }
        if (mobileNavBarElement) {
          observer.observe(mobileNavBarElement);
        }
      }

      // Set up window resize listener (as a fallback/additional trigger)
      window.addEventListener('resize', calculateAndSetHeaderHeight);
    };

    setupObserverAndCalculate();

    return () => {
      window.removeEventListener('resize', calculateAndSetHeaderHeight);
      if (observer) {
        observer.disconnect();
      }
      if (timeoutId) {
        // Clear timeout on cleanup
        clearTimeout(timeoutId);
      }
    };
  }, [calculateAndSetHeaderHeight]); // Effect depends on the memoized calculation function

  return headerHeight;
};

export default useAppHeaderHeight;
