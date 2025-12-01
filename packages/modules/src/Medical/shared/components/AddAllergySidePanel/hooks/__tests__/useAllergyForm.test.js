import { renderHook, act } from '@testing-library/react-hooks';
import useAllergyForm, { InitialFormState } from '../useAllergyForm';

describe('useAllergyForm', () => {
  let formHook;

  beforeEach(() => {
    formHook = renderHook(() => useAllergyForm());
  });

  it('returns the correct state on CLEAR_FORM', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(formHook.result.current.formState).toEqual(InitialFormState);
  });

  it('returns the correct state on SET_ATHLETE_ID', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.athlete_id).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 123,
      });
    });
    expect(formHook.result.current.formState.athlete_id).toEqual(123);
  });

  it('returns the correct state on SET_ALLERGEN', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.allergen.type).toEqual('DrfirstDrug');

    act(() => {
      dispatch({
        type: 'SET_AllERGEN',
        allergen: {
          rcopia_id: '21',
          type: 'DrfirstDrug',
          search_expression: 'ibu',
        },
      });
    });
    expect(formHook.result.current.formState.allergen.rcopia_id).toEqual('');
  });

  it('returns the correct state on SET_ALLERGY_NAME', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.allergy_name).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_ALLERGY_NAME',
        allergyName: 'Name mocked',
      });
    });
    expect(formHook.result.current.formState.allergy_name).toEqual(
      'Name mocked'
    );
  });

  it('returns the correct state on SET_CUSTOM_ALLERGY_NAME', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.name).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_CUSTOM_ALLERGY_NAME',
        customAllergyName: 'Optional Title 1 Mocked',
      });
    });
    expect(formHook.result.current.formState.name).toEqual(
      'Optional Title 1 Mocked'
    );
  });

  it('returns the correct state on SET_EVER_HOSPITALISED', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.ever_been_hospitalised).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_EVER_HOSPITALISED',
        everBeenHospitalised: true,
      });
    });
    expect(formHook.result.current.formState.ever_been_hospitalised).toEqual(
      true
    );
  });

  it('returns the correct state on SET_REQUIRE_EPINEPHRINE', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.require_epinephrine).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_REQUIRE_EPINEPHRINE',
        requireEpinephrine: true,
      });
    });
    expect(formHook.result.current.formState.require_epinephrine).toEqual(true);
  });

  it('returns the correct state on SET_SYMPTOMS', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.symptoms).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_SYMPTOMS',
        symptoms: 'Sore neck and head.',
      });
    });
    expect(formHook.result.current.formState.symptoms).toEqual(
      'Sore neck and head.'
    );
  });

  it('returns the correct state on SET_SEVERITY', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.severity).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_SEVERITY',
        severity: 'mild',
      });
    });
    expect(formHook.result.current.formState.severity).toEqual('mild');
  });

  it('returns the correct state on SET_ALLERGY_DATE', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.allergy_date).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_ALLERGY_DATE',
        allergyDate: '05-02-2022',
      });
    });
    expect(formHook.result.current.formState.allergy_date).toEqual(
      '05-02-2022'
    );
  });

  it('returns the correct state on SET_ILLNESS_IDS', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.illness_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [1, 2, 3],
      });
    });
    expect(formHook.result.current.formState.illness_occurrence_ids).toEqual([
      1, 2, 3,
    ]);
  });

  it('returns the correct state on SET_INJURY_IDS', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.injury_occurrence_ids).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [1, 2, 3],
      });
    });
    expect(formHook.result.current.formState.injury_occurrence_ids).toEqual([
      1, 2, 3,
    ]);
  });

  it('returns the correct state on SET_VISIBILITY', () => {
    const { formState, dispatch } = formHook.result.current;
    expect(formState.restricted_to_doc).toEqual(false);
    expect(formState.restricted_to_psych).toEqual(false);

    act(() => {
      dispatch({
        type: 'SET_VISIBILITY',
        visibilityId: 'DOCTORS',
      });
    });
    expect(formHook.result.current.formState.restricted_to_doc).toEqual(true);
    expect(formHook.result.current.formState.restricted_to_psych).toEqual(
      false
    );
  });

  it('returns the correct state on AUTOPOPULATE_SELECTED_ALLERGY', () => {
    const { formState, dispatch } = formHook.result.current;

    expect(formState).toEqual(InitialFormState);

    act(() => {
      dispatch({
        type: 'AUTOPOPULATE_SELECTED_ALLERGY',
        athleteId: 1,
        allergen: { id: 7, name: 'Milk', allergen_type: 'Food allergy' },
        allergenName: {
          label: 'Milk',
          type: 'Food allergy',
          value: 7,
        },
        allergyName: '',
        symptoms: '',
        severity: 'moderate',
        everBeenHospitalised: false,
        requireEpinephrine: false,
      });
    });
    expect(formHook.result.current.formState).toEqual({
      ...InitialFormState,
      athlete_id: 1,
      allergen: { id: 7, name: 'Milk', allergen_type: 'Food allergy' },
      allergen_name: {
        label: 'Milk',
        type: 'Food allergy',
        value: 7,
      },
      name: '',
      symptoms: '',
      severity: 'moderate',
      ever_been_hospitalised: false,
      require_epinephrine: false,
    });
  });
});
