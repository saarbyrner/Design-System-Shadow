import {
  getBenchmarkingReportData as serverResponse,
  getBenchmarkingReportDataClub as serverResponseClub,
  getBenchmarkingReportDataNational as serverResponseNational,
} from '@kitman/services/src/mocks/handlers/benchmarking';
import { axios } from '@kitman/common/src/utils/services';
import getBenchmarkingReport from '../getBenchmarkingReport';

describe('getBenchmarkingReport', () => {
  let request;

  describe('with Club and National data', () => {
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => ({ data: serverResponse }));
    });

    afterEach(() => jest.restoreAllMocks());

    it('should respond with benchmark report table data', async () => {
      const response = await getBenchmarkingReport({
        training_variable_ids: [1, 2],
        seasons: [2023, 2021],
        testing_window_ids: [1, 2, 3],
        age_group_ids: [1, 2, 3],
        maturation_status_ids: [1, 2, 3],
        national_results: true,
        club_results: true,
        compare_to: {
          athlete_ids: [123, 456],
          seasons: [2022],
          testing_window_ids: [1, 2, 3],
        },
      });

      expect(response).toEqual(serverResponse);
      expect(request).toHaveBeenCalledWith(
        '/benchmark/preview',
        {
          training_variable_ids: [1, 2],
          seasons: [2023, 2021],
          testing_window_ids: [1, 2, 3],
          age_group_ids: [1, 2, 3],
          maturation_status_ids: [1, 2, 3],
          national_results: true,
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

  describe('with National data', () => {
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => ({ data: serverResponseNational }));
    });

    afterEach(() => jest.restoreAllMocks());

    it('should respond with benchmark report table data', async () => {
      const response = await getBenchmarkingReport({
        training_variable_ids: [1, 2],
        seasons: [2023, 2021],
        testing_window_ids: [1, 2, 3],
        age_group_ids: [1, 2, 3],
        maturation_status_ids: [1, 2, 3],
        national_results: true,
        club_results: false,
        compare_to: {
          athlete_ids: [123, 456],
          seasons: [2022],
          testing_window_ids: [1, 2, 3],
        },
      });

      expect(response).toEqual(serverResponseNational);
      expect(request).toHaveBeenCalledWith(
        '/benchmark/preview',
        {
          training_variable_ids: [1, 2],
          seasons: [2023, 2021],
          testing_window_ids: [1, 2, 3],
          age_group_ids: [1, 2, 3],
          maturation_status_ids: [1, 2, 3],
          national_results: true,
          club_results: false,
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

  describe('with Club data', () => {
    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => ({ data: serverResponseClub }));
    });

    afterEach(() => jest.restoreAllMocks());

    it('should respond with benchmark report table data', async () => {
      const response = await getBenchmarkingReport({
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
      });

      expect(response).toEqual(serverResponseClub);
      expect(request).toHaveBeenCalledWith(
        '/benchmark/preview',
        {
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
        },
        { timeout: 0 }
      );
    });
  });
});
