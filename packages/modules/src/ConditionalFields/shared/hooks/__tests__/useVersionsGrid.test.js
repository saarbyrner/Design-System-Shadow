import { renderHook, act } from '@testing-library/react-hooks';

import { data as mockData } from '../../services/mocks/data/mock_versions_list';

import ReduxProvider from '../../redux/provider';

import useVersionsGrid, { getEmptyTableText } from '../useVersionsGrid';

jest.useFakeTimers();

const wrapper = ReduxProvider;

describe('useVersionsGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useVersionsGrid({ organisation_id: 66, rulesetId: 36 }),
          {
            wrapper,
          }
        ).result;
      });

      expect(renderHookResult.current).toHaveProperty('isRulesetError');
      expect(renderHookResult.current).toHaveProperty('isRulesetFetching');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No Versions have been created yet'
      );
      expect(renderHookResult.current.grid.id).toEqual('VersionsGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the versions', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useVersionsGrid({ organisation_id: 66, rulesetId: 36 }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.versions.length
        );
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useVersionsGrid({ organisation_id: 66, rulesetId: 36 }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.versions.length
        );
        const rows = renderHookResult.current.grid.rows;

        rows.forEach((row, index) => {
          expect(row.id).toEqual(mockData.versions[index].id);
        });
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the there is no data', () => {
    expect(getEmptyTableText({ search_expression: '' })).toEqual(
      'No Versions have been created yet'
    );
  });
});
