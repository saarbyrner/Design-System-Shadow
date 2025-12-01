import {
  mockDashboardCacheRefreshParams,
  mockDashboardCacheRefreshData,
} from '@kitman/common/src/utils/TrackingData/src/mocks/analysis';
import { getDashboardCacheRefreshData } from '../getDashboardEventData';

describe('getDashboardCacheRefreshData()', () => {
  it('returns the correct data', () => {
    expect(
      getDashboardCacheRefreshData(mockDashboardCacheRefreshParams)
    ).toStrictEqual(mockDashboardCacheRefreshData);
  });
  it('matches the snapshot', () => {
    expect(
      getDashboardCacheRefreshData(mockDashboardCacheRefreshParams)
    ).toMatchSnapshot();
  });
});
