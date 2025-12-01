// @flow

import { Rating, Box, StarIcon, Typography } from '@kitman/playbook/components';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { useState, useEffect } from 'react';

type Props = {
  element: HumanInputFormElement,
  value: string,
  onChange: Function,
};

const RatingSelector = (props: Props) => {
  const { element, value, onChange } = props;
  const [ratingValue, setRatingValue] = useState(Number(value));

  const min = Number(element.config.min) || 0;
  const max = Number(element.config.max) || 5;
  const increment = Math.min(element.config.custom_params?.increment || 1, 1);

  const calculateDefaultValue = () => {
    let defaultValue = (min + max) / 2;

    // Adjust defaultValue to be divisible by increment
    if (defaultValue % increment !== 0) {
      defaultValue = Math.round(defaultValue / increment) * increment;
    }

    // Ensure defaultValue is within min and max bounds
    return Math.min(Math.max(defaultValue, min), max);
  };

  useEffect(() => {
    if (typeof value === 'string') {
      let numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        numericValue = 0;
      }
      numericValue = Math.round(numericValue / increment) * increment;
      setRatingValue(numericValue);
    }
  }, [value, increment]);

  const handleRatingChange = (event, newValue) => {
    if (newValue !== null) {
      const adjustedValue = Math.round(newValue / increment) * increment;
      setRatingValue(adjustedValue);
      onChange(adjustedValue.toString());
    }
  };

  const renderRatingElement = () => {
    const starSize = '42px'; // Uniform star size
    const ratingWidth = `${max * 60}px`; // Calculate a fixed width based on max stars

    return (
      <Box sx={{ '& > legend': { mt: 2 } }}>
        <Rating
          value={ratingValue === 0 ? calculateDefaultValue() : ratingValue}
          onChange={handleRatingChange}
          name="customized-color"
          precision={increment}
          icon={
            <StarIcon
              fontSize="inherit"
              style={{ width: starSize, height: starSize }}
            />
          }
          emptyIcon={
            <StarIcon
              fontSize="inherit"
              style={{ width: starSize, height: starSize }}
            />
          }
          min={min}
          max={max}
          readOnly={element.config.custom_params?.readonly}
          disabled={element.config.custom_params?.readonly}
          style={{ width: ratingWidth, maxWidth: 800 }}
          width="800px"
          sx={{ maxWidth: '100%' }}
        />
      </Box>
    );
  };

  return (
    <>
      <Typography
        variant="subtitle1"
        mb={1}
        sx={{ color: 'text.primary', fontSize: '14px' }}
      >
        {element.config.text}
      </Typography>
      {renderRatingElement()}
    </>
  );
};

export default RatingSelector;
