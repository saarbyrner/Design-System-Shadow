import colors from '@kitman/common/src/variables/colors';
import {
  openHeaderWidgetModal,
  closeHeaderWidgetModal,
  setHeaderWidgetName,
  setHeaderWidgetPopulation,
  setHeaderWidgetBackgroundColor,
  setShowOrganisationLogo,
  setShowOrganisationName,
  saveHeaderWidgetLoading,
  saveHeaderWidgetSuccess,
  saveHeaderWidgetFailure,
  editHeaderWidgetSuccess,
  editHeaderWidgetFailure,
  saveHeaderWidget,
  editHeaderWidget,
  setHideOrganisationDetails,
} from '../headerWidgetModal';

describe('Header Widget Modal Actions', () => {
  let mockXHR;
  let requests;

  beforeEach(() => {
    mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: JSON.stringify({}),
    };
    requests = [];

    global.XMLHttpRequest = jest.fn(() => {
      const xhr = mockXHR;
      requests.push(xhr);
      return xhr;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('has the correct action OPEN_HEADER_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_HEADER_WIDGET_MODAL',
      payload: {
        widgetId: 123,
        name: 'test',
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [1234],
          all_squads: false,
          squads: [],
        },
        backgroundColor: colors.grey_disabled,
        showOrganisationLogo: true,
        showOrganisationName: true,
        hideOrganisationDetails: false,
      },
    };

    expect(
      openHeaderWidgetModal(
        123,
        'test',
        {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [1234],
          all_squads: false,
          squads: [],
        },
        colors.grey_disabled,
        true,
        true,
        false
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_HEADER_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_HEADER_WIDGET_MODAL',
    };

    expect(closeHeaderWidgetModal()).toEqual(expectedAction);
  });

  it('has the correct action SET_HEADER_WIDGET_NAME', () => {
    const expectedAction = {
      type: 'SET_HEADER_WIDGET_NAME',
      payload: {
        name: 'Header',
      },
    };

    expect(setHeaderWidgetName('Header')).toEqual(expectedAction);
  });

  it('has the correct action SET_HEADER_WIDGET_POPULATION', () => {
    const expectedAction = {
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

    expect(
      setHeaderWidgetPopulation({
        applies_to_squad: true,
        position_groups: [1234],
        positions: [],
        athletes: [98765432],
        all_squads: false,
        squads: [],
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_HEADER_WIDGET_BACKGROUND_COLOR', () => {
    const expectedAction = {
      type: 'SET_HEADER_WIDGET_BACKGROUND_COLOR',
      payload: {
        color: colors.grey_disabled,
      },
    };

    expect(setHeaderWidgetBackgroundColor(colors.grey_disabled)).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_SHOW_ORGANISATION_LOGO', () => {
    const expectedAction = {
      type: 'SET_SHOW_ORGANISATION_LOGO',
      payload: {
        showOrganisationLogo: false,
      },
    };

    expect(setShowOrganisationLogo(false)).toEqual(expectedAction);
  });

  it('has the correct action SET_SHOW_ORGANISATION_NAME', () => {
    const expectedAction = {
      type: 'SET_SHOW_ORGANISATION_NAME',
      payload: {
        showOrganisationName: false,
      },
    };

    expect(setShowOrganisationName(false)).toEqual(expectedAction);
  });

  it('has the correct action SET_HIDE_ORGANISATION_DETAILS', () => {
    const expectedAction = {
      type: 'SET_HIDE_ORGANISATION_DETAILS',
      payload: {
        hideOrganisationDetails: true,
      },
    };

    expect(setHideOrganisationDetails(true)).toEqual(expectedAction);
  });

  it('has the correct action SAVE_HEADER_WIDGET_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_HEADER_WIDGET_LOADING',
    };

    expect(saveHeaderWidgetLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_HEADER_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_HEADER_WIDGET_SUCCESS',
    };

    expect(saveHeaderWidgetSuccess()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_HEADER_WIDGET_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_HEADER_WIDGET_FAILURE',
    };

    expect(saveHeaderWidgetFailure()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_HEADER_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_HEADER_WIDGET_SUCCESS',
    };

    expect(editHeaderWidgetSuccess()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_HEADER_WIDGET_FAILURE', () => {
    const expectedAction = {
      type: 'EDIT_HEADER_WIDGET_FAILURE',
    };

    expect(editHeaderWidgetFailure()).toEqual(expectedAction);
  });

  describe('when saving a header widget', () => {
    it('sends the correct data', () => {
      const getState = jest.fn().mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        headerWidgetModal: {
          color: colors.black_100,
          name: 'Test',
          open: true,
          population: {
            applies_to_squad: true,
            position_groups: [1234],
            positions: [],
            athletes: [98765432],
            all_squads: false,
            squads: [],
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = saveHeaderWidget();
      const dispatcher = jest.fn();

      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_HEADER_WIDGET_LOADING',
      });

      expect(mockXHR.open).toHaveBeenCalledWith(
        'POST',
        '/widgets',
        true,
        undefined,
        undefined
      );
      expect(mockXHR.send).toHaveBeenCalledWith(
        JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            type: 'header',
            name_from_container: false,
            name: 'Test',
            background_color: colors.black_100,
            population: {
              applies_to_squad: true,
              position_groups: [1234],
              positions: [],
              athletes: [98765432],
              all_squads: false,
              squads: [],
            },
          },
        })
      );
    });
  });

  describe('When saving a header widget fails', () => {
    it('dispatches the correct action', () => {
      const failingMockXHR = {
        ...mockXHR,
        status: 500,
        responseText: 'ERROR',
      };

      global.XMLHttpRequest = jest.fn(() => {
        const xhr = failingMockXHR;
        setTimeout(() => {
          if (xhr.onreadystatechange) {
            xhr.onreadystatechange();
          }
        }, 0);
        return xhr;
      });

      const getState = jest.fn().mockReturnValue({
        dashboard: {
          activeDashboard: {},
        },
        headerWidgetModal: {},
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = saveHeaderWidget();
      const dispatcher = jest.fn();

      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_HEADER_WIDGET_LOADING',
      });

      setTimeout(() => {
        expect(dispatcher).toHaveBeenCalledWith({
          type: 'SAVE_HEADER_WIDGET_FAILURE',
        });
      }, 0);
    });
  });

  describe('when editing a header widget', () => {
    it('sends the correct data', () => {
      const getState = jest.fn().mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        headerWidgetModal: {
          color: colors.brown_600,
          name: 'Test Edit',
          open: true,
          population: {
            applies_to_squad: true,
            position_groups: [12],
            positions: [],
            athletes: [9872],
            all_squads: true,
            squads: [],
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const thunk = editHeaderWidget(987);
      const dispatcher = jest.fn();

      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_HEADER_WIDGET_LOADING',
      });

      expect(mockXHR.open).toHaveBeenCalledWith(
        'PUT',
        '/widgets/987',
        true,
        undefined,
        undefined
      );
      expect(mockXHR.send).toHaveBeenCalledWith(
        JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            name_from_container: false,
            name: 'Test Edit',
            background_color: colors.brown_600,
            population: {
              applies_to_squad: true,
              position_groups: [12],
              positions: [],
              athletes: [9872],
              all_squads: true,
              squads: [],
            },
          },
        })
      );
    });
  });
});
