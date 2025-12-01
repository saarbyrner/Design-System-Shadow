// @flow
import { useState, useEffect, useRef } from 'react';
import type { ElementRef } from 'react';
import {
  useScrollDimensions,
  useClientDimensions,
} from '@kitman/common/src/hooks/useComponentDimensions';

const useRelativeFontSize = (maxFontSize: number) => {
  const containerRef: ElementRef<any> = useRef(null);
  const childRef: ElementRef<any> = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const containerDims = useClientDimensions(containerRef);
  const childDims = useScrollDimensions(childRef);

  const bufferedValue = (val) => val * 0.7;
  const scaleUp = (val) => val * 1.05;
  const scaleDown = (val) => val * 0.95;

  // Effect that calculates a new fontSize each time the parent dimensions open
  useEffect(() => {
    let newFontSize = fontSize;

    if (containerDims.height < childDims.height) {
      // 1) First Check, if the container reduces in height, and the child height is bigger than the container
      if (fontSize > containerDims.height) {
        // a) Setting the font size to the container height first
        newFontSize = containerDims.height;
      } else {
        // b) Otherwise, If the child height is oveflowing, and the font size is the same as (or smaller than)
        //    the container height, then we just need to scarle down the font size a small bit
        newFontSize = scaleDown(fontSize);
      }
    } else if (containerDims.width < childDims.width) {
      // 2) If the child width is greater than the parent, then we need to scale down the font size
      newFontSize = scaleDown(fontSize);
    } else if (
      containerDims.width > childDims.width ||
      containerDims.height > childDims.height
    ) {
      // 3) Checking if the child is too small i.e not within 70% of the height and width of container.
      //    In this case, we need to scale the fontsize up
      if (
        childDims.height < bufferedValue(containerDims.height) &&
        childDims.width < bufferedValue(containerDims.width)
      ) {
        newFontSize =
          scaleUp(fontSize) > maxFontSize ? maxFontSize : scaleUp(fontSize);
      }
    }

    if (newFontSize !== fontSize) {
      setFontSize(newFontSize);
    }
  }, [containerDims, childDims]);

  return [fontSize, containerRef, childRef];
};

export default useRelativeFontSize;
