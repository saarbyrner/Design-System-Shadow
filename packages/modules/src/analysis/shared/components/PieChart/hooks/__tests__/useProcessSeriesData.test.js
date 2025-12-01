import { renderHook } from '@testing-library/react-hooks';
import { getChartValue } from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import { getOtherSegementLabel } from '../../constants';

import useProcessSeriesData from '../useProcessSeriesData';

describe('PieChart hooks | useProcessSeriesData', () => {
  const valueAccessor = ({ value }) => getChartValue(value, 'sum');

  it('filters out null and zero values from the data', () => {
    const data = [
      { label: 'Blindside Flanker', value: '6800' },
      { label: 'Inside Center', value: '2500' },
      { label: 'Wing', value: 0 },
      { label: 'Tight-head Prop', value: '3240' },
      { label: 'No 8', value: '2155' },
      { label: 'Loose-head Prop', value: null },
    ];

    const props = {
      data,
      valueAccessor,
    };

    const { result } = renderHook(() => useProcessSeriesData({ ...props }));

    expect(result.current.processedData).toStrictEqual([
      { label: 'Blindside Flanker', value: '6800' },
      { label: 'Tight-head Prop', value: '3240' },
      { label: 'Inside Center', value: '2500' },
      { label: 'No 8', value: '2155' },
    ]);
  });

  describe('when data contains less than 10 items', () => {
    const data = [
      { label: 'Blindside Flanker', value: '6800' },
      { label: 'Inside Center', value: '2500' },
      { label: 'Wing', value: '5005' },
      { label: 'Tight-head Prop', value: '3240' },
      { label: 'No 8', value: '2155' },
      { label: 'Loose-head Prop', value: '4005' },
    ];

    const props = {
      data,
      valueAccessor,
    };

    it('returns the data sorted high to low with no other segment', () => {
      const { result } = renderHook(() => useProcessSeriesData({ ...props }));

      expect(result.current.processedData).toStrictEqual([
        { label: 'Blindside Flanker', value: '6800' },
        { label: 'Wing', value: '5005' },
        { label: 'Loose-head Prop', value: '4005' },
        { label: 'Tight-head Prop', value: '3240' },
        { label: 'Inside Center', value: '2500' },
        { label: 'No 8', value: '2155' },
      ]);
    });

    it('returns an empty array for the other segment', () => {
      const { result } = renderHook(() => useProcessSeriesData({ ...props }));

      expect(result.current.otherSegment).toStrictEqual([]);
    });
  });

  describe('when data contains 10 or more items', () => {
    const data = [
      { label: 'Blindside Flanker', value: '6800' },
      { label: 'Inside Center', value: '2500' },
      { label: 'Wing', value: '5005' },
      { label: 'Tight-head Prop', value: '3240' },
      { label: 'No 8', value: '2155' },
      { label: 'Loose-head Prop', value: '4005' },
      { label: 'Other', value: '1885' },
      { label: 'Hooker', value: '2550' },
      { label: 'Openside Flanker', value: '8850' },
      { label: 'Out Half', value: '500' },
      { label: 'Fullback', value: '250' },
    ];

    const props = {
      data,
      valueAccessor,
    };

    it('returns the data sorted high to low and includes other segment', () => {
      const { result } = renderHook(() => useProcessSeriesData({ ...props }));
      const otherLabel = getOtherSegementLabel();

      expect(result.current.processedData).toStrictEqual([
        { label: 'Openside Flanker', value: '8850' },
        { label: 'Blindside Flanker', value: '6800' },
        { label: 'Wing', value: '5005' },
        { label: 'Loose-head Prop', value: '4005' },
        { label: 'Tight-head Prop', value: '3240' },
        { label: 'Hooker', value: '2550' },
        { label: 'Inside Center', value: '2500' },
        { label: 'No 8', value: '2155' },
        { label: 'Other', value: '1885' },
        { label: otherLabel, value: '750' }, // combines Out Half and Fullback
      ]);
    });

    it('returns an array for the other segment', () => {
      const { result } = renderHook(() => useProcessSeriesData({ ...props }));

      expect(result.current.otherSegment).toStrictEqual([
        { label: 'Out Half', value: '500' },
        { label: 'Fullback', value: '250' },
      ]);
    });
  });
});
