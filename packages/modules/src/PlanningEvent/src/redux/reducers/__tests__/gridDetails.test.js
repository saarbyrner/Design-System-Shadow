import gridDetailsReducer from '../gridDetails';

describe('gridDetails reducer', () => {
  const initialState = {
    updatedAssessmentGridRows: [],
    updatedWorkloadGridRows: [],
  };

  it('should handle SET_SELECTED_GRID_DETAILS', () => {
    const action = {
      type: 'SET_SELECTED_GRID_DETAILS',
      payload: {
        gridDetails: {
          id: 123,
          name: 'Training Assessment',
          type: 'ASSESSMENT',
          participationLevels: [{ id: 1, name: 'Level 1' }],
        },
      },
    };

    const nextState = gridDetailsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      id: 123,
      name: 'Training Assessment',
      type: 'ASSESSMENT',
      participationLevels: [{ id: 1, name: 'Level 1' }],
    });
  });

  describe('UPDATE_GRID_ROW', () => {
    it('should update an existing assessment row', () => {
      const state = {
        id: 123,
        name: 'Training Assessment',
        type: 'ASSESSMENT',
        updatedAssessmentGridRows: [
          { id: 10, assessmentItemId: 900, value: 4 },
        ],
        updatedWorkloadGridRows: [],
      };

      const action = {
        type: 'UPDATE_GRID_ROW',
        payload: {
          attributes: {
            assessment_item_id: 900,
            value: 8,
          },
          rowId: 10,
        },
      };

      const nextState = gridDetailsReducer(state, action);
      expect(nextState).toEqual({
        ...state,
        updatedAssessmentGridRows: [
          { id: 10, assessmentItemId: 900, value: 8 },
        ],
      });
    });

    it('should add a new assessment row', () => {
      const state = {
        id: 123,
        name: 'Training Assessment',
        type: 'ASSESSMENT',
        updatedAssessmentGridRows: [],
        updatedWorkloadGridRows: [],
      };

      const action = {
        type: 'UPDATE_GRID_ROW',
        payload: {
          attributes: {
            assessment_item_id: 900,
            value: 4,
          },
          rowId: 10,
        },
      };

      const nextState = gridDetailsReducer(state, action);
      expect(nextState).toEqual({
        ...state,
        updatedAssessmentGridRows: [
          { id: 10, assessmentItemId: 900, value: 4 },
        ],
      });
    });

    it('should add a workload row if not already present', () => {
      const state = {
        id: 1,
        name: 'Workload',
        type: 'DEFAULT',
        updatedAssessmentGridRows: [],
        updatedWorkloadGridRows: [],
      };

      const action = {
        type: 'UPDATE_GRID_ROW',
        payload: {
          attributes: {
            rpe: 8,
          },
          rowId: 10,
        },
      };

      const nextState = gridDetailsReducer(state, action);
      expect(nextState).toEqual({
        ...state,
        updatedWorkloadGridRows: [10],
      });
    });

    it('should not duplicate workload rows', () => {
      const state = {
        id: 1,
        name: 'Workload',
        type: 'DEFAULT',
        updatedAssessmentGridRows: [],
        updatedWorkloadGridRows: [10],
      };

      const action = {
        type: 'UPDATE_GRID_ROW',
        payload: {
          attributes: {
            rpe: 10,
          },
          rowId: 10,
        },
      };

      const nextState = gridDetailsReducer(state, action);
      expect(nextState).toEqual(state);
    });
  });

  it('should handle CLEAR_UPDATED_GRID_ROWS', () => {
    const state = {
      ...initialState,
      updatedAssessmentGridRows: [11],
      updatedWorkloadGridRows: [1, 19, 22, 10],
    };

    const action = {
      type: 'CLEAR_UPDATED_GRID_ROWS',
    };

    const nextState = gridDetailsReducer(state, action);
    expect(nextState).toEqual({
      ...state,
      updatedAssessmentGridRows: [],
      updatedWorkloadGridRows: [],
    });
  });

  it('should return default state for unknown action types', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = gridDetailsReducer(undefined, action);
    expect(nextState).toEqual({
      ...initialState,
      id: 'default',
      name: 'Workload',
      type: 'DEFAULT',
    });
  });

  it('should handle empty initial state', () => {
    const action = {
      type: 'SET_SELECTED_GRID_DETAILS',
      payload: {
        gridDetails: {
          id: 456,
          name: 'New Grid',
          type: 'DEFAULT',
          participationLevels: [],
        },
      },
    };

    const nextState = gridDetailsReducer(undefined, action);
    expect(nextState).toEqual({
      ...initialState,
      id: 456,
      name: 'New Grid',
      type: 'DEFAULT',
      participationLevels: [],
    });
  });
});
