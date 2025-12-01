import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import useMedicalNoteForm, { init } from '../hooks/useMedicalNoteForm';

describe('useMedicalNoteForm', () => {
  const defaultFormValues = { medicalNoteType: 1, athlete_id: 1 };
  const dateISOString = '2025-06-21T13:33:33.000Z';
  const mockDateValue = new Date(dateISOString);

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
    jest.setSystemTime(mockDateValue);
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
  });

  it('returns the correct default form value', () => {
    const formValues = {
      medicalNoteType: 1,
      athlete_id: 2,
      diagnostic_id: 3,
      annotationable_id: 4,
      procedure_id: 5,
      title: 'note title',
      noteContent: 'Note content',
      visibility: 'DEFAULT',
      illnessIds: [10],
      injuryIds: [20],
      chronicIds: [30],
      rehabSessionIds: [40],
    };

    const { result } = renderHook(() => useMedicalNoteForm(formValues));

    expect(result.current.formState).toEqual({
      annotationable_type: 'Athlete',
      organisation_annotation_type_id: formValues.medicalNoteType,
      document_note_category_ids: [],
      annotationable_id: formValues.annotationable_id,
      athlete_id: formValues.athlete_id,
      diagnostic_id: formValues.diagnostic_id,
      procedure_id: formValues.procedure_id,
      title: formValues.title,
      annotation_date: expect.any(moment),
      content: formValues.noteContent,
      illness_occurrence_ids: formValues.illnessIds,
      injury_occurrence_ids: formValues.injuryIds,
      chronic_issue_ids: formValues.chronicIds,
      restricted_to_doc: false,
      restricted_to_psych: false,
      attachments_attributes: [],
      annotation_actions_attributes: [],
      scope_to_org: true,
      rehab_session_ids: formValues.rehabSessionIds,
      author_id: null,
      note_visibility_ids: [],
      squad_id: null,
      athlete_active_period: undefined,
    });

    expect(result.current.formState.annotation_date).toBeInstanceOf(moment);
    expect(result.current.formState.annotation_date.toISOString()).toEqual(
      dateISOString
    );
  });

  it('returns correct initial state when annotationDate is supplied', () => {
    const { result } = renderHook(() =>
      useMedicalNoteForm({
        medicalNoteType: 4,
        athlete_id: 1,
        annotationDate: '2023-04-17T00:00:00+01:00',
      })
    );
    expect(result.current.formState.annotation_date).toEqual(
      '2023-04-17T00:00:00+01:00'
    );
  });

  it('returns correct state on SET_MEDICAL_NOTE_TYPE_ID', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.organisation_annotation_type_id).toEqual(1);

    dispatch({
      type: 'SET_MEDICAL_NOTE_TYPE_ID',
      medicalNoteTypeId: 1,
    });
    expect(result.current.formState.organisation_annotation_type_id).toEqual(1);
  });

  it('returns correct state on SET_DOCUMENT_NOTE_CATEGORY_IDS', () => {
    const { result } = renderHook(() =>
      useMedicalNoteForm({ medicalNoteType: 4, athlete_id: 1 })
    );
    const { formState, dispatch } = result.current;

    expect(formState.document_note_category_ids).toEqual([]);

    dispatch({
      type: 'SET_DOCUMENT_NOTE_CATEGORY_IDS',
      categoryIds: [1, 2],
    });
    expect(result.current.formState.document_note_category_ids).toEqual([1, 2]);
  });

  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.athlete_id).toEqual(1);

    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId: 123,
    });
    expect(result.current.formState.athlete_id).toEqual(123);
  });

  it('returns correct state on SET_TITLE', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.title).toEqual('');

    dispatch({
      type: 'SET_TITLE',
      title: 'Title mocked',
    });
    expect(result.current.formState.title).toEqual('Title mocked');
  });

  it('returns correct state on SET_DATE', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.annotation_date).not.toEqual(undefined);

    dispatch({
      type: 'SET_DATE',
      date: 'Apr 28, 2022',
    });
    expect(result.current.formState.annotation_date).toEqual('Apr 28, 2022');
  });

  it('returns correct state on SET_CONTENT', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.content).toEqual('');

    dispatch({
      type: 'SET_CONTENT',
      content: 'Content mocked',
    });
    expect(result.current.formState.content).toEqual('Content mocked');
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.illness_occurrence_ids).toEqual([]);

    dispatch({
      type: 'SET_ILLNESS_IDS',
      illnessIds: [1, 2, 3],
    });
    expect(result.current.formState.illness_occurrence_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.injury_occurrence_ids).toEqual([]);

    dispatch({
      type: 'SET_INJURY_IDS',
      injuryIds: [1, 2, 3],
    });
    expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
  });

  it('returns correct state on SET_VISIBILITY', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.restricted_to_doc).toEqual(false);
    expect(formState.restricted_to_psych).toEqual(false);

    dispatch({
      type: 'SET_VISIBILITY',
      visibilityId: 'DOCTORS',
    });
    expect(result.current.formState.restricted_to_doc).toEqual(true);
    expect(result.current.formState.restricted_to_psych).toEqual(false);
  });

  it('returns correct state on RESET_ATTACHMENTS', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.attachments_attributes).toEqual([]);

    dispatch({
      type: 'RESET_ATTACHMENTS',
    });
    expect(formState.attachments_attributes).toEqual([]);
  });

  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;
    const initialState = init(defaultFormValues);

    expect(formState).toEqual(initialState);

    dispatch({
      type: 'CLEAR_FORM',
      defaultFormValues,
    });
    expect(result.current.formState).toEqual(initialState);
  });

  it('returns correct state on SET_AUTHOR_ID', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { dispatch } = result.current;

    dispatch({
      type: 'SET_AUTHOR_ID',
      userId: 2,
    });
    expect(result.current.formState.author_id).toEqual(2);
  });

  it('returns correct state on SET_SQUAD_ID', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { dispatch } = result.current;

    dispatch({
      type: 'SET_SQUAD_ID',
      squadId: 2,
    });
    expect(result.current.formState.squad_id).toEqual(2);
  });

  it('updates state with rehabSessionIds', () => {
    const rehabFormValues = {
      medicalNoteType: 3,
      athlete_id: 1,
      rehabSessionIds: [1, 2, 3],
    };

    const { result } = renderHook(() => useMedicalNoteForm(rehabFormValues));
    const { formState } = result.current;

    expect(formState.organisation_annotation_type_id).toEqual(3);
    expect(formState.rehab_session_ids).toEqual([1, 2, 3]);
  });

  it('updates state with noteVisibilityIds', () => {
    const { result } = renderHook(() => useMedicalNoteForm(defaultFormValues));
    const { formState, dispatch } = result.current;

    expect(formState.note_visibility_ids).toEqual([]);

    dispatch({
      type: 'SET_NOTE_VISIBILITY_IDS',
      noteVisibilityIds: [2551, 334, 545],
    });

    expect(result.current.formState.note_visibility_ids).toEqual([
      2551, 334, 545,
    ]);
  });
});
