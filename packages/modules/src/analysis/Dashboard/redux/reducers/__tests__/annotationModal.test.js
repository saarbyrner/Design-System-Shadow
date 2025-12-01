import { annotation } from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/AnnotationDummyData';
import moment from 'moment-timezone';
import annotationModalReducer from '../annotationModal';

describe('analyticalDashboard - annotationModalReducer reducer', () => {
  const defaultState = {};
  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: '2019-06-25T23:00:00Z',
    filename: 'sample.csv',
    fileSize: 124625,
    fileType: 'text/csv',
    webkitRelativePath: '',
  };

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns correct state on NOTE_TYPE_CHANGE', () => {
    const action = {
      type: 'NOTE_TYPE_CHANGE',
      payload: {
        typeId: 1,
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      annotation_type_id: 1,
    });
  });

  it('returns correct state on NOTE_TITLE_CHANGE', () => {
    const action = {
      type: 'NOTE_TITLE_CHANGE',
      payload: {
        title: 'new title',
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      title: 'new title',
    });
  });

  it('returns correct state on NOTE_TEXT_CHANGE', () => {
    const action = {
      type: 'NOTE_TEXT_CHANGE',
      payload: {
        text: 'new content',
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      content: 'new content',
    });
  });

  it('returns correct state on NOTE_RICH_TEXT_CHANGE', () => {
    const action = {
      type: 'NOTE_RICH_TEXT_CHANGE',
      payload: {
        content: '<p>new content</p>',
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      content: '<p>new content</p>',
    });
  });

  it('returns correct state on NOTE_DATE_CHANGE', () => {
    const action = {
      type: 'NOTE_DATE_CHANGE',
      payload: {
        date: '2019-06-25T23:00:00Z',
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      annotation_date: '2019-06-25T23:00:00+00:00',
    });
  });

  it('returns correct state on NOTE_ATHLETE_CHANGE', () => {
    const action = {
      type: 'NOTE_ATHLETE_CHANGE',
      payload: {
        athleteId: 123,
        athleteName: 'Jon Doe',
      },
    };

    const nextState = annotationModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      annotationable: {
        id: 123,
        fullname: 'Jon Doe',
      },
    });
  });

  it('returns correct state on UPDATE_NOTE_ACTION_TEXT', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed_at: null,
        },
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed_at: null,
        },
      ],
    };
    const action = {
      type: 'UPDATE_NOTE_ACTION_TEXT',
      payload: {
        text: 'new content',
        actionIndex: 0,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          id: 2,
          content: 'new content',
          user: null,
          completed_at: null,
        },
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed_at: null,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_NOTE_ACTION_ASSIGNEE', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user_ids: [],
          completed_at: null,
        },
        {
          id: 1,
          content: 'My action 11',
          user_ids: ['26486'],
          completed_at: null,
        },
      ],
    };
    const action = {
      type: 'UPDATE_NOTE_ACTION_ASSIGNEE',
      payload: {
        selectedId: '1234',
        actionIndex: 0,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user_ids: ['1234'],
          completed_at: null,
        },
        {
          id: 1,
          content: 'My action 11',
          user_ids: ['26486'],
          completed_at: null,
        },
      ],
    });
  });

  it('returns correct state on ADD_NOTE_ACTION', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [],
    };
    const action = {
      type: 'ADD_NOTE_ACTION',
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          content: '',
          user_ids: [],
          completed: false,
          due_date: null,
        },
      ],
    });
  });

  it('returns correct state on REMOVE_NOTE_ACTION', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed: false,
        },
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed: false,
        },
      ],
    };
    const action = {
      type: 'REMOVE_NOTE_ACTION',
      payload: {
        actionIndex: 0,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed: false,
        },
      ],
    });
  });

  it('returns correct state on TOGGLE_ACTION_CHECKBOX', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed: false,
        },
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed: false,
        },
      ],
    };
    const action = {
      type: 'TOGGLE_ACTION_CHECKBOX',
      payload: {
        actionIndex: 0,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed: true,
        },
        {
          id: 1,
          content: 'My action 11',
          user: {
            id: 26486,
            fullname: 'Gustavo Lazaro Amendola',
          },
          completed: false,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_ACTION_DUE_DATE', () => {
    const initialState = {
      ...defaultState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed: false,
          due_date: null,
        },
      ],
    };
    const action = {
      type: 'UPDATE_ACTION_DUE_DATE',
      payload: {
        dueDate: '2019-06-25T23:00:00+00:00',
        actionIndex: 0,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      annotation_actions: [
        {
          id: 2,
          content: 'My action 223',
          user: null,
          completed: false,
          due_date: '2019-06-25T23:00:00+00:00',
        },
      ],
    });
  });

  it('returns correct state on POPULATE_NOTE_MODAL', () => {
    const initialState = {
      ...defaultState,
    };
    const annotationData = {
      ...annotation(),
      organisation_annotation_type: {
        id: 1,
      },
    };
    const action = {
      type: 'POPULATE_NOTE_MODAL',
      payload: {
        annotation: annotationData,
        options: { isEditing: false, isDuplicating: false },
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      ...annotationData,
      id: null,
      modalType: 'ADD_NEW',
      annotation_type_id: annotationData.organisation_annotation_type.id,
      annotation_date: '2019-06-25T23:00:00+00:00',
    });
  });

  it('returns correct state on POPULATE_NOTE_MODAL when it is editing a note', () => {
    const initialState = {
      ...defaultState,
    };
    const annotationData = {
      ...annotation(),
      organisation_annotation_type: {
        id: 1,
      },
    };
    const action = {
      type: 'POPULATE_NOTE_MODAL',
      payload: {
        annotation: annotationData,
        options: { isEditing: true, isDuplicating: false },
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      ...annotationData,
      id: annotationData.id,
      modalType: 'EDIT',
      annotation_type_id: annotationData.organisation_annotation_type.id,
      annotation_date: '2019-06-25T23:00:00+00:00',
    });
  });

  it('returns correct state on POPULATE_NOTE_MODAL when it is duplicating a note', () => {
    const initialState = {
      ...defaultState,
    };
    const annotationData = {
      ...annotation(),
      organisation_annotation_type: {
        id: 1,
      },
      annotation_date: '2019-06-25T23:00:00+00:00',
    };
    const action = {
      type: 'POPULATE_NOTE_MODAL',
      payload: {
        annotation: annotationData,
        options: { isEditing: false, isDuplicating: true },
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      ...annotationData,
      id: null,
      modalType: 'DUPLICATE',
      annotation_type_id: annotationData.organisation_annotation_type.id,
    });
  });

  it('returns correct state on UPDATE_FILES', () => {
    const initialState = {
      ...defaultState,
      unUploadedFiles: [],
    };
    const files = [{ ...dummyFileAttachment }];
    const action = {
      type: 'UPDATE_FILES',
      payload: {
        files,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      unUploadedFiles: files,
    });
  });

  it('returns correct state on REMOVE_UPLOADED_FILE', () => {
    const initialState = {
      ...defaultState,
      attachments: [
        {
          id: 12345566,
          original_filename: 'physio_2211_jon_doe.jpg',
          created: '2019-06-25T23:00:00Z',
          filesize: 1564,
          confirmed: true,
        },
        {
          id: 5465656,
          original_filename: 'physio_2211_jon_doe.doc',
          created: '2019-06-25T23:00:00Z',
          filesize: 123,
          confirmed: true,
        },
      ],
    };
    const action = {
      type: 'REMOVE_UPLOADED_FILE',
      payload: {
        fileId: 12345566,
      },
    };

    const nextState = annotationModalReducer(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      attachments: [
        {
          id: 5465656,
          original_filename: 'physio_2211_jon_doe.doc',
          created: '2019-06-25T23:00:00Z',
          filesize: 123,
          confirmed: true,
        },
      ],
    });
  });
});
