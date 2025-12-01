import { renderHook, act } from '@testing-library/react-hooks';
import useDiagnosticForm, {
  initialFormState,
} from '../useDiagnosticAttachmentForm';

describe('useDiagnosticForm', () => {
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.athleteId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 92782,
      });
    });
    expect(result.current.formState.athleteId).toEqual(92782);
  });

  it('returns correct state on SET_DIAGNOSTIC_ID', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.diagnosticId).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_DIAGNOSTIC_ID',
        diagnosticId: 61388,
      });
    });

    expect(result.current.formState.diagnosticId).toEqual(61388);
  });

  it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
    const files = [
      {
        lastModified: 1542706027020,
        lastModifiedDate: '2022-04-15T23:00:00Z',
        filename: 'sample.csv',
        fileSize: 124625,
        fileType: 'text/csv',
        webkitRelativePath: '',
      },
    ];

    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedAttachments).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_ATTACHMENTS',
        queuedAttachments: files,
      });
    });
    expect(result.current.formState.queuedAttachments).toEqual(files);
  });

  it('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedAttachmentTypes).toEqual([]);
    act(() => {
      dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });
    expect(result.current.formState.queuedAttachmentTypes).toEqual(['FILE']);
  });

  it('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { dispatch } = result.current;
    act(() => {
      dispatch({
        type: 'UPDATE_FILE_ATTACHMENT_QUEUE',
        queuedAttachmentTypes: 'FILE',
      });
    });
    act(() => {
      dispatch({
        type: 'REMOVE_ATTACHMENT_TYPE',
        attachmentType: 'FILE',
      });
    });
    expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
  });

  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useDiagnosticForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(initialFormState);
    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(initialFormState);
  });
});
