// @flow
import { useEffect, useState } from 'react';
import type { ElementRef } from 'react';
import type { Field } from '@kitman/common/src/types/PitchView';

export const PITCH_VIEW_MAX_WIDTH = 800;

type UseResponsivePitchViewArgs = {
  initialWidth: number,
  initialHeight: number,
  columns: number,
  rows: number,
  setField: (field: $Shape<Field>) => void,
  pitchRef: ElementRef<any>,
};

function useResponsivePitchView({
  initialWidth,
  initialHeight,
  columns,
  rows,
  setField,
  pitchRef,
}: UseResponsivePitchViewArgs) {
  const [pitchViewSizes, setPitchViewSizes] = useState<$Shape<Field>>({
    width: initialWidth,
    height: initialHeight,
    cellSize: 0,
  });

  useEffect(() => {
    setField(pitchViewSizes);
  }, [pitchViewSizes]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.min(
        pitchRef.current.offsetWidth,
        PITCH_VIEW_MAX_WIDTH
      );
      const ratio = initialWidth / initialHeight;
      const newHeight = Math.floor(newWidth / ratio);

      const cellWidth = Math.floor(newWidth / columns);
      const cellHeight = Math.floor(newHeight / rows);
      const cellSize = Math.min(cellWidth, cellHeight);

      setPitchViewSizes({
        width: newWidth,
        height: newHeight,
        cellSize,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return pitchViewSizes;
}

export default useResponsivePitchView;
