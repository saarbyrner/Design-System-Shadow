import { renderHook, act } from '@testing-library/react-hooks';
import useMedicalAlertForm, {
  InitialFormState,
} from '../hooks/useMedicalAlertForm';

describe('useMedicalAlertForm', () => {
  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(InitialFormState);
  });

  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState.athlete_id).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });
    expect(result.current.formState.athlete_id).toEqual(123);
  });

  it('returns correct state on SET_MEDICAL_ALERT_ID', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_MEDICAL_ALERT_ID',
        medical_alert_id: 123,
      });
    });

    expect(result.current.formState.medical_alert_id).toEqual(123);
  });

  it('returns correct state on SET_ALERT_TITLE', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_ALERT_TITLE',
        alert_title: 'test',
      });
    });

    expect(result.current.formState.alert_title).toEqual('test');
  });

  it('returns correct state on SET_CUSTOM_ALERT_NAME', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState.custom_alert_name).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_CUSTOM_ALERT_NAME',
        custom_alert_name: 'Optional Title 1 Mocked',
      });
    });
    expect(result.current.formState.custom_alert_name).toEqual(
      'Optional Title 1 Mocked'
    );
  });

  it('returns correct state on SET_SEVERITY', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState.severity).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_SEVERITY',
        severity: 'mild',
      });
    });
    expect(result.current.formState.severity).toEqual('mild');
  });

  it('returns correct state on SET_ALERT_DATE', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState.alert_date).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_ALERT_DATE',
        alert_date: '05-02-2022',
      });
    });
    expect(result.current.formState.alert_date).toEqual('05-02-2022');
  });

  it('returns correct state on SET_VISIBILITY', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState.restricted_to_doc).toEqual(false);
    expect(formState.restricted_to_psych).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_VISIBILITY',
        visibilityId: 'DOCTORS',
      });
    });
    expect(result.current.formState.restricted_to_doc).toEqual(true);
    expect(result.current.formState.restricted_to_psych).toEqual(false);
  });

  it('returns the correct state on AUTOPOPULATE_SELECTED_ALERT', () => {
    const { result } = renderHook(() => useMedicalAlertForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'AUTOPOPULATE_SELECTED_ALERT',
        athlete_id: 1,
        medical_alert_id: 8,
        alert_title: 'Diabetes Type 1',
        severity: 'moderate',
        restricted_to_doc: false,
        restricted_to_psych: false,
      });
    });
    expect(result.current.formState).toEqual({
      ...InitialFormState,
      athlete_id: 1,
      medical_alert_id: 8,
      alert_title: 'Diabetes Type 1',
      severity: 'moderate',
      restricted_to_doc: false,
      restricted_to_psych: false,
    });
  });
});
