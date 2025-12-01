import { renderHook, act } from '@testing-library/react-hooks';
import { data as mockTryoutAthletes } from '@kitman/services/src/mocks/handlers/medical/getTryoutAthletes';
import useTryoutAthletes from '../useTryoutAthletes';

jest.useFakeTimers();

describe('useTryoutAthletes', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTryoutAthletes),
      })
    );
  });

  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });
      expect(renderHookResult.current).toHaveProperty('requestStatus');
      expect(renderHookResult.current).toHaveProperty('onFetchTryoutAthletes');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current).toHaveProperty('onUpdateFilter');
      expect(renderHookResult.current).toHaveProperty('filteredSearchParams');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No tryout athletes for this period'
      );
      expect(renderHookResult.current.grid.id).toEqual('AthleteTryoutsGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    it('fetches the tryout athletes', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchTryoutAthletes();
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockTryoutAthletes.athletes.length
        );
      });
    });

    it('has the correct requestStatus', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchTryoutAthletes();
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.requestStatus).toEqual('SUCCESS');
      });
    });

    it('has the correct grid.columns', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchTryoutAthletes();
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.grid.columns.length).toEqual(4);
        expect(renderHookResult.current.grid.columns[0].id).toEqual('athlete');
        expect(renderHookResult.current.grid.columns[0].row_key).toEqual(
          'athlete'
        );
        expect(renderHookResult.current.grid.columns[1].id).toEqual(
          'parent_organisation'
        );
        expect(renderHookResult.current.grid.columns[1].row_key).toEqual(
          'parent_organisation'
        );
        expect(renderHookResult.current.grid.columns[2].id).toEqual(
          'athlete_joined_date'
        );
        expect(renderHookResult.current.grid.columns[2].row_key).toEqual(
          'athlete_joined_date'
        );
        expect(renderHookResult.current.grid.columns[3].id).toEqual(
          'trial_expires_date'
        );
        expect(renderHookResult.current.grid.columns[3].row_key).toEqual(
          'trial_expires_date'
        );
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchTryoutAthletes();
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockTryoutAthletes.athletes.length
        );
        const rows = renderHookResult.current.grid.rows;
        expect(rows[0].id).toEqual(mockTryoutAthletes.athletes[0].id);
        expect(rows[1].id).toEqual(mockTryoutAthletes.athletes[1].id);
        expect(rows[2].id).toEqual(mockTryoutAthletes.athletes[2].id);
        expect(rows[3].id).toEqual(mockTryoutAthletes.athletes[3].id);
        expect(rows[4].id).toEqual(mockTryoutAthletes.athletes[4].id);
        expect(rows[5].id).toEqual(mockTryoutAthletes.athletes[5].id);
        expect(rows[6].id).toEqual(mockTryoutAthletes.athletes[6].id);
      });
    });

    it('correctly updates the filter', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      await act(async () => {
        renderHookResult.current.onFetchTryoutAthletes();
      });

      await Promise.resolve();

      await act(async () => {
        renderHookResult.current.onUpdateFilter({
          athlete_name: 'Stone',
        });
      });

      await Promise.resolve();
      await act(async () => {
        expect(renderHookResult.current.filteredSearchParams).toEqual({
          athlete_name: 'Stone',
        });
      });
    });
  });
  describe('[nfl initial data]', () => {
    let renderHookResult;
    it('returns the correct text when sport org is nfl', async () => {
      window.organisationSport = 'nfl';
      await act(async () => {
        renderHookResult = renderHook(() => useTryoutAthletes()).result;
      });

      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No shared players for this period'
      );
    });
  });
});
