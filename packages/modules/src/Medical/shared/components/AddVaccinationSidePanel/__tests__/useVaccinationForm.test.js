import { renderHook, act } from '@testing-library/react-hooks';
import useVaccinationForm, {
  initialFormState,
} from '../hooks/useVaccinationForm';

describe('useVaccinationForm', () => {
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useVaccinationForm());
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

  it('returns correct state on SET_VACCINATION_NAME', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.vaccination_name).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_VACCINATION_NAME',
        vaccination_name: 'vaccination_name',
      });
    });
    expect(result.current.formState.vaccination_name).toEqual(
      'vaccination_name'
    );
  });

  it('returns correct state on SET_VACCINATION_ISSUE_DATE', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.issue_date).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_VACCINATION_ISSUE_DATE',
        issue_date: '15-04-2022',
      });
    });
    expect(result.current.formState.issue_date).toEqual('15-04-2022');
  });

  it('returns correct state on SET_VACCINATION_RENEWAL_DATE', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.renewal_date).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_VACCINATION_RENEWAL_DATE',
        renewal_date: '15-04-2022',
      });
    });
    expect(result.current.formState.renewal_date).toEqual('15-04-2022');
  });

  it('returns correct state on SET_VACCINATION_BATCH_NUMBER', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.batch_number).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_VACCINATION_BATCH_NUMBER',
        batch_number: '15',
      });
    });
    expect(result.current.formState.batch_number).toEqual('15');
  });

  it('returns correct state on SET_VACCINATION_EXPIRATION_DATE', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.expiration_date).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_VACCINATION_EXPIRATION_DATE',
        expiration_date: '15-04-2022',
      });
    });
    expect(result.current.formState.expiration_date).toEqual('15-04-2022');
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useVaccinationForm());
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

  it('returns correct state on SET_CHRONIC_IDS', () => {
    const { result } = renderHook(() => useVaccinationForm());
    const { formState, dispatch } = result.current;

    expect(formState.chronic_issue_ids).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_CHRONIC_IDS',
        chronicIds: [1, 2, 3],
      });
    });
    expect(result.current.formState.chronic_issue_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useVaccinationForm());
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

  it('returns correct state on SET_VISIBILITY', () => {
    const { result } = renderHook(() => useVaccinationForm());
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

    const { result } = renderHook(() => useVaccinationForm());
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
    const { result } = renderHook(() => useVaccinationForm());
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
    const { result } = renderHook(() => useVaccinationForm());
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
    const { result } = renderHook(() => useVaccinationForm());
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
