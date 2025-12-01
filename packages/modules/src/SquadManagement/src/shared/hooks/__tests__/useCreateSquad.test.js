import { renderHook, act } from '@testing-library/react-hooks';
import AppRoot from '@kitman/modules/src/AppRoot';
import { server, rest } from '@kitman/services/src/mocks/server';

import { data as mockDivisionOptions } from '../../services/mocks/data/mock_division_list';

import useCreateSquad from '../useCreateSquad';

describe('useCreateSquad', () => {
  const wrapper = AppRoot;

  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', async () => {
      renderHookResult = renderHook(() => useCreateSquad({}), {
        wrapper,
      }).result;

      expect(renderHookResult.current).toHaveProperty('formState');
      expect(renderHookResult.current).toHaveProperty('isLoading');
      expect(renderHookResult.current).toHaveProperty('isError');
      expect(renderHookResult.current).toHaveProperty('onSave');
      expect(renderHookResult.current).toHaveProperty('isFormCompleted');
      expect(renderHookResult.current).toHaveProperty('teamNameOptions');
      expect(renderHookResult.current).toHaveProperty('divisionOptions');
      expect(renderHookResult.current).toHaveProperty(
        'conferenceDivisionOptions'
      );
      expect(renderHookResult.current).toHaveProperty('selectedDivisionId');
      expect(renderHookResult.current).toHaveProperty('onSelectDivision');
      expect(renderHookResult.current).toHaveProperty(
        'onSelectConferenceDivision'
      );
      expect(renderHookResult.current).toHaveProperty('onUpdateFormState');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;

    it('fetches the organisation divisions options', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.divisionOptions.length).toEqual(
        mockDivisionOptions.length
      );
    });

    it('populates the correct value when a division is selected', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      await act(async () => renderHookResult.current.onSelectDivision(1));
      expect(renderHookResult.current.selectedDivisionId).toEqual(1);
      expect(renderHookResult.current.formState.division_id).toEqual(1);
      expect(renderHookResult.current.formState.start_season).toEqual(
        mockDivisionOptions[0].markers.start_season
      );
      expect(renderHookResult.current.formState.end_season).toEqual(
        mockDivisionOptions[0].markers.end_season
      );
    });

    it('filters out squads that already exist', async () => {
      server.use(
        rest.get('/settings/squads', (req, res, ctx) => {
          return res(
            ctx.json([
              { name: 'U15' },
              { name: 'U16' },
              { name: 'U17' },
              { name: 'U18' },
              { name: 'U19' },
            ])
          );
        })
      );

      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      await act(async () => renderHookResult.current.onSelectDivision(1));

      expect(renderHookResult.current.teamNameOptions).toEqual([
        {
          label: 'U13',
          value: 'U13',
        },
        {
          label: 'U14',
          value: 'U14',
        },
      ]);
    });

    it('correctly updates the selected squad', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      await act(async () => renderHookResult.current.onSelectDivision(1));

      await act(async () =>
        renderHookResult.current.onUpdateFormState({ squadId: 1 })
      );

      expect(renderHookResult.current.formState.squadId).toEqual(1);
    });

    it('correctly resets the form', async () => {
      renderHookResult = renderHook(() => useCreateSquad({ reset: true }), {
        wrapper,
      }).result;

      expect(renderHookResult.current.formState).toEqual({
        name: null,
        division_id: null,
        start_season: null,
        end_season: null,
        in_season: null,
      });
    });

    it('renders conference options when a division has a conference', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      act(() => {
        renderHookResult.current.onSelectDivision(1);
      });

      act(() => {
        renderHookResult.current.onSelectConferenceDivision(9);
      });

      // The final division_id should be the Conference Division's ID
      expect(renderHookResult.current.formState.division_id).toBe(9);
      // But the season markers should still be the parent's
      expect(renderHookResult.current.formState.start_season).toBe(
        mockDivisionOptions[0].markers.start_season
      );
    });

    it('does not render conference options when a division has no child conference', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      // Select a division without conference divisions
      act(() => {
        renderHookResult.current.onSelectDivision(2);
      });

      // There should be no conference division options
      expect(renderHookResult.current.conferenceDivisionOptions).toEqual([]);
    });

    it('updates the form state when the team name is changed', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      await act(async () =>
        renderHookResult.current.onUpdateFormState({ name: 'New Squad' })
      );

      expect(renderHookResult.current.formState.name).toEqual('New Squad');
    });
  });

  describe('[form completion]', () => {
    let renderHookResult;

    it('marks the form as completed when all required fields are filled', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      await act(async () => renderHookResult.current.onSelectDivision(1));
      await act(async () =>
        renderHookResult.current.onUpdateFormState({
          name: 'Test Squad',
          start_season: '2023',
          end_season: '2024',
        })
      );

      expect(renderHookResult.current.isFormCompleted).toBe(true);
    });

    it('marks the form as incomplete when required fields are missing', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateSquad({}), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isFormCompleted).toBe(false);
    });
  });
});
