import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { data as squadData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_squad_list';
import { useSearchSquadListQuery } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_match_monitor_csv';
import useMatchMonitorUploadGrid from '../useMatchMonitorUploadGrid';

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

describe('useMatchMonitorUploadGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;
    beforeEach(() => {
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: true,
      });
    });

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: data.validData }),
          {
            wrapper,
          }
        ).result;
      });

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
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: false,
      });
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('correctly parses the csv data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: testData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        const columns = renderHookResult.current.grid.columns;
        expect(columns).toHaveLength(6);
        expect(renderHookResult.current.grid.rows.length).toEqual(
          testData.length
        );
        expect(columns[0].id).toEqual('FirstName');
        expect(columns[1].id).toEqual('LastName');
        expect(columns[2].id).toEqual('Email');
        expect(columns[3].id).toEqual('DOB');
        expect(columns[4].id).toEqual('SquadName');
        expect(columns[5].id).toEqual('Language');
      });
    });

    it('correctly sets the rows with errors', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: testData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        const rows = renderHookResult.current.grid.rows;
        expect(rows.length).toEqual(testData.length);
        expect(rows[0].classnames.is__error).toEqual(false);
        expect(rows[1].classnames.is__error).toEqual(true);
      });
    });

    it('exposes the correct values when invalid', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: data.invalidData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.isError).toBe(true);
      });
    });

    it('exposes the correct values when invalid, when error is not on last row', async () => {
      const testDataWithErrorNotOnLastRow = [
        ...data.invalidData,
        ...data.validData,
      ];

      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useMatchMonitorUploadGrid({
              parsedCsv: testDataWithErrorNotOnLastRow,
            }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.isError).toBe(true);
      });
    });

    it('exposes the correct values when valid', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: data.validData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.isError).toBe(false);
      });
    });
  });

  describe('[isLoading]', () => {
    let renderHookResult;
    beforeEach(() => {
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        isLoading: true,
      });
    });

    it('exposes the correct value when isLoading', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: data.validData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.isLoading).toBe(true);
      });
    });
  });
  describe('[isError]', () => {
    let renderHookResult;
    beforeEach(() => {
      useSearchSquadListQuery.mockReturnValue({
        data: { data: squadData },
        error: true,
      });
    });

    it('exposes the correct value when isError', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useMatchMonitorUploadGrid({ parsedCsv: data.validData }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.isError).toBe(true);
      });
    });
  });
});
