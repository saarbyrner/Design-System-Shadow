// @flow
import { useState, useEffect } from 'react';

// custom hook to get the initial values of window width and height
// also, it returns these values after resizing

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    windowWidth: 0,
    windowHeight: 0,
    tabletSize: 740,
  });

  const handleSize = () => {
    setWindowSize({
      ...windowSize,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    handleSize();

    window.addEventListener('resize', handleSize);

    return () => {
      window.removeEventListener('resize', handleSize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
