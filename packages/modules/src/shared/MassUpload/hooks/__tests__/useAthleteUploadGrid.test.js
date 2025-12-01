import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { data as squadData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_squad_list';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_athlete_csv';
import {
  useFetchValidationCountryOptionsQuery,
  useFetchValidPositionOptionsQuery,
  useSearchSquadListQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import { data as countryData } from '@kitman/modules/src/shared/MassUpload/services/fetchValidationCountryOptions';
import { data as positionData } from '@kitman/modules/src/shared/MassUpload/services/fetchValidPositionOptions';
import useAthleteUploadGrid from '../useAthleteUploadGrid';

jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');

jest.useFakeTimers();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  massUploadApi: {
    useFetchValidationCountryOptionsQuery: jest.fn(),
    useFetchValidPositionOptionsQuery: jest.fn(),
    useSearchSquadListQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('useAthleteUploadGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;
    beforeEach(() => {
      useFetchValidationCountryOptionsQuery.mockReturnValue({
        data: countryData,
        isLoading: true,
      });
      useFetchValidPositionOptionsQuery.mockReturnValue({
        data: positionData,
        isLoading: true,
      });
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: true,
      });
    });

    it('returns initial data', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: data.validData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current).toHaveProperty('grid');

      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current).toHaveProperty('isError');
      expect(renderHookResult.current).toHaveProperty('ruleset');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No valid data was found in csv.'
      );
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;
    const testData = [...data.validData, ...data.invalidData];

    beforeEach(() => {
      useFetchValidationCountryOptionsQuery.mockReturnValue({
        data: countryData,
        isLoading: false,
      });
      useFetchValidPositionOptionsQuery.mockReturnValue({
        data: positionData,
        isLoading: false,
      });
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: false,
      });
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly parses the csv data', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      const columns = renderHookResult.current.grid.columns;
      expect(columns).toHaveLength(7);
      expect(renderHookResult.current.grid.rows.length).toEqual(
        testData.length
      );
      expect(columns[0].id).toEqual('FirstName');
      expect(columns[1].id).toEqual('LastName');
      expect(columns[2].id).toEqual('Email');
      expect(columns[3].id).toEqual('DOB');
      expect(columns[4].id).toEqual('SquadName');
      expect(columns[5].id).toEqual('Country');
      expect(columns[6].id).toEqual('Position');
    });

    it('correctly sets the rows with errors', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      const rows = renderHookResult.current.grid.rows;
      expect(rows.length).toEqual(testData.length);
      expect(rows[0].classnames.is__error).toEqual(false);
      expect(rows[1].classnames.is__error).toEqual(true);
    });

    it('exposes the correct values when invalid', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: testData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when invalid, when error is not on last row', () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      renderHookResult = renderHook(
        () =>
          useAthleteUploadGrid({ parsedCsv: testDataWithErrorNotOnLastRow }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });

    it('exposes the correct values when valid', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: data.validData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isError).toBe(false);
    });
  });

  describe('[isLoading]', () => {
    let renderHookResult;
    beforeEach(() => {
      useFetchValidationCountryOptionsQuery.mockReturnValue({
        data: countryData,
        isLoading: true,
      });
      useFetchValidPositionOptionsQuery.mockReturnValue({
        data: positionData,
        isLoading: true,
      });
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: true,
      });
    });

    it('exposes the correct value when isLoading', () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: data.validData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isLoading).toBe(true);
    });
  });
  describe('[isError]', () => {
    let renderHookResult;
    beforeEach(() => {
      useFetchValidationCountryOptionsQuery.mockReturnValue({
        data: countryData,
        error: true,
      });
      useFetchValidPositionOptionsQuery.mockReturnValue({
        data: positionData,
        error: true,
      });
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        error: true,
      });
    });

    it('exposes the correct value when isError', async () => {
      renderHookResult = renderHook(
        () => useAthleteUploadGrid({ parsedCsv: data.validData }),
        {
          wrapper,
        }
      ).result;

      expect(renderHookResult.current.isError).toBe(true);
    });
  });
});
