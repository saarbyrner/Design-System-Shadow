import $ from 'jquery';
import { annotation as annotationDummyData } from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/AnnotationDummyData';
import {
  openNoteModal,
  updateAthleteOptions,
  updateAction,
  updateActionSuccess,
  populateAthleteDropdown,
  clickActionCheckbox,
  updateNotes,
  fetchNextNotes,
  archiveNoteSuccess,
  archiveNote,
  restoreNoteSuccess,
  restoreNote,
  confirmFileUpload,
  triggerToastDisplayProgress,
} from '../notesWidget';

jest.mock('jquery', () => {
  const mockjQuery = jest.fn(() => ({
    attr: jest.fn(() => 'mock-csrf-token'),
  }));
  mockjQuery.ajax = jest.fn();
  return mockjQuery;
});

describe('Notes Widget Actions', () => {
  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: '2019-06-25T23:00:00Z',
    filename: 'sample.csv',
    fileSize: 124625,
    fileType: 'text/csv',
    webkitRelativePath: '',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has the correct action OPEN_NOTE_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_NOTE_MODAL',
      payload: {
        widgetId: 1234,
        widgetName: 'ABC123',
        annotationTypes: { organisation_annotation_type_id: 1 },
        population: [],
        timeScope: {},
        timeRange: {},
      },
    };

    expect(
      openNoteModal(
        1234,
        'ABC123',
        { organisation_annotation_type_id: 1 },
        [],
        {},
        {}
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ATHLETE_OPTIONS', () => {
    const expectedAction = {
      type: 'UPDATE_ATHLETE_OPTIONS',
      payload: {
        athletes: [
          {
            id: 1,
            title: 'Jon Doe',
          },
          {
            id: 2,
            title: 'John Appleseed',
          },
          {
            id: 27280,
            title: 'Gustavo Lazaro Amendola',
          },
        ],
      },
    };

    expect(
      updateAthleteOptions([
        {
          id: 1,
          title: 'Jon Doe',
        },
        {
          id: 2,
          title: 'John Appleseed',
        },
        {
          id: 27280,
          title: 'Gustavo Lazaro Amendola',
        },
      ])
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ACTION', () => {
    const expectedAction = {
      type: 'UPDATE_ACTION',
      payload: {
        action: {
          completed_at: null,
          completed: false,
          content: 'Does it work?',
          id: 2,
          user: {
            id: 1,
            fullname: 'Test User',
          },
        },
      },
    };

    expect(
      updateAction({
        completed_at: null,
        completed: false,
        content: 'Does it work?',
        id: 2,
        user: {
          id: 1,
          fullname: 'Test User',
        },
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ACTION_SUCCESS', () => {
    const expectedAction = {
      type: 'UPDATE_ACTION_SUCCESS',
    };

    expect(updateActionSuccess()).toEqual(expectedAction);
  });

  it('has the correct action on UPDATE_NOTES', () => {
    const expectedAction = {
      type: 'UPDATE_NOTES',
      payload: {
        widgetId: 11,
        nextNotes: [
          { id: 45, title: 'lovely note' },
          { id: 44, title: 'great note' },
        ],
        nextPage: 3,
      },
    };

    expect(
      updateNotes(
        11,
        [
          { id: 45, title: 'lovely note' },
          { id: 44, title: 'great note' },
        ],
        3
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action on ARCHIVE_NOTE_SUCCESS', () => {
    const expectedAction = {
      type: 'ARCHIVE_NOTE_SUCCESS',
      payload: {
        noteId: 8,
      },
    };

    expect(archiveNoteSuccess(8)).toEqual(expectedAction);
  });

  it('has the correct action on RESTORE_NOTE_SUCCESS', () => {
    const expectedAction = {
      type: 'RESTORE_NOTE_SUCCESS',
      payload: {
        noteId: 8,
      },
    };

    expect(restoreNoteSuccess(8)).toEqual(expectedAction);
  });

  describe('when populating the athlete dropdown', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
          appliedSquadAthletes: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          appliedDateRange: {},
          appliedTimePeriod: '',
        },
        notesWidget: {
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
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = populateAthleteDropdown();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'POST',
        url: '/athletes/population',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          population: {
            applies_to_squad: true,
            position_groups: [1234],
            positions: [],
            athletes: [98765432],
            all_squads: false,
            squads: [],
          },
        }),
      });

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
      });
    });

    it('sends the correct data when the dashboard is pivoted', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
          appliedSquadAthletes: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [1234],
            all_squads: false,
            squads: [],
          },
          appliedDateRange: {},
          appliedTimePeriod: '',
        },
        notesWidget: {
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
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = populateAthleteDropdown();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'POST',
        url: '/athletes/population',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [1234],
            all_squads: false,
            squads: [],
          },
        }),
      });

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
      });
    });
  });

  describe('When populating the athlete dropdown fails', () => {
    const getState = jest.fn();

    it('dispatches the correct action', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: {},
          appliedSquadAthletes: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          appliedDateRange: {},
          appliedTimePeriod: '',
        },
        notesWidget: {
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: 'today',
            start_time: '',
            end_time: '',
            time_period_length: null,
          },
          widget_annotation_types: [],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = populateAthleteDropdown();
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      mockFail.mock.calls[0][0]();

      expect(dispatcher).toHaveBeenNthCalledWith(1, {
        type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
      });
      expect(dispatcher).toHaveBeenNthCalledWith(2, {
        type: 'POPULATE_ATHLETE_DROPDOWN_FAILURE',
      });
    });
  });

  describe('when clicking an action checkbox', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = clickActionCheckbox({ id: 9, completed: false });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/annotation_actions/9',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          completed: true,
        }),
      });
    });
  });

  describe('when clicking an action checkbox fails', () => {
    const getState = jest.fn();

    it('dispatches the correct action', () => {
      getState.mockReturnValue({
        notesWidget: {
          noteViewStatus: {
            status: null,
            message: null,
          },
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = clickActionCheckbox({ id: 9, completed: false });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      mockFail.mock.calls[0][0]();

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'UPDATE_ACTION_FAILURE',
      });
    });
  });

  describe('when fetching the next notes', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: { id: 2 },
          widgets: [{ id: 287, widget_render: { next_page: 2 } }],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = fetchNextNotes(287, 2);
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'POST',
        url: '/widgets/widget_render',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          container_type: 'AnalyticalDashboard',
          container_id: 2,
          container_widget_id: 287,
          options: {
            page: 2,
          },
        }),
      });
    });
  });

  describe('when archiving a note', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: { id: 2 },
          widgets: [
            {
              id: 123,
              widget_type: 'annotation',
              widget_render: { annotations: [{ id: 287, archived: false }] },
            },
          ],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = archiveNote({ id: 287, archived: false });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/annotations/287',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          archived: true,
        }),
      });
    });
  });

  describe('when restoring a note', () => {
    const getState = jest.fn();

    it('sends the correct data', () => {
      getState.mockReturnValue({
        dashboard: {
          activeDashboard: { id: 2 },
          widgets: [
            {
              id: 123,
              widget_type: 'annotation',
              widget_render: { annotations: [{ id: 287, archived: true }] },
            },
          ],
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = restoreNote({ id: 287, archived: true });
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/annotations/287',
        headers: {
          'X-CSRF-Token': 'mock-csrf-token',
        },
        contentType: 'application/json',
        data: JSON.stringify({
          archived: false,
        }),
      });
    });
  });

  describe('when confirming a file upload', () => {
    const getState = jest.fn();
    const annotationData = { ...annotationDummyData() };

    it('sends the correct data', () => {
      getState.mockReturnValue({
        annotation: {
          ...annotationData,
          unUploadedFiles: [{ ...dummyFileAttachment }],
        },
        notesWidget: {
          widgetId: 123,
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
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = confirmFileUpload(123);
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect($.ajax).toHaveBeenCalledWith({
        type: 'PATCH',
        url: '/attachments/123/confirm',
        processData: false,
        contentType: false,
        cache: false,
      });
    });
  });

  describe('When confirming a file upload fails', () => {
    const getState = jest.fn();
    const annotationData = { ...annotationDummyData() };

    it('dispatches the correct action', () => {
      getState.mockReturnValue({
        annotation: {
          ...annotationData,
          unUploadedFiles: [{ ...dummyFileAttachment }],
        },
        notesWidget: {
          widgetId: 123,
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
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      });

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = confirmFileUpload(123);
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      mockFail.mock.calls[0][0]();

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'CONFIRM_FILE_UPLOAD_FAILURE',
        payload: { fileId: 123 },
      });
    });
  });

  it('has the correct action TRIGGER_TOAST_DISPLAY_PROGRESS', () => {
    const expectedAction = {
      type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
      payload: {
        fileName: 'sample.csv',
        fileSize: 124625,
        fileId: 123,
      },
    };

    expect(triggerToastDisplayProgress('sample.csv', 124625, 123)).toEqual(
      expectedAction
    );
  });
});
