import $ from 'jquery';
import colors from '@kitman/common/src/variables/colors';
import {
  openProfileWidgetModal,
  closeProfileWidgetModal,
  selectAthlete,
  selectWidgetInfoItem,
  setAvatarAvailability,
  setAvatarSquadNumber,
  updatePreviewSuccess,
  saveProfileWidgetLoading,
  saveProfileWidgetSuccess,
  saveProfileWidgetFailure,
  editProfileWidgetSuccess,
  editProfileWidgetFailure,
  updatePreview,
  saveProfileWidget,
  editProfileWidget,
  setProfileBackgroundColour,
} from '../profileWidgetModal';

jest.mock('jquery', () => {
  const mockjQuery = jest.fn(() => ({
    attr: jest.fn(() => 'mock-csrf-token'),
  }));
  mockjQuery.ajax = jest.fn(() => ({
    done: jest.fn(() => ({
      fail: jest.fn(),
    })),
    fail: jest.fn(),
  }));
  return mockjQuery;
});

describe('Profile Widget Modal Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has the correct action OPEN_PROFILE_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_PROFILE_WIDGET_MODAL',
      payload: {
        widgetId: null,
        athleteId: null,
        showAvailabilityIndicator: false,
        showSquadNumber: false,
        selectedInfoFields: [
          { name: 'name' },
          { name: 'none' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ],
        backgroundColour: 'transparent',
      },
    };

    expect(
      openProfileWidgetModal(
        null,
        null,
        false,
        false,
        [
          { name: 'name' },
          { name: 'none' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ],
        'transparent'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_PROFILE_WIDGET_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_PROFILE_WIDGET_MODAL',
    };

    expect(closeProfileWidgetModal()).toEqual(expectedAction);
  });

  it('has the correct action SELECT_ATHLETE', () => {
    const expectedAction = {
      type: 'SELECT_ATHLETE',
      payload: {
        athleteId: '991243',
      },
    };

    expect(selectAthlete('991243')).toEqual(expectedAction);
  });

  it('has the correct action SELECT_WIDGET_INFO_ITEM', () => {
    const expectedAction = {
      type: 'SELECT_WIDGET_INFO_ITEM',
      payload: {
        index: 2,
        itemId: 'squads',
      },
    };

    expect(selectWidgetInfoItem(2, 'squads')).toEqual(expectedAction);
  });

  it('has the correct action SET_AVATAR_AVAILABILITY', () => {
    const expectedAction = {
      type: 'SET_AVATAR_AVAILABILITY',
      payload: {
        showAvailabilityIndicator: true,
      },
    };

    expect(setAvatarAvailability(true)).toEqual(expectedAction);
  });

  it('has the correct action SET_AVATAR_SQUAD_NUMBER', () => {
    const expectedAction = {
      type: 'SET_AVATAR_SQUAD_NUMBER',
      payload: {
        showSquadNumber: true,
      },
    };

    expect(setAvatarSquadNumber(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_PREVIEW_SUCCESS', () => {
    const expectedAction = {
      type: 'UPDATE_PREVIEW_SUCCESS',
      payload: {
        widget: { athlete_id: '0900' },
      },
    };

    expect(updatePreviewSuccess({ athlete_id: '0900' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_PROFILE_BACKGROUND_COLOUR', () => {
    const expectedAction = {
      type: 'SET_PROFILE_BACKGROUND_COLOUR',
      payload: {
        backgroundColour: colors.white,
      },
    };

    expect(setProfileBackgroundColour(colors.white)).toEqual(expectedAction);
  });

  it('has the correct action SAVE_PROFILE_WIDGET_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_PROFILE_WIDGET_LOADING',
    };

    expect(saveProfileWidgetLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_PROFILE_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_PROFILE_WIDGET_SUCCESS',
    };

    expect(saveProfileWidgetSuccess()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_PROFILE_WIDGET_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_PROFILE_WIDGET_FAILURE',
    };

    expect(saveProfileWidgetFailure()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_PROFILE_WIDGET_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_PROFILE_WIDGET_SUCCESS',
    };

    expect(editProfileWidgetSuccess()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_PROFILE_WIDGET_FAILURE', () => {
    const expectedAction = {
      type: 'EDIT_PROFILE_WIDGET_FAILURE',
    };

    expect(editProfileWidgetFailure()).toEqual(expectedAction);
  });

  describe('when calling the /widgets/preview endpoint', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      });
    });

    it('sends the correct data', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        profileWidgetModal: {
          athlete_id: 27,
          avatar_availability: false,
          avatar_squad_number: false,
          fields: [
            { name: 'name' },
            { name: 'availability' },
            { name: 'none' },
            { name: 'position' },
          ],
          open: false,
          preview: {},
          widgetId: 999,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = updatePreview();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/preview',
        method: 'POST',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            type: 'athlete_profile',
            athlete_id: 27,
            fields: [
              { name: 'name' },
              { name: 'availability' },
              { name: 'none' },
              { name: 'position' },
            ],
            avatar_availability: false,
            avatar_squad_number: false,
          },
        }),
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
      });
    });
  });

  describe('when saving a profile widget', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      });
    });

    it('sends the correct data', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        profileWidgetModal: {
          athlete_id: '18447',
          avatar_availability: true,
          avatar_squad_number: true,
          fields: [
            { name: 'name' },
            { name: 'none' },
            { name: 'country' },
            { name: 'squads' },
          ],
          open: false,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = saveProfileWidget();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_PROFILE_WIDGET_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets',
        method: 'POST',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            type: 'athlete_profile',
            athlete_id: '18447',
            fields: [
              { name: 'name' },
              { name: 'none' },
              { name: 'country' },
              { name: 'squads' },
            ],
            avatar_availability: true,
            avatar_squad_number: true,
          },
        }),
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
      });
    });
  });

  describe('When saving a profile widget fails', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn((callback) => {
          callback();
          return { fail: jest.fn() };
        }),
      });
    });

    it('dispatches the correct action', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {},
        },
        profileWidgetModal: {},
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = saveProfileWidget();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_PROFILE_WIDGET_LOADING',
      });
      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_PROFILE_WIDGET_FAILURE',
      });
    });
  });

  describe('when editing a profile widget', () => {
    beforeEach(() => {
      $.ajax.mockReturnValue({
        done: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis(),
      });
    });

    it('sends the correct data', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        profileWidgetModal: {
          athlete_id: 27,
          avatar_availability: false,
          avatar_squad_number: false,
          fields: [
            { name: 'name' },
            { name: 'availability' },
            { name: 'none' },
            { name: 'position' },
          ],
          open: false,
          widgetId: 999,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = editProfileWidget(999);
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_PROFILE_WIDGET_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith({
        url: '/widgets/999',
        method: 'PUT',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            athlete_id: 27,
            fields: [
              { name: 'name' },
              { name: 'availability' },
              { name: 'none' },
              { name: 'position' },
            ],
            avatar_availability: false,
            avatar_squad_number: false,
          },
        }),
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
      });
    });
  });
});
