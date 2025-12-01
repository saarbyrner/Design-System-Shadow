import $ from 'jquery';
import {
  openNotesWidgetSettingsModal,
  closeNotesWidgetSettingsModal,
  setNotesWidgetSettingsPopulation,
  setNotesWidgetSettingsTimePeriod,
  selectAnnotationType,
  unselectAnnotationType,
  updateNotesWidgetSettingsDateRange,
  updateNotesWidgetSettingsTimePeriodLength,
  saveNotesWidgetSettingsLoading,
  saveNotesWidgetSettingsSuccess,
  saveNotesWidgetSettingsFailure,
  editNotesWidgetSettingsSuccess,
  editNotesWidgetSettingsFailure,
  saveNotesWidgetSettings,
  editNotesWidgetSettings,
} from '../notesWidgetSettingsModal';

jest.mock('jquery', () => {
  const mockjQuery = jest.fn(() => ({
    attr: jest.fn(() => 'mock-csrf-token'),
  }));
  mockjQuery.ajax = jest.fn();
  return mockjQuery;
});

describe('Notes Widget Settings Modal Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has the correct action OPEN_NOTES_WIDGET_SETTINGS_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_NOTES_WIDGET_SETTINGS_MODAL',
      payload: {
        widgetId: null,
        widgetName: 'ABC123',
        population: {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
        timeScope: {
          time_period: 'today',
          start_time: '',
          end_time: '',
          time_period_length: null,
        },
        annotationTypes: [4, 7],
      },
    };

    expect(
      openNotesWidgetSettingsModal(
        null,
        'ABC123',
        [4, 7],
        {
          applies_to_squad: true,
          position_groups: [1234],
          positions: [],
          athletes: [98765432],
          all_squads: false,
          squads: [],
        },
        {
          time_period: 'today',
          start_time: '',
          end_time: '',
          time_period_length: null,
        }
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_NOTES_WIDGET_SETTINGS_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_NOTES_WIDGET_SETTINGS_MODAL',
    };

    expect(closeNotesWidgetSettingsModal()).toEqual(expectedAction);
  });

  it('has the correct action SET_NOTES_WIDGET_SETTINGS_POPULATION', () => {
    const expectedAction = {
      type: 'SET_NOTES_WIDGET_SETTINGS_POPULATION',
      payload: {
        population: { applies_to_squad: false },
      },
    };

    expect(
      setNotesWidgetSettingsPopulation({ applies_to_squad: false })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'SET_NOTES_WIDGET_SETTINGS_TIME_PERIOD',
      payload: {
        timePeriod: 'today',
      },
    };

    expect(setNotesWidgetSettingsTimePeriod('today')).toEqual(expectedAction);
  });

  it('has the correct action SELECT_ANNOTATION_TYPE', () => {
    const expectedAction = {
      type: 'SELECT_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 56,
      },
    };

    expect(selectAnnotationType(56)).toEqual(expectedAction);
  });

  it('has the correct action UNSELECT_ANNOTATION_TYPE', () => {
    const expectedAction = {
      type: 'UNSELECT_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 67,
      },
    };

    expect(unselectAnnotationType(67)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTES_WIDGET_SETTINGS_DATE_RANGE',
      payload: {
        dateRange: {
          start_date: '123',
          end_date: '1234',
        },
      },
    };

    expect(
      updateNotesWidgetSettingsDateRange({
        start_date: '123',
        end_date: '1234',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH', () => {
    const expectedAction = {
      type: 'UPDATE_NOTES_WIDGET_SETTINGS_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 9,
      },
    };

    expect(updateNotesWidgetSettingsTimePeriodLength(9)).toEqual(
      expectedAction
    );
  });

  it('has the correct action SAVE_NOTES_WIDGET_SETTINGS_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
    };

    expect(saveNotesWidgetSettingsLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_NOTES_WIDGET_SETTINGS_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_SUCCESS',
    };

    expect(saveNotesWidgetSettingsSuccess()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_NOTES_WIDGET_SETTINGS_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE',
    };

    expect(saveNotesWidgetSettingsFailure()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_NOTES_WIDGET_SETTINGS_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_NOTES_WIDGET_SETTINGS_SUCCESS',
    };

    expect(editNotesWidgetSettingsSuccess()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_NOTES_WIDGET_SETTINGS_FAILURE', () => {
    const expectedAction = {
      type: 'EDIT_NOTES_WIDGET_SETTINGS_FAILURE',
    };

    expect(editNotesWidgetSettingsFailure()).toEqual(expectedAction);
  });

  describe('when saving notes widget settings', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        notesWidgetSettingsModal: {
          population: {
            applies_to_squad: true,
            position_groups: [1234],
            positions: [],
            athletes: [98765432],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: 'today',
            start_time: '',
            end_time: '',
            time_period_length: null,
          },
          widget_annotation_types: [
            {
              organisation_annotation_type_id: 12,
            },
            {
              organisation_annotation_type_id: 999,
            },
          ],
          open: false,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = saveNotesWidgetSettings();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith({
        method: 'POST',
        url: '/widgets',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            type: 'annotation',
            widget_annotation_types: [
              {
                organisation_annotation_type_id: 12,
              },
              {
                organisation_annotation_type_id: 999,
              },
            ],
            population: {
              applies_to_squad: true,
              position_groups: [1234],
              positions: [],
              athletes: [98765432],
              all_squads: false,
              squads: [],
            },
            time_scope: {
              time_period: 'today',
              start_time: '',
              end_time: '',
              time_period_length: null,
            },
          },
        }),
      });
    });
  });

  describe('When saving notes widget settings fails', () => {
    const getState = jest.fn();

    it('dispatches the correct action', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {},
        },
        notesWidgetSettingsModal: {},
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = saveNotesWidgetSettings();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      mockFail.mock.calls[0][0]();

      expect(dispatcher).toHaveBeenNthCalledWith(1, {
        type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
      });
      expect(dispatcher).toHaveBeenNthCalledWith(2, {
        type: 'SAVE_NOTES_WIDGET_SETTINGS_FAILURE',
      });
    });
  });

  describe('when editing notes widget settings', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        notesWidgetSettingsModal: {
          population: {
            applies_to_squad: true,
            position_groups: [1234],
            positions: [],
            athletes: [98765432],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: 'today',
            start_time: '',
            end_time: '',
            time_period_length: null,
          },
          widget_annotation_types: [
            {
              organisation_annotation_type_id: 14,
            },
          ],
          isOpen: false,
          widgetId: 9,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = editNotesWidgetSettings(9);
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'SAVE_NOTES_WIDGET_SETTINGS_LOADING',
      });

      expect($.ajax).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/widgets/9',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 123,
          widget: {
            widget_annotation_types: [
              {
                organisation_annotation_type_id: 14,
              },
            ],
            population: {
              applies_to_squad: true,
              position_groups: [1234],
              positions: [],
              athletes: [98765432],
              all_squads: false,
              squads: [],
            },
            time_scope: {
              time_period: 'today',
              start_time: '',
              end_time: '',
              time_period_length: null,
            },
          },
        }),
      });
    });
  });
});
