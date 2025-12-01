import { renderHook, act } from '@testing-library/react-hooks';
import useCopyExercisesForm from '../useCopyExercisesForm';

describe('useCopyExercisesForm', () => {
  it('returns correct state on SET_COPY_COMMENTS', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.copy_comments).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_COPY_COMMENTS',
        copy: true,
      });
    });

    expect(result.current.formState.copy_comments).toEqual(true);
  });

  it('returns correct state on SET_COPY_UNCOMPRESSED', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.copy_uncompressed).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_COPY_UNCOMPRESSED',
        uncompressed: true,
      });
    });

    expect(result.current.formState.copy_uncompressed).toEqual(true);
  });

  it('returns correct state on SET_COPY_MAINTENANCE', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.copy_maintenance).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_COPY_MAINTENANCE',
        maintenance: true,
      });
    });

    expect(result.current.formState.copy_maintenance).toEqual(true);
  });

  it('returns correct state on SET_SESSION_DATES', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.session_dates).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_SESSION_DATES',
        sessionDates: ['2023-03-13', '2023-03-12'],
      });
    });

    expect(result.current.formState.session_dates).toEqual([
      '2023-03-13',
      '2023-03-12',
    ]);
  });

  it('returns correct state on SET_ATHLETE_AND_ISSUE_DETAILS', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.athlete_id).toEqual(null);
    expect(formState.issue_id).toEqual(null);
    expect(formState.issue_type).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_AND_ISSUE_DETAILS',
        athleteId: 100,
        selectedIssueType: 'Injury',
        selectedIssueId: 1,
      });
    });

    expect(result.current.formState.athlete_id).toEqual(100);
    expect(result.current.formState.issue_id).toEqual(1);
    expect(result.current.formState.issue_type).toEqual('Injury');
  });

  it('returns correct state on SET_SELECTED_ISSUE_DETAILS', () => {
    const { result } = renderHook(() => useCopyExercisesForm());
    const { formState, dispatch } = result.current;

    expect(formState.issue_id).toEqual(null);
    expect(formState.issue_type).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_SELECTED_ISSUE_DETAILS',
        selectedIssueType: 'Injury',
        selectedIssueId: 1,
      });
    });

    expect(result.current.formState.issue_id).toEqual(1);
    expect(result.current.formState.issue_type).toEqual('Injury');
  });
});
