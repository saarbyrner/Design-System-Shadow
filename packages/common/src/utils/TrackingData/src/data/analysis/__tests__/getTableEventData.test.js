import { mockTableTypeEventData } from '@kitman/common/src/utils/TrackingData/src/mocks/analysis';
import getTableType from '../getTableEventData';

describe('getTableType()', () => {
  it('returns the correct data', () => {
    expect(getTableType(mockTableTypeEventData)).toStrictEqual(
      mockTableTypeEventData
    );
  });
  it('matches the snapshot', () => {
    expect(getTableType(mockTableTypeEventData)).toMatchSnapshot();
  });
});
