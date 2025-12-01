import { waitFor } from '@testing-library/react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import BenchmarkReport from '../index';
import { BenchmarkDashboardTranslated as BenchmarkDashboard } from '../components';

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());

describe('BenchmarkReport', () => {
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
    window.featureFlags = { 'rep-show-benchmark-reporting': true };
  });

  afterEach(() => {
    window.featureFlags = { 'rep-show-benchmark-reporting': false };
  });

  describe('when feature flag rep-show-benchmark-reporting is false', () => {
    it('redirects to home dashboards', async () => {
      window.featureFlags = {};

      BenchmarkReport();

      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/home_dashboards');
      });
    });
  });

  describe('when feature flag rep-show-benchmark-reporting is true', () => {
    it('renders the BenchmarkDashboard', () => {
      const benchmarkreport = BenchmarkReport();
      expect(benchmarkreport).toEqual(<BenchmarkDashboard />);
    });
  });
});
