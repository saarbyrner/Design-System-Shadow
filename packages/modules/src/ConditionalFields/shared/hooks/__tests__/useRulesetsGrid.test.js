import { renderHook, act } from '@testing-library/react-hooks';

import { data as mockData } from '../../services/mocks/data/mock_rulesets_list';

import ReduxProvider from '../../redux/provider';

import useRulesetsGrid, { getEmptyTableText } from '../useRulesetsGrid';

jest.useFakeTimers();

const wrapper = ReduxProvider;

describe('useRulesetsGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useRulesetsGrid({ organisation_id: 66 }),
          {
            wrapper,
          }
        ).result;
      });

      expect(renderHookResult.current).toHaveProperty('isRulesetsListError');
      expect(renderHookResult.current).toHaveProperty('isRulesetsListFetching');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No Rulesets have been created yet'
      );
      expect(renderHookResult.current.grid.id).toEqual('RulesetsGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the rulesets', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useRulesetsGrid({ organisation_id: 115 }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.length
        );
      });
    });

    it('has the correct grid.rows', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () => useRulesetsGrid({ organisation_id: 115 }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.length
        );
        const rows = renderHookResult.current.grid.rows;

        rows.forEach((row, index) => {
          expect(row.id).toEqual(mockData[index].id);
        });
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the there is no data', () => {
    expect(getEmptyTableText({ search_expression: '' })).toEqual(
      'No Rulesets have been created yet'
    );
  });
});
