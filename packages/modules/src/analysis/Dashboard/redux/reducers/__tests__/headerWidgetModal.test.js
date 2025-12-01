import colors from '@kitman/common/src/variables/colors';
import headerWidgetModalReducer from '../headerWidgetModal';

describe('analyticalDashboard - headerWidgetModal reducer', () => {
  const defaultState = {
    open: false,
    showOrgLogo: true,
    showOrgName: true,
    hideOrgDetails: false,
  };

  it('returns correct state on OPEN_HEADER_WIDGET_MODAL', () => {
    const action = {
      type: 'OPEN_HEADER_WIDGET_MODAL',
      payload: {
        name: 'test',
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
        backgroundColor: colors.p04,
        showOrganisationLogo: true,
        showOrganisationName: true,
        hideOrganisationDetails: false,
        widgetId: 23,
      },
    };

    const nextState = headerWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: true,
      name: 'test',
      population: {
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      },
      color: colors.p04,
      showOrgLogo: true,
      showOrgName: true,
      hideOrgDetails: false,
      widgetId: 23,
    });
  });

  it('returns correct state on CLOSE_HEADER_WIDGET_MODAL', () => {
    const initialState = {
      ...defaultState,
      open: true,
    };

    const action = {
      type: 'CLOSE_HEADER_WIDGET_MODAL',
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: false,
    });
  });

  it('returns the correct state on SET_HEADER_WIDGET_NAME', () => {
    const initialState = {
      ...defaultState,
      open: true,
    };

    const action = {
      type: 'SET_HEADER_WIDGET_NAME',
      payload: {
        name: 'Testing',
      },
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: true,
      name: 'Testing',
    });
  });

  it('returns the correct state on SET_HEADER_WIDGET_POPULATION', () => {
    const initialState = {
      ...defaultState,
      open: true,
    };

    const action = {
      type: 'SET_HEADER_WIDGET_POPULATION',
      payload: {
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
      },
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: true,
      population: {
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      },
    });
  });

  it('returns the correct state on SET_SHOW_ORGANISATION_LOGO', () => {
    const action = {
      type: 'SET_SHOW_ORGANISATION_LOGO',
      payload: {
        showOrganisationLogo: false,
      },
    };

    const nextState = headerWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      showOrgLogo: false,
    });
  });

  it('returns the correct state on SET_SHOW_ORGANISATION_NAME', () => {
    const action = {
      type: 'SET_SHOW_ORGANISATION_NAME',
      payload: {
        showOrganisationName: false,
      },
    };

    const nextState = headerWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      showOrgName: false,
    });
  });

  it('returns the correct state on SET_HIDE_ORGANISATION_DETAILS', () => {
    const action = {
      type: 'SET_HIDE_ORGANISATION_DETAILS',
      payload: {
        hideOrganisationDetails: true,
      },
    };

    const nextState = headerWidgetModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      hideOrgDetails: true,
      showOrgName: false,
    });
  });

  it('returns the correct state on SET_HEADER_WIDGET_BACKGROUND_COLOR', () => {
    const initialState = {
      ...defaultState,
      open: true,
    };

    const action = {
      type: 'SET_HEADER_WIDGET_BACKGROUND_COLOR',
      payload: {
        color: colors.p05,
      },
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      open: true,
      color: colors.p05,
    });
  });

  it('returns the correct state on SAVE_HEADER_WIDGET_LOADING', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_HEADER_WIDGET_LOADING',
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns the correct state on SAVE_HEADER_WIDGET_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      status: 'loading',
    };

    const action = {
      type: 'SAVE_HEADER_WIDGET_SUCCESS',
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: null,
    });
  });

  it('returns the correct state on SAVE_HEADER_WIDGET_FAILURE', () => {
    const initialState = {
      ...defaultState,
      status: null,
    };

    const action = {
      type: 'SAVE_HEADER_WIDGET_FAILURE',
    };

    const nextState = headerWidgetModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });
});
