import { renderHook, act } from '@testing-library/react-hooks';

import useAddConcussionAssessmentForm, {
  getInitialFormState,
} from '../hooks/useAddConcussionAssessmentForm';
import mockedSquadAthletes from './mockedSquadAthletes';

describe('useAddConcussionAssessmentForm', () => {
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useAddConcussionAssessmentForm());
    const { formState, dispatch } = result.current;

    expect(formState.athlete_id).toBeNull();

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 2,
        squadAthletes: mockedSquadAthletes,
      });
    });

    expect(result.current.formState.athlete_id).toBe(2);
    expect(result.current.formState.athlete_name).toBe('Athlete 2 Name');
  });

  it('returns correct state on SET_ASSESSMENT_IDS', () => {
    const { result } = renderHook(() => useAddConcussionAssessmentForm());
    const { formState, dispatch } = result.current;

    expect(formState.assessment_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_ASSESSMENT_IDS',
        assessmentIds: [123],
      });
    });

    expect(result.current.formState.assessment_ids).toEqual([123]);
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useAddConcussionAssessmentForm());
    const { formState, dispatch } = result.current;

    expect(formState.illness_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [1, 2, 3],
      });
    });

    expect(result.current.formState.illness_occurrence_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useAddConcussionAssessmentForm());
    const { formState, dispatch } = result.current;

    expect(formState.injury_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [1, 2, 3],
      });
    });

    expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useAddConcussionAssessmentForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(getInitialFormState());

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });

    expect(result.current.formState).toEqual(getInitialFormState());
  });
});
