import { renderHook, act } from '@testing-library/react-hooks';
import useMedicationForm from '../useMedicationForm';

describe('useMedicationForm', () => {
  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.athlete_id).toEqual(null);
    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: '123',
      });
    });
    expect(result.current.formState.athlete_id).toEqual('123');
  });

  it('returns correct state on TOGGLE_MEDICATION_TUE_OPEN', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.medicationTUEOpen).toEqual(false);
    act(() => {
      dispatch({
        type: 'TOGGLE_MEDICATION_TUE_OPEN',
      });
    });
    expect(result.current.formState.medicationTUEOpen).toEqual(true);
  });

  it('returns correct state on SET_PRESCRIBER', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.prescriber).toEqual({
      id: '',
      name: '',
    });
    act(() => {
      dispatch({
        type: 'SET_PRESCRIBER',
        prescriber: {
          id: '1',
          name: 'John Doe',
        },
      });
    });
    expect(result.current.formState.prescriber.id).toEqual('1');
    expect(result.current.formState.prescriber.name).toEqual('John Doe');
  });

  it('returns correct state on SET_PRESCRIPTION_DATE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_PRESCRIPTION_DATE',
        prescription_date: '11/01/2023',
      });
    });
    expect(result.current.formState.prescription_date).toEqual('11/01/2023');
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.illness_occurrence_ids).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [123, 345],
      });
    });
    expect(result.current.formState.illness_occurrence_ids).toEqual([123, 345]);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.injury_occurrence_ids).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [123, 345],
      });
    });
    expect(result.current.formState.injury_occurrence_ids).toEqual([123, 345]);
  });

  it('returns correct state on SET_CHRONIC_IDS', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.chronic_issue_ids).toEqual([]);
    act(() => {
      dispatch({
        type: 'SET_CHRONIC_IDS',
        chronicIds: [123, 345],
      });
    });
    expect(result.current.formState.chronic_issue_ids).toEqual([123, 345]);
  });

  it('returns correct state on SET_MEDICATION', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.medication).toEqual({
      value: null,
      label: '',
      stockId: null,
    });
    act(() => {
      dispatch({
        type: 'SET_MEDICATION',
        medication: {
          value: 1,
          label: 'ibuprofen',
          stockId: 2,
          dispensable_drug_id: 3,
          drug_type: 'Emr::Private::Models::NhsDmdDrug',
        },
      });
    });
    expect(result.current.formState.medication).toEqual({
      value: 1,
      label: 'ibuprofen',
      stockId: 2,
      dispensable_drug_id: 3,
      drug_type: 'Emr::Private::Models::NhsDmdDrug',
    });

    act(() => {
      dispatch({
        type: 'SET_MEDICATION',
        medication: {
          label: 'overwrite',
        },
      });
    });
    expect(result.current.formState.medication).toEqual({
      label: 'overwrite',
    });
  });

  it('returns correct state on SET_STOCK_LOTS', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.stock_lots).toEqual([
      {
        id: null,
        dispensed_quantity: null,
      },
    ]);
    act(() => {
      dispatch({
        type: 'SET_STOCK_LOTS',
        stock_lots: [
          {
            id: 1,
            dispensed_quantity: 2,
          },
        ],
      });
    });
    expect(result.current.formState.stock_lots).toEqual([
      {
        id: 1,
        dispensed_quantity: 2,
      },
    ]);
  });

  it('returns correct state on SET_DIRECTIONS', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.directions).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_DIRECTIONS',
        directions: 'Take once a day',
      });
    });
    expect(result.current.formState.directions).toEqual('Take once a day');
  });

  it('returns correct state on SET_DOSE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.dose).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_DOSE',
        dose: '2',
      });
    });
    expect(result.current.formState.dose).toEqual('2');
  });

  it('returns correct state on SET_QUANTITY', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.quantity).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_QUANTITY',
        quantity: '2',
      });
    });
    expect(result.current.formState.quantity).toEqual('2');
  });

  it('returns correct state on SET_STOCK_LOTS_AND_QUANTITY', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.stock_lots).toEqual([
      {
        id: null,
        dispensed_quantity: null,
      },
    ]);
    act(() => {
      dispatch({
        type: 'SET_STOCK_LOTS_AND_QUANTITY',
        stock_lots: [
          {
            id: 1,
            dispensed_quantity: 2,
          },
        ],
      });
    });
    expect(result.current.formState.stock_lots).toEqual([
      {
        id: 1,
        dispensed_quantity: 2,
      },
    ]);
    expect(result.current.formState.quantity).toEqual('2');

    act(() => {
      dispatch({
        type: 'SET_STOCK_LOTS_AND_QUANTITY',
        stock_lots: [
          {
            id: 1,
            dispensed_quantity: 2,
          },
          { id: 2, dispensed_quantity: 13 },
        ],
      });
    });

    expect(result.current.formState.stock_lots).toEqual([
      {
        id: 1,
        dispensed_quantity: 2,
      },
      { id: 2, dispensed_quantity: 13 },
    ]);
    expect(result.current.formState.quantity).toEqual('15');
  });

  it('returns correct state on SET_FREQUENCY', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.frequency).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_FREQUENCY',
        frequency: '1',
      });
    });
    expect(result.current.formState.frequency).toEqual('1');
  });

  it('returns correct state on SET_ROUTE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.route).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_ROUTE',
        route: 'by mouth',
      });
    });
    expect(result.current.formState.route).toEqual('by mouth');
  });

  it('returns correct state on SET_START_DATE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.start_date).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_START_DATE',
        start_date: '11/03/2023',
      });
    });
    expect(result.current.formState.start_date).toEqual('11/03/2023');
  });

  it('returns correct state on SET_END_DATE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.start_date).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_END_DATE',
        end_date: '11/04/2023',
      });
    });
    expect(result.current.formState.end_date).toEqual('11/04/2023');
  });

  it('returns correct state on SET_DURATION', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.duration).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_DURATION',
        duration: '9',
      });
    });
    expect(result.current.formState.duration).toEqual('9');
  });

  it('returns correct state on SET_NOTE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.note).toEqual('');
    act(() => {
      dispatch({
        type: 'SET_NOTE',
        note: 'This is a note',
      });
    });
    expect(result.current.formState.note).toEqual('This is a note');
  });

  it('returns correct state on AUTOFILL_FROM_FAVORITE', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.tapered).toEqual(false);
    expect(formState.frequency).toEqual('');
    expect(formState.route).toEqual('');
    expect(formState.directions).toEqual('');
    expect(formState.dose).toEqual('');
    expect(formState.duration).toEqual('');
    expect(formState.start_date).toEqual('');
    expect(formState.end_date).toEqual('');

    // we need prescription date to be set before autofilling
    act(() => {
      dispatch({
        type: 'SET_PRESCRIPTION_DATE',
        prescription_date: '2023-03-31T05:00:00.000Z',
      });
    });
    expect(result.current.formState.prescription_date).toEqual(
      '2023-03-31T05:00:00.000Z'
    );

    act(() => {
      dispatch({
        type: 'AUTOFILL_FROM_FAVORITE',
        frequency: '3',
        route: 'by mouth',
        directions: 'take',
        dose: '1',
        duration: '5',
        tapered: false,
      });
    });

    expect(result.current.formState.tapered).toEqual(false);
    expect(result.current.formState.frequency).toEqual('3');
    expect(result.current.formState.route).toEqual('by mouth');
    expect(result.current.formState.directions).toEqual('take');
    expect(result.current.formState.dose).toEqual('1');
    expect(result.current.formState.duration).toEqual('5');
    expect(result.current.formState.start_date).toEqual(
      '2023-03-31T05:00:00.000Z'
    );
    expect(JSON.stringify(result.current.formState.end_date)).toEqual(
      JSON.stringify('2023-04-04T05:00:00.000Z')
    );
  });

  it('returns correct state on AUTOFILL_FROM_FAVORITE tapered med', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.tapered).toEqual(false);
    expect(formState.frequency).toEqual('');
    expect(formState.route).toEqual('');
    expect(formState.directions).toEqual('');
    expect(formState.dose).toEqual('');
    expect(formState.duration).toEqual('');
    expect(formState.start_date).toEqual('');
    expect(formState.end_date).toEqual('');

    // we need prescription date to be set before autofilling
    act(() => {
      dispatch({
        type: 'SET_PRESCRIPTION_DATE',
        prescription_date: '2023-03-31T05:00:00.000Z',
      });
    });
    expect(result.current.formState.prescription_date).toEqual(
      '2023-03-31T05:00:00.000Z'
    );

    act(() => {
      dispatch({
        type: 'AUTOFILL_FROM_FAVORITE',
        frequency: null,
        route: 'by mouth',
        directions: 'take',
        dose: null,
        duration: '5',
        tapered: true,
      });
    });

    expect(result.current.formState.tapered).toEqual(true);
    expect(result.current.formState.frequency).toEqual(null);
    expect(result.current.formState.route).toEqual('by mouth');
    expect(result.current.formState.directions).toEqual('take');
    expect(result.current.formState.dose).toEqual(null);
    expect(result.current.formState.duration).toEqual('5');
    expect(result.current.formState.start_date).toEqual(
      '2023-03-31T05:00:00.000Z'
    );
    expect(JSON.stringify(result.current.formState.end_date)).toEqual(
      JSON.stringify('2023-04-04T05:00:00.000Z')
    );
  });

  it('returns correct state on TOGGLE_TAPERED', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.tapered).toEqual(false);
    expect(formState.frequency).toEqual('');
    expect(formState.dose).toEqual('');

    act(() => {
      dispatch({
        type: 'TOGGLE_TAPERED',
      });
    });
    expect(result.current.formState.tapered).toEqual(true);
    expect(result.current.formState.frequency).toEqual(null); // Cleared
    expect(result.current.formState.dose).toEqual(null); // Cleared

    act(() => {
      dispatch({
        type: 'TOGGLE_TAPERED',
      });
    });
    expect(result.current.formState.tapered).toEqual(false);
    expect(result.current.formState.frequency).toEqual(null); // Can stay null until user sets them
    expect(result.current.formState.dose).toEqual(null); // Can stay null until user sets them
  });

  it('returns correct state on AUTOPOPULATE_SELECTED_MED tapered med', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { formState, dispatch } = result.current;

    expect(formState.tapered).toEqual(false);
    expect(formState.frequency).toEqual('');
    expect(formState.route).toEqual('');
    expect(formState.directions).toEqual('');
    expect(formState.dose).toEqual('');
    expect(formState.duration).toEqual('');
    expect(formState.start_date).toEqual('');
    expect(formState.end_date).toEqual('');

    // we need prescription date to be set before autofilling
    act(() => {
      dispatch({
        type: 'SET_PRESCRIPTION_DATE',
        prescription_date: '2023-03-31T05:00:00.000Z',
      });
    });
    expect(result.current.formState.prescription_date).toEqual(
      '2023-03-31T05:00:00.000Z'
    );

    act(() => {
      dispatch({
        type: 'AUTOPOPULATE_SELECTED_MED',
        frequency: null,
        route: 'by mouth',
        directions: 'take',
        dose: null,
        duration: '5',
        tapered: true,
        prescriber: {
          id: '1',
          name: 'John Doe',
        },
        medication: {
          label: 'test',
          dispensable_drug_id: 2,
          drug_type: 'FdbDispensableDrug',
        },
      });
    });

    expect(result.current.formState.tapered).toEqual(true);
    expect(result.current.formState.frequency).toEqual(null);
    expect(result.current.formState.route).toEqual('by mouth');
    expect(result.current.formState.directions).toEqual('take');
    expect(result.current.formState.dose).toEqual(null);
    expect(result.current.formState.prescriber.id).toEqual('1');
    expect(result.current.formState.prescriber.name).toEqual('John Doe');
    expect(result.current.formState.medication).toEqual({
      dispensable_drug_id: 2,
      drug_type: 'FdbDispensableDrug',
      label: 'test',
      stockId: undefined,
      value: undefined,
    });
  });

  it('returns correct state on SET_UNLISTED_MED_NAME', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_NAME',
        name: 'Some med',
      });
    });
    expect(result.current.formState.unlistedMed.name).toEqual('Some med');
  });

  it('returns correct state on SET_UNLISTED_MED_BRAND_NAME', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_BRAND_NAME',
        brandName: 'Some brand',
      });
    });
    expect(result.current.formState.unlistedMed.brand_name).toEqual(
      'Some brand'
    );
  });

  it('returns correct state on SET_UNLISTED_MED_DRUG_FORM', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_DRUG_FORM',
        drugForm: 'Tablet',
      });
    });
    expect(result.current.formState.unlistedMed.drug_form).toEqual('Tablet');
  });

  it('returns correct state on SET_UNLISTED_MED_STRENGTH', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_STRENGTH',
        strength: '100',
      });
    });
    expect(result.current.formState.unlistedMed.med_strength).toEqual('100');
  });

  it('returns correct state on SET_UNLISTED_MED_STRENGTH_UNIT', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_STRENGTH_UNIT',
        unit: 'mg',
      });
    });
    expect(result.current.formState.unlistedMed.med_strength_unit).toEqual(
      'mg'
    );
  });

  it('returns correct state on SET_UNLISTED_MED_OTHER_UNIT', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_OTHER_UNIT',
        unit: 'davids',
      });
    });
    expect(
      result.current.formState.unlistedMed.med_strength_other_unit
    ).toEqual('davids');
  });

  it('returns correct state on SET_UNLISTED_MED_COUNTRY', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'SET_UNLISTED_MED_COUNTRY',
        country: 'IE',
      });
    });
    expect(result.current.formState.unlistedMed.country).toEqual('IE');
  });

  it('returns correct state on TOGGLE_UNLISTED_MED_OPEN', () => {
    const { result } = renderHook(() => useMedicationForm());
    const { dispatch } = result.current;

    act(() => {
      dispatch({
        type: 'TOGGLE_UNLISTED_MED_OPEN',
      });
    });
    expect(result.current.formState.unlistedMedOpen).toEqual(true);
  });
});
