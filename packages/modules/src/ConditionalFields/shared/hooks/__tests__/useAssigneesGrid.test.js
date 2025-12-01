import uuid from 'uuid';
import { renderHook, act } from '@testing-library/react-hooks';

import { data as mockData } from '../../services/mocks/data/assignees.mock';

import ReduxProvider from '../../redux/provider';

import useAssigneesGrid, { getEmptyTableText } from '../useAssigneesGrid';

jest.useFakeTimers();

const wrapper = ReduxProvider;

describe('useAssigneesGrid', () => {
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAssigneesGrid({
              rulesetCurrentVersionId:
                mockData.screening_ruleset.current_version,
            }),
          {
            wrapper,
          }
        ).result;
      });

      expect(renderHookResult.current).toHaveProperty('isAssigneesError');
      expect(renderHookResult.current).toHaveProperty('areAssigneesFetching');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No assignments'
      );
      expect(renderHookResult.current.grid.id).toEqual('AssigneesGrid');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('fetches the assignees', async () => {
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAssigneesGrid({
              rulesetCurrentVersionId:
                mockData.screening_ruleset.current_version,
            }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.assignments.length
        );
      });
    });

    it('has the correct grid.rows', async () => {
      jest.spyOn(uuid, 'v4').mockImplementation(() => 'uuid');
      await act(async () => {
        renderHookResult = renderHook(
          () =>
            useAssigneesGrid({
              rulesetCurrentVersionId:
                mockData.screening_ruleset.current_version,
            }),
          {
            wrapper,
          }
        ).result;
      });

      await act(async () => {
        expect(renderHookResult.current.grid.rows.length).toEqual(
          mockData.assignments.length
        );
        const rows = renderHookResult.current.grid.rows;

        rows.forEach((row, index) => {
          expect(row.id).toEqual(mockData.assignments[index].id || 'uuid');
        });
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the there is no data', () => {
    expect(getEmptyTableText({ search_expression: '' })).toEqual(
      'No assignments'
    );
  });
});
