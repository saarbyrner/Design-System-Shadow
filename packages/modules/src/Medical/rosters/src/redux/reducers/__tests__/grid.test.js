import gridReducer from '../grid';

describe('grid reducer', () => {
  const initialState = {
    columns: [],
    nextId: null,
    rows: [],
  };

  test('returns correct state on FETCH_GRID_SUCCESS', () => {
    const action = {
      type: 'FETCH_GRID_SUCCESS',
      payload: {
        grid: {
          columns: [
            {
              row_key: 'athlete',
              datatype: 'object',
              name: 'Athlete',
              assessment_item_id: null,
              readonly: true,
              id: 1,
              default: true,
            },
          ],
          next_id: 12345,
          rows: [
            {
              id: 7,
              athlete: {
                fullname: 'Deco 10',
                avatar_url: 'test_avatar_url.png',
              },
              accommodation: {
                value: 1,
                comment: {
                  content: '<p>test</p>',
                  created_at: 'fake_test_date_string',
                },
              },
            },
            {
              id: 8,
              athlete: {
                fullname: 'John Smith',
                avatar_url: 'test_avatar_url_2.png',
              },
              accommodation: { value: 3, comment: null },
            },
          ],
        },
        athleteId: 7,
      },
    };

    const nextState = gridReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      columns: [
        {
          row_key: 'athlete',
          datatype: 'object',
          name: 'Athlete',
          assessment_item_id: null,
          readonly: true,
          id: 1,
          default: true,
        },
      ],
      next_id: 12345,
      rows: [
        {
          id: 7,
          athlete: {
            fullname: 'Deco 10',
            avatar_url: 'test_avatar_url.png',
          },
          accommodation: {
            value: 1,
            comment: {
              content: '<p>test</p>',
              created_at: 'fake_test_date_string',
            },
          },
        },
        {
          id: 8,
          athlete: {
            fullname: 'John Smith',
            avatar_url: 'test_avatar_url_2.png',
          },
          accommodation: { value: 3, comment: null },
        },
      ],
    });
  });

  test('returns correct state on RESET_GRID', () => {
    const action = {
      type: 'RESET_GRID',
    };

    const nextState = gridReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      columns: [],
      next_id: null,
      rows: [],
    });
  });

  test('returns correct state on SET_GRID_PAGINATION', () => {
    const action = {
      type: 'SET_GRID_PAGINATION',
      payload: {
        currentId: 56789,
      },
    };
    const stateWithInitialCurrentId = { ...initialState, current_id: null };
    const nextState = gridReducer(stateWithInitialCurrentId, action);
    expect(nextState).toEqual({
      ...stateWithInitialCurrentId,
      current_id: 56789,
    });
  });

  test('returns correct state on RESET_GRID_PAGINATION', () => {
    const stateWithCurrentId = { ...initialState, current_id: 56789 };
    const action = {
      type: 'RESET_GRID_PAGINATION',
    };

    const nextState = gridReducer(stateWithCurrentId, action);
    expect(nextState).toEqual({
      ...stateWithCurrentId,
      current_id: null,
    });
  });
});
