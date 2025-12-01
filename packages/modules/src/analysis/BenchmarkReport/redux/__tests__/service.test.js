import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import { getBenchmarkingReportDataClub } from '@kitman/services/src/mocks/handlers/benchmarking';

import { getWrapper } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import { useGetBenchmarkReportQuery } from '../service';

describe('service', () => {
  let request;

  describe('useGetBenchmarkReportQuery', () => {
    afterEach(() => jest.restoreAllMocks());

    describe('when ‘bm-testing-fe-side-performance-optimization’ feature flag is on', () => {
      beforeEach(() => {
        request = jest
          .spyOn(axios, 'post')
          .mockImplementation(() => ({ data: getBenchmarkingReportDataClub }));

        window.setFlag('bm-testing-fe-side-performance-optimization', true);
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('makes multiple requests', async () => {
        const { result } = renderHook(
          () =>
            useGetBenchmarkReportQuery({
              training_variable_ids: [1, 2],
              seasons: [2023, 2021],
              testing_window_ids: [1, 2, 3],
              age_group_ids: [1, 2, 3],
              maturation_status_ids: [1, 2, 3],
              national_results: false,
              club_results: true,
              compare_to: {
                athlete_ids: [123, 456],
                seasons: [2022],
                testing_window_ids: [1, 2, 3],
              },
            }),
          { wrapper: getWrapper() }
        );

        await waitFor(() =>
          expect(result.current.data).toEqual(
            Array(2)
              .fill()
              .flatMap(() => getBenchmarkingReportDataClub)
          )
        );
        expect(request).toHaveBeenNthCalledWith(
          1,
          '/benchmark/preview',
          {
            training_variable_ids: [1],
            seasons: [2023, 2021],
            testing_window_ids: [1, 2, 3],
            age_group_ids: [1, 2, 3],
            maturation_status_ids: [1, 2, 3],
            national_results: false,
            club_results: true,
            compare_to: {
              athlete_ids: [123, 456],
              seasons: [2022],
              testing_window_ids: [1, 2, 3],
            },
          },
          { timeout: 0 }
        );
        expect(request).toHaveBeenNthCalledWith(
          2,
          '/benchmark/preview',
          {
            training_variable_ids: [2],
            seasons: [2023, 2021],
            testing_window_ids: [1, 2, 3],
            age_group_ids: [1, 2, 3],
            maturation_status_ids: [1, 2, 3],
            national_results: false,
            club_results: true,
            compare_to: {
              athlete_ids: [123, 456],
              seasons: [2022],
              testing_window_ids: [1, 2, 3],
            },
          },
          { timeout: 0 }
        );
      });
    });
  });
});
