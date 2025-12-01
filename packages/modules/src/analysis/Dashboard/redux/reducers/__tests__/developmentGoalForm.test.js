import developmentGoalFormReducer from '../developmentGoalForm';

describe('analyticalDashboard - developmentGoalFormReducer reducer', () => {
  const defaultState = {
    isOpen: false,
    status: null,
  };

  describe('when the dashboard is not pivoted', () => {
    it('returns correct state on OPEN_DEVELOPMENT_GOAL_FORM when creating a new development goal', () => {
      const initialState = {
        ...defaultState,
        isOpen: false,
        status: null,
      };

      const action = {
        type: 'OPEN_DEVELOPMENT_GOAL_FORM',
        payload: { developmentGoal: null, pivotedAthletes: [] },
      };

      const nextState = developmentGoalFormReducer(initialState, action);
      expect(nextState).toStrictEqual({
        ...defaultState,
        isOpen: true,
        initialFormData: {
          id: null,
          athlete_id: null,
          description: '',
          development_goal_type_ids: [],
          principle_ids: [],
          start_time: null,
          close_time: null,
          copy_to_athlete_ids: [],
        },
      });
    });
  });

  describe('when the dashboard is pivoted', () => {
    it('returns correct state on OPEN_DEVELOPMENT_GOAL_FORM when creating a new development goal', () => {
      const initialState = {
        ...defaultState,
        isOpen: false,
        status: null,
      };

      const action = {
        type: 'OPEN_DEVELOPMENT_GOAL_FORM',
        payload: { developmentGoal: null, pivotedAthletes: [1, 2, 3] },
      };

      const nextState = developmentGoalFormReducer(initialState, action);
      expect(nextState).toStrictEqual({
        ...defaultState,
        isOpen: true,
        initialFormData: {
          id: null,
          athlete_id: 1,
          description: '',
          development_goal_type_ids: [],
          principle_ids: [],
          start_time: null,
          close_time: null,
          copy_to_athlete_ids: [2, 3],
        },
      });
    });
  });

  it('returns correct state on OPEN_DEVELOPMENT_GOAL_FORM when editing a development goal', () => {
    const initialState = {
      ...defaultState,
      isOpen: false,
      status: null,
    };

    const action = {
      type: 'OPEN_DEVELOPMENT_GOAL_FORM',
      payload: {
        developmentGoal: {
          id: 1,
          athlete: { id: 10 },
          description: 'Development goal description',
          development_goal_types: [{ id: 20 }, { id: 21 }],
          principles: [{ id: 30 }, { id: 31 }],
          start_time: '2020-04-14T07:00:48Z',
          close_time: '2020-05-14T07:00:48Z',
          copy_to_athlete_ids: [],
        },
        pivotedAthletes: [1, 2],
      },
    };

    const nextState = developmentGoalFormReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      initialFormData: {
        id: 1,
        athlete_id: 10,
        description: 'Development goal description',
        development_goal_type_ids: [20, 21],
        principle_ids: [30, 31],
        start_time: '2020-04-14T07:00:48Z',
        close_time: '2020-05-14T07:00:48Z',
        copy_to_athlete_ids: [],
      },
    });
  });

  it('returns correct state on CLOSE_DEVELOPMENT_GOAL_FORM', () => {
    const initialState = {
      ...defaultState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_DEVELOPMENT_GOAL_FORM',
    };

    const nextState = developmentGoalFormReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
      status: null,
    });
  });

  it('returns correct state on SAVE_DEVELOPMENT_GOAL_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: true,
    };

    const action = {
      type: 'SAVE_DEVELOPMENT_GOAL_SUCCESS',
    };

    const nextState = developmentGoalFormReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns correct state on SAVE_DEVELOPMENT_GOAL_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: true,
    };

    const action = {
      type: 'SAVE_DEVELOPMENT_GOAL_FAILURE',
    };

    const nextState = developmentGoalFormReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'FAILURE',
    });
  });

  it('returns correct state on SAVE_DEVELOPMENT_GOAL_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: true,
    };

    const action = {
      type: 'SAVE_DEVELOPMENT_GOAL_LOADING',
    };

    const nextState = developmentGoalFormReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'LOADING',
    });
  });
});
