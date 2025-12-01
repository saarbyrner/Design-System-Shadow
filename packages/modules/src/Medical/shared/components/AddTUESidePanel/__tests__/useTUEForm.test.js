import { renderHook, act } from '@testing-library/react-hooks';

import useTueForm, { initialFormState } from '../hooks/useTUEForm';

describe('useTueForm', () => {
  test('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.athlete_id).toBeNull();

    act(() => {
      result.current.dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });

    expect(result.current.formState.athlete_id).toBe(123);
  });

  test('returns correct state on SET_TUE_DATE', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.tue_date).toBe('');

    act(() => {
      result.current.dispatch({
        type: 'SET_TUE_DATE',
        tue_date: '15-04-2022',
      });
    });

    expect(result.current.formState.tue_date).toBe('15-04-2022');
  });

  test('returns correct state on SET_TUE_NAME', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.tue_name).toBe('');

    act(() => {
      result.current.dispatch({
        type: 'SET_TUE_NAME',
        tue_name: 'tue_name',
      });
    });

    expect(result.current.formState.tue_name).toBe('tue_name');
  });

  test('returns correct state on SET_TUE_EXPIRATION_DATE', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.tue_expiration_date).toBe('');

    act(() => {
      result.current.dispatch({
        type: 'SET_TUE_EXPIRATION_DATE',
        tue_expiration_date: '15-04-2022',
      });
    });

    expect(result.current.formState.tue_expiration_date).toBe('15-04-2022');
  });

  test('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.illness_occurrence_ids).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [1, 2, 3],
      });
    });

    expect(result.current.formState.illness_occurrence_ids).toEqual([1, 2, 3]);
  });

  test('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.injury_occurrence_ids).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [1, 2, 3],
      });
    });

    expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
  });

  test('returns correct state on SET_CHRONIC_IDS', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.chronic_issue_ids).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'SET_CHRONIC_IDS',
        chronicIds: [1, 2, 3],
      });
    });

    expect(result.current.formState.chronic_issue_ids).toEqual([1, 2, 3]);
  });

  test('returns correct state on SET_VISIBILITY', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.restricted_to_doc).toBe(false);
    expect(result.current.formState.restricted_to_psych).toBe(false);

    act(() => {
      result.current.dispatch({
        type: 'SET_VISIBILITY',
        visibilityId: 'DOCTORS',
      });
    });

    expect(result.current.formState.restricted_to_doc).toBe(true);
    expect(result.current.formState.restricted_to_psych).toBe(false);
  });

  test('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
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

    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.queuedAttachments).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_QUEUED_ATTACHMENTS',
        queuedAttachments: files,
      });
    });

    expect(result.current.formState.queuedAttachments).toEqual(files);
  });

  test('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useTueForm());

    expect(result.current.formState.queuedAttachmentTypes).toEqual([]);

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });

    expect(result.current.formState.queuedAttachmentTypes).toEqual(['FILE']);
  });

  test('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
    const { result } = renderHook(() => useTueForm());

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'REMOVE_ATTACHMENT_TYPE',
        queuedAttachmentType: 'FILE',
      });
    });

    expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
  });

  test('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useTueForm());

    act(() => {
      result.current.dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });

    expect(result.current.formState).not.toEqual(initialFormState);

    act(() => {
      result.current.dispatch({
        type: 'CLEAR_FORM',
      });
    });

    expect(result.current.formState).toEqual(initialFormState);
  });
});
