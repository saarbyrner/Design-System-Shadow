import commentsReducer from '../comments';

describe('comments reducer', () => {
  const initialState = {
    athleteComments: [],
    athleteLinkedToComments: {},
    isPanelOpen: false,
    panelViewType: 'VIEW',
  };

  it('returns correct state on SET_ATHLETE_COMMENTS', () => {
    const action = {
      type: 'SET_ATHLETE_COMMENTS',
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
            {
              row_key: 'accommodation',
              datatype: 'plain',
              name: 'Accommodation',
              assessment_item_id: 49800,
              readonly: false,
              id: 23,
              default: false,
            },
          ],
          next_id: null,
          rows: [
            {
              id: 7,
              athlete: {
                id: 7,
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
                id: 8,
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

    const nextState = commentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteComments: [
        {
          assessmentItemId: 49800,
          assessmentItemName: 'Accommodation',
          note: {
            content: '<p>test</p>',
            createdAt: 'fake_test_date_string',
          },
        },
      ],
    });
  });

  it('returns correct state on SET_ATHLETE_LINKED_TO_COMMENTS', () => {
    const action = {
      type: 'SET_ATHLETE_LINKED_TO_COMMENTS',
      payload: {
        athlete: {
          id: 30693,
          fullname: 'Deco 10',
          avatar_url: 'test_avatar_url.png',
        },
      },
    };

    const nextState = commentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      athleteLinkedToComments: {
        id: 30693,
        fullname: 'Deco 10',
        avatar_url: 'test_avatar_url.png',
      },
    });
  });

  it('returns correct state on SET_COMMENTS_PANEL_VIEW_TYPE', () => {
    const action = {
      type: 'SET_COMMENTS_PANEL_VIEW_TYPE',
      payload: {
        viewType: 'EDIT',
      },
    };

    const nextState = commentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      panelViewType: 'EDIT',
    });
  });

  it('returns correct state on SET_IS_COMMENTS_SIDE_PANEL_OPEN', () => {
    const action = {
      type: 'SET_IS_COMMENTS_SIDE_PANEL_OPEN',
      payload: {
        isOpen: true,
      },
    };

    const nextState = commentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isPanelOpen: true,
    });
  });

  it('returns default state when action type is unknown', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    const nextState = commentsReducer(initialState, action);
    expect(nextState).toEqual(initialState);
  });

  it('handles empty initial state correctly', () => {
    const action = {
      type: 'SET_COMMENTS_PANEL_VIEW_TYPE',
      payload: {
        viewType: 'EDIT',
      },
    };

    const nextState = commentsReducer(undefined, action);
    expect(nextState).toEqual({
      ...initialState,
      panelViewType: 'EDIT',
    });
  });
});
