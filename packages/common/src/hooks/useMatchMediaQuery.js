// @flow
import { useState, useEffect } from 'react';

// Custom hook to execute a media query with matchMedia
// Default query to tell if touch is primary input

// Note: adding a listener to detect media query change is possible but have no need for it currently.
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries
// https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer

const useMatchMediaQuery = (queryString: string = '(pointer:coarse)') => {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (!window?.matchMedia) {
      return;
    }
    setIsMatch(window.matchMedia(queryString).matches);
  }, [queryString]);

  return isMatch;
};

export default useMatchMediaQuery;
