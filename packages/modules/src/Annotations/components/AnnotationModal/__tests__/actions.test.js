import { annotation } from '../resources/AnnotationDummyData';
import {
  closeNotesModal,
  noteTypeChange,
  noteTitleChange,
  noteTextChange,
  noteRichTextChange,
  noteDateChange,
  noteAthleteChange,
  updateNoteActionText,
  updateNoteActionAssignee,
  addNoteAction,
  removeNoteAction,
  toggleActionCheckbox,
  updateActionDueDate,
  populateNoteModal,
  hideAppStatus,
  updateFiles,
  removeUploadedFile,
} from '../actions';

describe('Annotation Modal Actions', () => {
  const dummyFileAttachment = {
    lastModified: 1542706027020,
    lastModifiedDate: '2019-06-25T23:00:00Z',
    name: 'sample.csv',
    size: 124625,
    type: 'text/csv',
    webkitRelativePath: '',
  };

  it('has the correct action CLOSE_NOTES_MODAL', () => {
    const orgAnnotationTypes = [{ id: 1 }];
    const expectedAction = {
      type: 'CLOSE_NOTES_MODAL',
      payload: {
        annotationTypes: orgAnnotationTypes,
      },
    };

    expect(closeNotesModal(orgAnnotationTypes)).toEqual(expectedAction);
  });

  it('has the correct action NOTE_TYPE_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_TYPE_CHANGE',
      payload: {
        typeId: 1,
      },
    };

    expect(noteTypeChange(1)).toEqual(expectedAction);
  });

  it('has the correct action NOTE_TITLE_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_TITLE_CHANGE',
      payload: {
        title: 'new title',
      },
    };

    expect(noteTitleChange('new title')).toEqual(expectedAction);
  });

  it('has the correct action NOTE_TEXT_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_TEXT_CHANGE',
      payload: {
        text: 'new content',
      },
    };

    expect(noteTextChange('new content')).toEqual(expectedAction);
  });

  it('has the correct action NOTE_RICH_TEXT_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_RICH_TEXT_CHANGE',
      payload: {
        content: 'new content',
      },
    };

    expect(noteRichTextChange('new content')).toEqual(expectedAction);
  });

  it('has the correct action NOTE_DATE_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_DATE_CHANGE',
      payload: {
        date: '2019-06-25T23:00:00Z',
      },
    };

    expect(noteDateChange('2019-06-25T23:00:00Z')).toEqual(expectedAction);
  });

  it('has the correct action NOTE_ATHLETE_CHANGE', () => {
    const expectedAction = {
      type: 'NOTE_ATHLETE_CHANGE',
      payload: {
        athleteId: 123,
        athleteName: 'Jon Doe',
      },
    };

    expect(noteAthleteChange(123, 'Jon Doe')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_ACTION_TEXT', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_ACTION_TEXT',
      payload: {
        text: 'new content',
        actionIndex: 0,
      },
    };

    expect(updateNoteActionText('new content', 0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_NOTE_ACTION_ASSIGNEE', () => {
    const expectedAction = {
      type: 'UPDATE_NOTE_ACTION_ASSIGNEE',
      payload: {
        selectedId: '123',
        actionIndex: 0,
      },
    };

    expect(updateNoteActionAssignee('123', 0)).toEqual(expectedAction);
  });

  it('has the correct action ADD_NOTE_ACTION', () => {
    const expectedAction = {
      type: 'ADD_NOTE_ACTION',
    };

    expect(addNoteAction()).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_NOTE_ACTION', () => {
    const expectedAction = {
      type: 'REMOVE_NOTE_ACTION',
      payload: {
        actionIndex: 0,
      },
    };

    expect(removeNoteAction(0)).toEqual(expectedAction);
  });

  it('has the correct action TOGGLE_ACTION_CHECKBOX', () => {
    const expectedAction = {
      type: 'TOGGLE_ACTION_CHECKBOX',
      payload: {
        actionIndex: 0,
      },
    };

    expect(toggleActionCheckbox(0)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_ACTION_DUE_DATE', () => {
    const expectedAction = {
      type: 'UPDATE_ACTION_DUE_DATE',
      payload: {
        dueDate: '2020-06-20',
        actionIndex: 0,
      },
    };

    expect(updateActionDueDate('2020-06-20', 0)).toEqual(expectedAction);
  });

  it('has the correct action POPULATE_NOTE_MODAL', () => {
    const annotationData = {
      ...annotation(),
    };
    const expectedAction = {
      type: 'POPULATE_NOTE_MODAL',
      payload: {
        annotation: annotationData,
        options: { isEditing: true },
      },
    };

    expect(populateNoteModal(annotationData, { isEditing: true })).toEqual(
      expectedAction
    );
  });

  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_FILES', () => {
    const files = [{ ...dummyFileAttachment }, { ...dummyFileAttachment }];
    const expectedAction = {
      type: 'UPDATE_FILES',
      payload: { files },
    };

    expect(updateFiles(files)).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_UPLOADED_FILE', () => {
    const expectedAction = {
      type: 'REMOVE_UPLOADED_FILE',
      payload: { fileId: 1 },
    };

    expect(removeUploadedFile(1)).toEqual(expectedAction);
  });
});
