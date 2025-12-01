import gridReducer from '../grid';

describe('grid reducer', () => {
  const initialState = {
    columns: [],
    nextId: null,
    rows: [],
  };

  it('returns correct state on FETCH_GRID_SUCCESS', () => {
    const action = {
      type: 'FETCH_GRID_SUCCESS',
      payload: {
        grid: {
          columns: [
            { row_key: 'athlete', datatype: 'object', name: 'Athlete', id: 1 },
            {
              row_key: 'accommodation',
              datatype: 'plain',
              name: 'Accommodation',
              id: 23,
            },
          ],
          next_id: 12345,
          rows: [
            {
              id: 7,
              athlete: { fullname: 'Deco 10' },
              accommodation: { value: 1 },
            },
            {
              id: 8,
              athlete: { fullname: 'John Smith' },
              accommodation: { value: 3 },
            },
          ],
        },
      },
    };

    const nextState = gridReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      columns: [
        { row_key: 'athlete', datatype: 'object', name: 'Athlete', id: 1 },
        {
          row_key: 'accommodation',
          datatype: 'plain',
          name: 'Accommodation',
          id: 23,
        },
      ],
      nextId: 12345,
      rows: [
        {
          id: 7,
          athlete: { fullname: 'Deco 10' },
          accommodation: { value: 1 },
        },
        {
          id: 8,
          athlete: { fullname: 'John Smith' },
          accommodation: { value: 3 },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_ATHLETE_COMMENTS', () => {
    const state = {
      ...initialState,
      rows: [
        {
          id: 7,
          athlete: { id: 7 },
          accommodation: { comment: { content: '<p>test</p>' } },
        },
      ],
    };

    const action = {
      type: 'UPDATE_ATHLETE_COMMENTS',
      payload: {
        athleteId: 7,
        newComments: [
          { assessment_item_id: 49800, value: '<p>Updated comment</p>' },
        ],
        assessmentItems: [
          {
            id: 49800,
            item: { training_variable: { perma_id: 'accommodation' } },
          },
        ],
      },
    };

    const nextState = gridReducer(state, action);
    expect(nextState).toEqual({
      ...state,
      rows: [
        {
          id: 7,
          athlete: { id: 7 },
          accommodation: { comment: { content: '<p>Updated comment</p>' } },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_GRID', () => {
    const action = {
      type: 'UPDATE_GRID',
      payload: {
        newGrid: {
          columns: [
            { row_key: 'athlete', datatype: 'object', name: 'Athlete', id: 1 },
          ],
          rows: [{ id: 7, athlete: { fullname: 'Deco 10' } }],
        },
      },
    };

    const nextState = gridReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      columns: [
        { row_key: 'athlete', datatype: 'object', name: 'Athlete', id: 1 },
      ],
      rows: [{ id: 7, athlete: { fullname: 'Deco 10' } }],
      nextId: undefined,
    });
  });

  it('returns correct state on RESET_GRID', () => {
    const state = {
      ...initialState,
      rows: [{ id: 7, athlete: { fullname: 'Deco 10' } }],
    };

    const action = {
      type: 'RESET_GRID',
      payload: { grid: { columns: [], rows: [] } },
    };

    const nextState = gridReducer(state, action);
    expect(nextState).toEqual({
      ...state,
      columns: [],
      rows: [],
      nextId: undefined,
    });
  });

  it('returns correct state on UPDATE_GRID_ROW', () => {
    const state = {
      ...initialState,
      rows: [
        { id: 7, athlete: { id: 7 }, accommodation: { value: 1 } },
        { id: 8, athlete: { id: 8 }, accommodation: { value: 3 } },
      ],
    };

    const action = {
      type: 'UPDATE_GRID_ROW',
      payload: {
        attributes: { accommodation: { value: 5 } },
        rowId: 8,
      },
    };

    const nextState = gridReducer(state, action);
    expect(nextState).toEqual({
      ...state,
      rows: [
        { id: 7, athlete: { id: 7 }, accommodation: { value: 1 } },
        { id: 8, athlete: { id: 8 }, accommodation: { value: 5 } },
      ],
    });
  });

  it('returns default state when action type is unknown', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = gridReducer(initialState, action);
    expect(nextState).toEqual(initialState);
  });
});
