// @flow
import _uniqueId from 'lodash/uniqueId';
import { SERIES_TYPES } from '../constants';

export const generateData = (labelPrefix: string = '') => [
  {
    label: `${labelPrefix}Label 1`,
    value: 12,
  },
  {
    label: `${labelPrefix}Label 2`,
    value: 20,
  },
  {
    label: `${labelPrefix}Label 3`,
    value: 18,
  },
];

export const generateTestSeries = (dataLabelPrefix: string = '') => ({
  valueAccessor: ({ value }: Object) => value,
  valueFormatter: ({ value }: { value: string }) => value,
  categoryAccessor: ({ label }: Object) => label,
  data: generateData(dataLabelPrefix),
  type: SERIES_TYPES.bar,
});

export const generateChartSeriesObject = () => ({
  [`${_uniqueId()}`]: generateTestSeries('Series 1 - '),
  [`${_uniqueId()}`]: generateTestSeries('Series 2 - '),
  [`${_uniqueId()}`]: generateTestSeries('Series 3 - '),
});
