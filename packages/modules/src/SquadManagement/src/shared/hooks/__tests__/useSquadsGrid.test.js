import { renderHook, act } from '@testing-library/react-hooks';
import AppRoot from '@kitman/modules/src/AppRoot';

import { data as mockSquadSettings } from '../../services/mocks/data/mock_squads_settings';

import useSquadGrid from '../useSquadsGrid';

describe('useSquadGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useSquadGrid({}), {
          wrapper: AppRoot,
        }).result;
      });

      expect(renderHookResult.current).toHaveProperty('isSquadGridFetching');
      expect(renderHookResult.current).toHaveProperty('isSquadGridError');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No teams have been registered yet'
      );
      expect(renderHookResult.current.grid.id).toEqual('SquadGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    it('fetches thesquad settings', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useSquadGrid({}), {
          wrapper: AppRoot,
        }).result;
      });

      expect(renderHookResult.current.grid.rows.length).toEqual(
        mockSquadSettings.length
      );
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useSquadGrid({}), {
          wrapper: AppRoot,
        }).result;
      });

      expect(renderHookResult.current.grid.rows.length).toEqual(
        mockSquadSettings.length
      );
      const rows = renderHookResult.current.grid.rows;
      expect(rows[0].id).toEqual(mockSquadSettings[0].id);
      expect(rows[1].id).toEqual(mockSquadSettings[1].id);
      expect(rows[2].id).toEqual(mockSquadSettings[2].id);
    });
  });
});
