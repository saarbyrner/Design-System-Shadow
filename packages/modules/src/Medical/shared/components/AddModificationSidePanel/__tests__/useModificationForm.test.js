import { renderHook, act } from '@testing-library/react-hooks';

import useModificationForm, {
  initialFormState,
} from '../hooks/useModificationForm';

describe('useModificationForm', () => {
  test('returns correct state on SET_MODIFICATION_TYPE_ID', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.organisation_annotation_type_id).toBe(null);

    act(() => {
      dispatch({ type: 'SET_MODIFICATION_TYPE_ID', modificationTypeId: 1 });
    });
    expect(result.current.formState.organisation_annotation_type_id).toBe(1);
  });

  test('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.annotationable_id).toBe(null);

    act(() => {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: 123 });
    });
    expect(result.current.formState.annotationable_id).toBe(123);
  });

  test('returns correct state on SET_TITLE', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.title).toBe('');

    act(() => {
      dispatch({ type: 'SET_TITLE', title: 'Title mocked' });
    });
    expect(result.current.formState.title).toBe('Title mocked');
  });

  test('returns correct state on SET_START_DATE', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.annotation_date).not.toBe(undefined);

    act(() => {
      dispatch({ type: 'SET_START_DATE', startDate: 'Apr 28, 2022' });
    });
    expect(result.current.formState.annotation_date).toBe('Apr 28, 2022');
  });

  test('returns correct state on SET_END_DATE', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.expiration_date).toBe(undefined);

    act(() => {
      dispatch({ type: 'SET_END_DATE', endDate: 'Apr 30, 2022' });
    });
    expect(result.current.formState.expiration_date).toBe('Apr 30, 2022');
  });

  test('returns correct state on SET_DETAILS', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.content).toBe('');

    act(() => {
      dispatch({ type: 'SET_DETAILS', details: 'Details mocked' });
    });
    expect(result.current.formState.content).toBe('Details mocked');
  });

  test('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.illness_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({ type: 'SET_ILLNESS_IDS', illnessIds: [1, 2, 3] });
    });
    expect(result.current.formState.illness_occurrence_ids).toEqual([1, 2, 3]);
  });

  test('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.injury_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({ type: 'SET_INJURY_IDS', injuryIds: [1, 2, 3] });
    });
    expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
  });

  test('returns correct state on SET_VISIBILITY', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState.restricted_to_doc).toBe(false);
    expect(formState.restricted_to_psych).toBe(false);

    act(() => {
      dispatch({ type: 'SET_VISIBILITY', visibilityId: 'DOCTORS' });
    });
    expect(result.current.formState.restricted_to_doc).toBe(true);
    expect(result.current.formState.restricted_to_psych).toBe(false);
  });

  test('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useModificationForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(initialFormState);

    act(() => {
      dispatch({ type: 'CLEAR_FORM' });
    });
    expect(result.current.formState).toEqual(initialFormState);
  });
});
