import { renderHook, act } from '@testing-library/react-hooks';
import useMedicalFileForm, { InitialFormState } from '../useMedicalFileForm';

describe('useMedicalFileForm', () => {
  let formHook;
  const documentDate = '2024-04-24T00:00:00+01:00';
  const fileName = 'Test Filename';

  beforeEach(() => {
    formHook = renderHook(() => useMedicalFileForm());
  });

  it('returns the correct state on CLEAR_FORM', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(formState).toEqual(InitialFormState);
  });

  it('returns the correct state on SET_SELECTED_ATHLETE', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.selectedAthlete).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_SELECTED_ATHLETE',
        selectedAthlete: 123,
      });
    });
    expect(formHook.result.current.formState.selectedAthlete).toEqual(123);
  });

  it('returns the correct state on SET_SELECTED_DATE', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.selectedDate).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_SELECTED_DATE',
        selectedDate: documentDate,
      });
    });
    expect(formHook.result.current.formState.selectedDate).toEqual(
      documentDate
    );
  });

  it('returns the correct state on SET_SELECTED_CATEGORIES', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.selectedCategories).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_SELECTED_CATEGORIES',
        selectedCategories: [1],
      });
    });
    expect(formHook.result.current.formState.selectedCategories).toEqual([1]);
  });

  it('returns the correct state on SET_UPDATED_FILENAME', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.updatedFileName).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_UPDATED_FILENAME',
        updatedFileName: fileName,
      });
    });
    expect(formHook.result.current.formState.updatedFileName).toEqual(fileName);
  });

  it('returns the correct state on SET_SELECTED_ISSUES', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.selectedIssues).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_SELECTED_ISSUES',
        selectedIssues: ['Illness_123', 'Injury_456'],
      });
    });
    expect(formHook.result.current.formState.selectedIssues).toEqual([
      'Illness_123',
      'Injury_456',
    ]);
  });

  it('returns the correct state on SET_NOTE_SECTION', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.noteTitle).toEqual('');
    expect(formState.noteContent).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_NOTE_SECTION',
        noteTitle: 'Note Title',
        noteContent: '<p>Content</p>',
      });
    });
    expect(formHook.result.current.formState.noteTitle).toEqual('Note Title');
    expect(formHook.result.current.formState.noteContent).toEqual(
      '<p>Content</p>'
    );
  });

  it('returns the correct state on SET_FILES_TO_UPLOAD', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.filesToUpload).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_FILES_TO_UPLOAD',
        filesToUpload: [{ filename: 'testfile.jpg' }],
      });
    });
    expect(formHook.result.current.formState.filesToUpload).toEqual([
      { filename: 'testfile.jpg' },
    ]);
  });

  it('returns the correct state on AUTOPOPULATE_SELECTED_FILE', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'AUTOPOPULATE_SELECTED_FILE',
        selectedAthlete: 1,
        selectedDate: documentDate,
        selectedCategories: [1, 2, 3],
        updatedFileName: fileName,
        selectedIssues: ['Illness_123'],
      });
    });
    expect(formHook.result.current.formState).toEqual({
      ...InitialFormState,
      selectedAthlete: 1,
      selectedDate: documentDate,
      selectedCategories: [1, 2, 3],
      updatedFileName: fileName,
      selectedIssues: ['Illness_123'],
    });
  });
});
