import { initialState } from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import reducer, { actionTypes } from '../reducer';

describe('[FormationEditor] Reducer', () => {
  it('returns the initial state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  describe('[Action] SET_FIELD', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        id: 1,
        name: 'name',
        columns: 2,
        rows: 2,
        width: 5,
        height: 10,
        cellSize: 5,
      };
      const action = { type: actionTypes.SET_FIELD, payload };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        field: payload,
      });
    });
  });

  describe('[Action] SET_SELECTED_GAME_FORMAT', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        id: 1,
        name: 'name',
        number_of_players: 11,
      };
      const action = { type: actionTypes.SET_SELECTED_GAME_FORMAT, payload };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        selectedGameFormat: payload,
      });
    });
  });

  describe('[Action] SET_SELECTED_FORMATION', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        id: 1,
        name: 'name',
        number_of_players: 11,
      };
      const action = { type: actionTypes.SET_SELECTED_FORMATION, payload };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        selectedFormation: payload,
      });
    });
  });

  describe('[Action] SET_FORMATION_COORDINATES', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        '0_5': {
          id: 1,
          field_id: 1,
          formation_id: 1,
          order: 1,
          position_id: 84,
          x: 0,
          y: 5,
          position: {
            id: 84,
            abbreviation: 'GK',
          },
        },
      };
      const action = { type: actionTypes.SET_FORMATION_COORDINATES, payload };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        formationCoordinates: payload,
      });
    });
  });

  describe('[Action] SET_FORMATION_COORDINATES_COPY', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        '0_5': {
          id: 1,
          field_id: 1,
          formation_id: 1,
          order: 1,
          position_id: 84,
          x: 0,
          y: 5,
          position: {
            id: 84,
            abbreviation: 'GK',
          },
        },
      };
      const action = {
        type: actionTypes.SET_FORMATION_COORDINATES_COPY,
        payload,
      };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        formationCoordinatesCopy: payload,
      });
    });
  });

  describe('[Action] SET_IS_LOADING', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = true;
      const action = {
        type: actionTypes.SET_IS_LOADING,
        payload,
      };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        isLoading: payload,
      });
    });
  });

  describe('[Action] SET_FORMATIONS_GROUPED_BY_GAME_FORMAT', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = {
        9: [
          {
            id: 1,
            name: '3-3-2',
            number_of_players: 9,
          },
        ],
      };
      const action = {
        type: actionTypes.SET_FORMATIONS_GROUPED_BY_GAME_FORMAT,
        payload,
      };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        formationsGroupedByGameFormat: payload,
      });
    });
  });

  describe('[Action] SET_ACTIVE_COORDINATE_ID', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      expect(
        reducer(state, {
          type: actionTypes.SET_ACTIVE_COORDINATE_ID,
          payload: '0_5',
        })
      ).toEqual({
        ...initialState,
        activeCoordinateId: '0_5',
      });

      expect(
        reducer(state, {
          type: actionTypes.SET_ACTIVE_COORDINATE_ID,
          payload: undefined,
        })
      ).toEqual({
        ...initialState,
        activeCoordinateId: undefined,
      });
    });
  });

  describe('[Action] SET_HIGHLIGHT_POSITION_ID', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      expect(
        reducer(state, {
          type: actionTypes.SET_HIGHLIGHT_POSITION_ID,
          payload: 10,
        })
      ).toEqual({
        ...initialState,
        highlightPositionId: 10,
      });

      expect(
        reducer(state, {
          type: actionTypes.SET_HIGHLIGHT_POSITION_ID,
          payload: undefined,
        })
      ).toEqual({
        ...initialState,
        highlightPositionId: undefined,
      });
    });
  });

  describe('[Action] SET_UPDATE_LIST', () => {
    it('returns the correct value', () => {
      const payload = {
        undo: [
          {
            from: {
              id: 1,
              field_id: 1,
              formation_id: 1,
              order: 1,
              position_id: 84,
              x: 0,
              y: 5,
              position: {
                id: 84,
                abbreviation: 'GK',
              },
            },
            to: {
              id: 1,
              field_id: 1,
              formation_id: 1,
              order: 1,
              position_id: 96,
              x: 4,
              y: 8,
              position: {
                id: 96,
                abbreviation: 'CF',
              },
            },
          },
        ],
        redo: [
          {
            from: {},
            to: {},
          },
        ],
      };
      const action = {
        type: actionTypes.SET_UPDATE_LIST,
        payload,
      };
      const newState = reducer(undefined, action);
      expect(newState).toEqual({
        ...initialState,
        updateList: payload,
      });
    });
  });

  describe('[Action] SET_IS_SAVING_FORMATION', () => {
    it('returns the correct value', () => {
      const state = reducer(initialState, {});
      expect(state).toEqual(initialState);

      const payload = true;
      const action = {
        type: actionTypes.SET_IS_SAVING_FORMATION,
        payload,
      };
      const newState = reducer(state, action);
      expect(newState).toEqual({
        ...initialState,
        isSavingFormation: payload,
      });
    });
  });
});
