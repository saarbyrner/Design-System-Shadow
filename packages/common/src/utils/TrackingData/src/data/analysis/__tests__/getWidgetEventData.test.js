import {
  mockWidgetCacheRefreshParams,
  mockWidgetCacheRefreshData,
} from '@kitman/common/src/utils/TrackingData/src/mocks/analysis';
import { getWidgetCacheRefreshData } from '../getWidgetEventData';

describe('getWidgetCacheRefreshData()', () => {
  it('returns the correct data', () => {
    expect(
      getWidgetCacheRefreshData(mockWidgetCacheRefreshParams)
    ).toStrictEqual(mockWidgetCacheRefreshData);
  });
  it('matches the snapshot', () => {
    expect(
      getWidgetCacheRefreshData(mockWidgetCacheRefreshParams)
    ).toMatchSnapshot();
  });
});
