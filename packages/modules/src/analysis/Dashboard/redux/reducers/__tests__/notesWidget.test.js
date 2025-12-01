import { annotation as annotationDummyData } from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/AnnotationDummyData';
import annotationEmptyData from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/annotationEmptyData';
import notesWidgetReducer from '../notesWidget';

describe('analyticalDashboard - notesWidgetReducer', () => {
  const defaultState = {};
  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: '2019-06-25T23:00:00Z',
    name: 'sample.csv',
    size: 5000, // Bytes
    type: 'text/csv',
    _relativePath: '',
  };
  const MOCKED_DATE = '2025-08-15T10:30:00.000Z';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCKED_DATE));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns correct state on ADD_NOTES_WIDGET_LOADING', () => {
    const action = {
      type: 'ADD_NOTES_WIDGET_LOADING',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns correct state on ADD_NOTES_WIDGET_SUCCESS', () => {
    const action = {
      type: 'ADD_NOTES_WIDGET_SUCCESS',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'success',
    });
  });

  it('returns correct state on ADD_NOTES_WIDGET_FAILURE', () => {
    const action = {
      type: 'ADD_NOTES_WIDGET_FAILURE',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns correct state on OPEN_NOTE_MODAL', () => {
    const action = {
      type: 'OPEN_NOTE_MODAL',
      payload: {
        widgetId: 1234,
        annotationTypes: { organisation_annotation_type_id: 1 },
        population: [],
        timeScope: {},
        timeRange: {},
      },
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        isNotesModalOpen: true,
        widgetId: 1234,
      },
      widgetId: 1234,
      widget_annotation_types: { organisation_annotation_type_id: 1 },
      population: [],
      time_scope: {},
      time_range: {},
    });
  });

  it('returns correct state on CLOSE_NOTES_MODAL', () => {
    const orgAnnotationTypes = [{ id: 1 }];
    const action = {
      type: 'CLOSE_NOTES_MODAL',
      payload: {
        annotationTypes: orgAnnotationTypes,
      },
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        isNotesModalOpen: false,
        widgetId: null,
      },
      annotation: {
        ...annotationEmptyData(),
        annotation_type_id: 1,
      },
    });
  });

  it('returns correct state on UPDATE_ATHLETE_OPTIONS', () => {
    const action = {
      type: 'UPDATE_ATHLETE_OPTIONS',
      payload: {
        athletes: [
          {
            id: 1,
            firstname: 'Jon',
            lastname: 'Doe',
            fullname: 'Jon Doe',
          },
          {
            id: 2,
            firstname: 'John',
            lastname: 'Appleseed',
            fullname: 'John Appleseed',
          },
          {
            id: 27280,
            firstname: 'Gustavo',
            lastname: 'Lazaro Amendola',
            fullname: 'Gustavo Lazaro Amendola',
          },
        ],
      },
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      availableAthletes: [
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
    });
  });

  it('returns correct state on UPDATE_ACTION', () => {
    const initialState = {
      ...defaultState,
      updatedAction: null,
    };

    const action = {
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

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      updatedAction: {
        completed_at: null,
        completed: false,
        content: 'Does it work?',
        id: 2,
        user: {
          id: 1,
          fullname: 'Test User',
        },
      },
    });
  });

  it('returns correct state on POPULATE_ATHLETE_DROPDOWN_LOADING', () => {
    const action = {
      type: 'POPULATE_ATHLETE_DROPDOWN_LOADING',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'loading',
        message: 'Fetching data...',
      },
    });
  });

  it('returns correct state on EDIT_ANNOTATION_LOADING', () => {
    const action = {
      type: 'EDIT_ANNOTATION_LOADING',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'loading',
        message: 'Loading...',
      },
    });
  });

  it('returns correct state on SAVE_ANNOTATION_LOADING', () => {
    const action = {
      type: 'SAVE_ANNOTATION_LOADING',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'loading',
        message: 'Loading...',
      },
    });
  });

  it('returns correct state on SAVE_ANNOTATION_SUCCESS', () => {
    const action = {
      type: 'SAVE_ANNOTATION_SUCCESS',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'success',
        message: 'Note saved successfully',
      },
    });
  });

  it('returns correct state on EDIT_ANNOTATION_FAILURE', () => {
    const action = {
      type: 'EDIT_ANNOTATION_FAILURE',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'error',
      },
    });
  });

  it('returns correct state on SAVE_ANNOTATION_FAILURE', () => {
    const action = {
      type: 'SAVE_ANNOTATION_FAILURE',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'error',
      },
    });
  });

  it('returns correct state on UPDATE_ACTION_SUCCESS', () => {
    const initialState = {
      ...defaultState,
      updatedAction: {
        completed_at: null,
        completed: false,
        content: 'Does it work?',
        id: 2,
        user: {
          id: 1,
          fullname: 'Test User',
        },
      },
    };

    const action = {
      type: 'UPDATE_ACTION_SUCCESS',
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      updatedAction: null,
    });
  });

  it('returns correct state on UPDATE_ACTION_FAILURE', () => {
    const initialState = {
      ...defaultState,
      noteViewStatus: {
        ...defaultState.noteViewStatus,
        status: null,
        message: null,
      },
    };

    const action = {
      type: 'UPDATE_ACTION_FAILURE',
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      noteViewStatus: {
        ...defaultState.noteViewStatus,
        status: 'error',
        message: null,
      },
    });
  });

  it('returns correct state on POPULATE_ATHLETE_DROPDOWN_FAILURE', () => {
    const action = {
      type: 'POPULATE_ATHLETE_DROPDOWN_FAILURE',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'error',
        message: '#sport_specific__There_was_an_error_fetching_athletes.',
      },
    });
  });

  it('returns correct state on EDIT_ANNOTATION_SUCCESS', () => {
    const action = {
      type: 'EDIT_ANNOTATION_SUCCESS',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: 'success',
        message: 'Note updated successfully',
      },
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = notesWidgetReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      notesModal: {
        ...defaultState.notesModal,
        status: null,
        message: null,
      },
      noteViewStatus: {
        ...defaultState.noteViewStatus,
        status: null,
        message: null,
      },
    });
  });

  it('returns correct state on CONFIRM_FILE_UPLOAD_FAILURE', () => {
    const initialState = {
      ...defaultState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'PROGRESS',
            id: 4444,
          },
        },
      },
    };

    const action = {
      type: 'CONFIRM_FILE_UPLOAD_FAILURE',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'ERROR',
            id: 4444,
          },
        },
      },
    });
  });

  it('returns correct state on TRIGGER_FILE_UPLOAD_FAILURE', () => {
    const initialState = {
      ...defaultState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'PROGRESS',
            id: 4444,
          },
        },
      },
    };

    const action = {
      type: 'TRIGGER_FILE_UPLOAD_FAILURE',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'ERROR',
            id: 4444,
          },
        },
      },
    });
  });

  it('returns correct state on FINISH_FILE_UPLOAD', () => {
    const initialState = {
      ...defaultState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'PROGRESS',
            id: 4444,
          },
        },
      },
    };

    const action = {
      type: 'FINISH_FILE_UPLOAD',
      payload: {
        fileId: 4444,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'SUCCESS',
            id: 4444,
          },
        },
      },
    });
  });

  it('returns correct state on CLOSE_TOAST_ITEM', () => {
    const initialState = {
      ...defaultState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444, 1234],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100Kb',
            status: 'SUCCESS',
            id: 4444,
          },
          1234: {
            text: 'ABCD (abcd.jpg)',
            subText: '430Kb',
            status: 'SUCCESS',
            id: 4444,
          },
        },
      },
    };

    const action = {
      type: 'CLOSE_TOAST_ITEM',
      payload: {
        itemId: 4444,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      toast: {
        ...defaultState.toast,
        fileOrder: [1234],
        fileMap: {
          1234: {
            text: 'ABCD (abcd.jpg)',
            subText: '430Kb',
            status: 'SUCCESS',
            id: 4444,
          },
        },
      },
    });
  });

  it('returns correct state on TRIGGER_TOAST_DISPLAY_PROGRESS', () => {
    const initialState = {
      ...defaultState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444],
        fileMap: {
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100 Kb',
            status: 'PROGRESS',
            id: 4444,
          },
        },
      },
    };

    const action = {
      type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
      payload: {
        fileName: dummyFileAttachment.name,
        fileSize: dummyFileAttachment.size,
        fileId: 1234,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      toast: {
        ...defaultState.toast,
        fileOrder: [4444, 1234],
        fileMap: {
          1234: {
            text: dummyFileAttachment.name,
            subText: '5.0 kB',
            status: 'PROGRESS',
            id: 1234,
          },
          4444: {
            text: 'MRI Scan (zx123MRIscan_123.jpg)',
            subText: '100 Kb',
            status: 'PROGRESS',
            id: 4444,
          },
        },
      },
    });
  });

  it('returns correct state on HIDE_NOTES_WIDGET_STATUS', () => {
    const initialState = {
      ...defaultState,
      notesWidgetStatus: {
        ...defaultState.notesWidgetStatus,
        annotation: { id: 1234 },
        fileId: 1234,
        status: 'success',
        message: 'Message',
        secondaryMessage: 'Message 2',
      },
    };

    const action = {
      type: 'HIDE_NOTES_WIDGET_STATUS',
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      notesWidgetStatus: {
        ...defaultState.notesWidgetStatus,
        annotation: null,
        fileId: null,
        status: null,
        message: null,
        secondaryMessage: null,
      },
    });
  });

  it('returns correct state on CONFIRM_DELETE_ATTACHMENT', () => {
    const dummyAnnotation = {
      ...annotationDummyData(),
      attachments: [
        {
          id: 12345566,
          original_filename: 'physio_2211_jon_doe.jpg',
          created: '2019-06-25T23:00:00Z',
          filesize: 1564,
          confirmed: true,
        },
      ],
    };
    const initialState = {
      ...defaultState,
      notesWidgetStatus: {
        ...defaultState.notesWidgetStatus,
        annotation: null,
        fileId: null,
        status: null,
        message: null,
        secondaryMessage: null,
      },
    };

    const action = {
      type: 'CONFIRM_DELETE_ATTACHMENT',
      payload: {
        widgetId: 3456,
        annotation: dummyAnnotation,
        fileId: 12345566,
      },
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      widgetId: 3456,
      notesWidgetStatus: {
        ...initialState.notesWidgetStatus,
        status: 'warning',
        annotation: dummyAnnotation,
        fileId: 12345566,
        message: 'Delete file?',
        secondaryMessage: 'This action is irreversible.',
      },
    });
  });

  it('returns correct state on DELETE_ATTACHMENT_LOADING', () => {
    const initialState = {
      ...defaultState,
      notesWidgetStatus: {
        ...defaultState.notesWidgetStatus,
        status: 'warning',
        annotation: { id: 234 },
        fileId: 12345566,
        message: 'Delete file?',
        secondaryMessage: 'This action is irreversible.',
      },
    };

    const action = {
      type: 'DELETE_ATTACHMENT_LOADING',
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      notesWidgetStatus: {
        ...initialState.notesWidgetStatus,
        status: 'loading',
        message: 'Removing file...',
        secondaryMessage: null,
      },
    });
  });

  it('returns correct state on DELETE_ATTACHMENT_FAILURE', () => {
    const initialState = {
      ...defaultState,
      notesWidgetStatus: {
        ...defaultState.notesWidgetStatus,
        status: 'warning',
        annotation: { id: 234 },
        fileId: 12345566,
        message: 'Delete file?',
        secondaryMessage: 'This action is irreversible.',
      },
    };

    const action = {
      type: 'DELETE_ATTACHMENT_FAILURE',
    };

    const nextState = notesWidgetReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      notesWidgetStatus: {
        ...initialState.notesWidgetStatus,
        status: 'error',
        message: null,
        secondaryMessage: null,
      },
    });
  });
});
