import colors from '@kitman/common/src/variables/colors';
import profileWidgetModalReducer from '../profileWidgetModal';

describe('analyticalDashboard - profileWidgetModal reducer', () => {
  const defaultState = {
    athlete_id: null,
    avatar_availability: false,
    avatar_squad_number: false,
    fields: [
      { name: 'name' },
      { name: 'availabiliy' },
      { name: 'date_of_birth' },
      { name: 'position' },
    ],
    open: false,
    preview: {},
    widgetId: null,
    backgroundColour: colors.white,
  };

  it('returns correct state on OPEN_PROFILE_WIDGET_MODAL', () => {
    const action = {
      type: 'OPEN_PROFILE_WIDGET_MODAL',
      payload: {
        widgetId: null,
        athleteId: null,
        showAvailabilityIndicator: false,
        showSquadNumber: false,
        selectedInfoFields: [
          { name: 'name' },
          { name: 'availabiliy' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ],
        backgroundColour: colors.white,
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: true,
    });
  });

  it('returns correct state on CLOSE_PROFILE_WIDGET_MODAL', () => {
    const initialState = {
      ...defaultState,
      open: true,
    };

    const action = {
      type: 'CLOSE_PROFILE_WIDGET_MODAL',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: false,
    });
  });

  it('returns correct state on SELECT_ATHLETE', () => {
    const action = {
      type: 'SELECT_ATHLETE',
      payload: {
        athleteId: '909',
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      athlete_id: '909',
    });
  });

  it('returns correct state on SELECT_WIDGET_INFO_ITEM', () => {
    const action = {
      type: 'SELECT_WIDGET_INFO_ITEM',
      payload: {
        index: 3,
        itemId: 'date_of_birth',
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      fields: [
        { name: 'name' },
        { name: 'availabiliy' },
        { name: 'date_of_birth' },
        { name: 'date_of_birth' },
      ],
    });
  });

  it('returns correct state on SELECT_WIDGET_INFO_ITEM when itemId is null', () => {
    const action = {
      type: 'SELECT_WIDGET_INFO_ITEM',
      payload: {
        index: 1,
        itemId: null,
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      fields: [
        { name: 'name' },
        { name: 'none' },
        { name: 'date_of_birth' },
        { name: 'position' },
      ],
    });
  });

  it('returns correct state on SET_AVATAR_AVAILABILITY', () => {
    const action = {
      type: 'SET_AVATAR_AVAILABILITY',
      payload: {
        showAvailabilityIndicator: true,
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      avatar_availability: true,
    });
  });

  it('returns correct state on SET_AVATAR_SQUAD_NUMBER', () => {
    const action = {
      type: 'SET_AVATAR_SQUAD_NUMBER',
      payload: {
        showSquadNumber: true,
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      avatar_squad_number: true,
    });
  });

  it('returns the correct state on SAVE_PROFILE_WIDGET_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_PROFILE_WIDGET_LOADING',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on SAVE_PROFILE_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'SAVE_PROFILE_WIDGET_SUCCESS',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on SAVE_PROFILE_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_PROFILE_WIDGET_FAILURE',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on EDIT_PROFILE_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'EDIT_PROFILE_WIDGET_SUCCESS',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on EDIT_PROFILE_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'EDIT_PROFILE_WIDGET_FAILURE',
    };

    const nextState = profileWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns the correct state on UPDATE_PREVIEW_SUCCESS', () => {
    const action = {
      type: 'UPDATE_PREVIEW_SUCCESS',
      payload: {
        widget: {
          id: null,
          athlete_id: 30693,
          field_values: [
            { name: 'name', value: 'Deco 10' },
            { name: 'availability', value: 'Unavailable' },
            { name: 'date_of_birth', value: '27 Aug 1977 (42)' },
            { name: 'position', value: 'Forward' },
          ],
          availability_status: 'unavailable',
          avatar_url: '/image/avatar_fake.png',
        },
      },
    };

    const nextState = profileWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      preview: {
        id: null,
        athlete_id: 30693,
        field_values: [
          { name: 'name', value: 'Deco 10' },
          { name: 'availability', value: 'Unavailable' },
          { name: 'date_of_birth', value: '27 Aug 1977 (42)' },
          { name: 'position', value: 'Forward' },
        ],
        availability_status: 'unavailable',
        avatar_url: '/image/avatar_fake.png',
      },
    });
  });
});
