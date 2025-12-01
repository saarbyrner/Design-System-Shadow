// @flow

import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Slider, Typography } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  element: HumanInputFormElement,
  value: string,
  onChange: Function,
};

const SliderSelector = (props: Props) => {
  const { element, value, onChange } = props;
  const [sliderValue, setSliderValue] = useState(Number(value));
  const isInitialRender = useRef(true);

  const min = Number(element.config.min) || 0;
  const max = Number(element.config.max) || 10;
  const increment = element.config.custom_params?.increment || 1;

  useEffect(() => {
    const calculateDefaultValue = () => {
      let defaultValue = (min + max) / 2;

      if (defaultValue % increment !== 0) {
        defaultValue = Math.round(defaultValue / increment) * increment;
      }

      return Math.min(Math.max(defaultValue, min), max);
    };

    if (isInitialRender.current) {
      if (value === null || value === undefined) {
        setSliderValue(calculateDefaultValue());
      } else if (typeof value === 'string') {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue) || numericValue === 0) {
          setSliderValue(calculateDefaultValue());
        } else {
          setSliderValue(numericValue);
        }
      } else if (typeof value === 'number') {
        if (Number.isNaN(value) || value === 0) {
          setSliderValue(calculateDefaultValue());
        } else {
          setSliderValue(value);
        }
      }
      isInitialRender.current = false;
    } else if (typeof value === 'string') {
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue) && numericValue !== 0) {
        setSliderValue(numericValue);
      }
    } else if (typeof value === 'number') {
      if (!Number.isNaN(value) && value !== 0) {
        setSliderValue(value);
      }
    }
  }, [value, min, max, increment]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    onChange(newValue.toString());
  };

  const sliderBoxWidth = useMemo(() => {
    const range = max - min;
    const steps = range / increment;

    // Adjust these multipliers and offsets to fine-tune the width
    let width = steps * 40; // Base width based on steps
    width = Math.min(width, 800); // Max width 800 to avoid overflow
    width = Math.max(width, 200); // Min width 200 to avoid being too small

    return width;
  }, [min, max, increment]);

  const renderSliderElement = () => (
    <Box sx={{ width: sliderBoxWidth }}>
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        aria-label={element.config.text}
        valueLabelDisplay="auto"
        shiftStep={30}
        step={increment}
        marks
        min={min}
        max={max}
        readOnly={element.config.custom_params?.readonly}
        disabled={element.config.custom_params?.readonly}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          onClick={() => {
            setSliderValue(min);
            onChange(min.toString());
          }}
          sx={{ cursor: 'pointer' }}
        >
          {element.config.min}
        </Typography>
        <Typography
          variant="body2"
          onClick={() => {
            setSliderValue(max);
            onChange(max.toString());
          }}
          sx={{ cursor: 'pointer' }}
        >
          {element.config.max}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Typography
        variant="subtitle1"
        mb={1}
        sx={{ color: 'text.primary', fontSize: '14px' }}
      >
        {element.config.text}
      </Typography>
      {renderSliderElement()}
    </>
  );
};

export default SliderSelector;
