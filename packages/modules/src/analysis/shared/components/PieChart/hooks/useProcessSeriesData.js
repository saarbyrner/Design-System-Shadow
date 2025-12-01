// @flow
import { getOtherSegementLabel } from '../constants';
import type { PieDatumProps, ValueAccessor } from '../types';

type Props = {
  data: Array<PieDatumProps>,
  valueAccessor: ValueAccessor,
};

/**
 * Handles processing the series data for pie charts
 * It fitlers the data of null and zero values,
 * sorts the series from high to low, and if there are 10 or more segments,
 * it adds the smallest segments together in a 'Other Categories' segment
 * So only max 10 segments show on a pie chart
 *
 * Retuns
 * sortedSeries, where data is sorted from high to low
 * otherSegment, array containing only the data that has been grouped into other
 *
 * @param {Array<PieDatumProps>} data pie series data to be processed
 * @param {ValueAccessor} valueAccessor function that handles accessing the value from the data
 * @returns Array<PieDatumProps> sortedSeries
 * @returns Array<PieDatumProps> otherSegment
 */
const useProcessSeriesData = ({ data, valueAccessor }: Props) => {
  const sortedSeries: Array<PieDatumProps> = [...data]
    .filter((item) => item.value !== null)
    .filter((item) => item.value !== 0)
    .sort((a, b) => {
      const valueA = valueAccessor(a);
      const valueB = valueAccessor(b);

      return parseFloat(valueB) - parseFloat(valueA);
    });

  const otherSegment: Array<PieDatumProps> =
    data?.length > 9 ? sortedSeries?.slice(9, data?.length) : [];

  let processedData;

  if (otherSegment.length > 0) {
    const otherValue = otherSegment.reduce((acc, cur) => {
      const value = valueAccessor(cur);
      return value !== null ? parseFloat(value) + acc : acc;
    }, 0);

    processedData = [
      ...sortedSeries.slice(0, 9),
      { label: getOtherSegementLabel(), value: `${otherValue}` },
    ];
  } else {
    processedData = sortedSeries;
  }

  return {
    processedData,
    otherSegment,
  };
};

export default useProcessSeriesData;
