// @flow
import { useReducer } from 'react';
import moment from 'moment';
import type {
  Drug,
  DrugType,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { CustomDrugFormData } from '@kitman/modules/src/Medical/shared/types/medical/Medications';

export type Lot = {
  id: ?number,
  dispensed_quantity: ?number,
};

export type FetchedLot = {
  id: ?number,
  dispensed_quantity: ?number,
  drug: Drug,
  drug_type: ?string,
  expiration_date: ?string,
  lot_number: ?string,
  quantity: number,
};

export type Issue = {
  type: ?string,
  id: ?number,
};

export type Medication = {
  label: string,
  value?: any,
  stockId?: string | null,
  dispensable_drug_id?: ?string,
  localDrugId?: number,
  drug_type?: ?('FdbDispensableDrug' | DrugType),
};

export type FormState = {
  athlete_id: ?number,
  prescriber: {
    id: string,
    name: string,
  },
  external_prescriber_name: string,
  prescription_date: string,
  illness_occurrence_ids: number[],
  injury_occurrence_ids: number[],
  chronic_issue_ids: number[],
  medication: Medication,
  stock_lots: Array<Lot>,
  optional_lot_number: string,
  directions: ?string, // not required if tapered == true
  tapered: boolean,
  dose: ?string, // not required if tapered == true
  quantity: string,
  frequency: ?string, // not required if tapered == true
  route: string,
  start_date: string,
  end_date: string,
  duration: string,
  note: string,
  unlistedMedOpen: boolean,
  medicationTUEOpen: boolean,
  unlistedMed: CustomDrugFormData,
};

export type FormAction =
  | { type: 'SET_ATHLETE_ID', athleteId: ?number }
  | { type: 'SET_PRESCRIBER', prescriber: Object }
  | { type: 'SET_EXTERNAL_PRESCRIBER_NAME', external_prescriber_name: string }
  | { type: 'SET_PRESCRIPTION_DATE', prescription_date: string }
  | { type: 'SET_ILLNESS_IDS', illnessIds: number[] }
  | { type: 'SET_INJURY_IDS', injuryIds: number[] }
  | { type: 'SET_CHRONIC_IDS', chronicIds: number[] }
  | { type: 'SET_MEDICATION', medication: Medication }
  | { type: 'SET_STOCK_LOTS', stock_lots: Array<Lot> }
  | {
      type: 'SET_OPTIONAL_LOT_NUMBER',
      optional_lot_number: string,
    }
  | { type: 'TOGGLE_TAPERED' }
  | { type: 'SET_DIRECTIONS', directions: string }
  | { type: 'SET_DOSE', dose: string }
  | { type: 'SET_QUANTITY', quantity: string }
  | {
      type: 'SET_STOCK_LOTS_AND_QUANTITY',
      stock_lots: Array<Lot>,
    }
  | { type: 'SET_FREQUENCY', frequency: string }
  | { type: 'SET_ROUTE', route: string }
  | { type: 'SET_START_DATE', start_date: string }
  | { type: 'SET_END_DATE', end_date: string }
  | { type: 'SET_DURATION', duration: string }
  | { type: 'SET_NOTE', note: string }
  | {
      type: 'AUTOPOPULATE_SELECTED_MED',
      frequency: ?string,
      route: string,
      prescriber: Object,
      external_prescriber_name: string,
      medication: Medication,
      prescription_date: string,
      directions: ?string,
      tapered: boolean,
      dose: ?string,
      quantity: string,
      lot_number: string,
      start_date: string,
      end_date: string,
      note: string,
    }
  | {
      type: 'AUTOFILL_FROM_FAVORITE',
      directions: ?string,
      tapered: boolean,
      dose: ?string,
      frequency: ?string,
      route: string,
      duration: string,
      start_date: string,
      end_date: string,
    }
  | { type: 'SET_UNLISTED_MED_NAME', name: string }
  | { type: 'SET_UNLISTED_MED_BRAND_NAME', brandName: ?string }
  | { type: 'SET_UNLISTED_MED_DRUG_FORM', drugForm: string }
  | { type: 'SET_UNLISTED_MED_STRENGTH', strength: string }
  | {
      type: 'SET_UNLISTED_MED_STRENGTH_UNIT',
      unit: string,
    }
  | {
      type: 'SET_UNLISTED_MED_OTHER_UNIT',
      unit: string,
    }
  | { type: 'SET_UNLISTED_MED_COUNTRY', country: ?string }
  | { type: 'TOGGLE_UNLISTED_MED_OPEN' }
  | { type: 'TOGGLE_MEDICATION_TUE_OPEN' }
  | { type: 'CLEAR_FORM' };

export type Dispatch<T> = (action: T) => any;

export const InitialFormState = {
  athlete_id: null,
  prescriber: {
    id: '',
    name: '',
  },
  external_prescriber_name: '',
  prescription_date: '',
  illness_occurrence_ids: [],
  injury_occurrence_ids: [],
  chronic_issue_ids: [],
  medication: {
    value: null,
    label: '',
    stockId: null,
  },
  stock_lots: [
    {
      id: null,
      dispensed_quantity: null,
    },
  ],
  optional_lot_number: '',
  directions: '',
  tapered: false,
  dose: '',
  quantity: '',
  frequency: '',
  route: '',
  start_date: '',
  end_date: '',
  duration: '',
  note: '',
  unlistedMedOpen: false,
  medicationTUEOpen: false,
  unlistedMed: {
    name: '',
    drug_form: '',
    med_strength: '',
    med_strength_unit: '',
  },
};

const formReducer = (
  state: FormState = InitialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_ATHLETE_ID':
      return {
        ...state,
        athlete_id: action.athleteId,
      };
    case 'SET_PRESCRIBER':
      return {
        ...state,
        prescriber: { id: action.prescriber.id, name: action.prescriber.name },
      };
    case 'SET_EXTERNAL_PRESCRIBER_NAME':
      return {
        ...state,
        external_prescriber_name: action.external_prescriber_name,
      };
    case 'SET_PRESCRIPTION_DATE':
      return {
        ...state,
        prescription_date: action.prescription_date,
      };
    case 'SET_ILLNESS_IDS':
      return {
        ...state,
        illness_occurrence_ids: action.illnessIds,
      };
    case 'SET_INJURY_IDS':
      return {
        ...state,
        injury_occurrence_ids: action.injuryIds,
      };
    case 'SET_CHRONIC_IDS':
      return {
        ...state,
        chronic_issue_ids: action.chronicIds,
      };
    case 'SET_MEDICATION':
      return {
        ...state,
        medication: action.medication,
      };
    case 'SET_STOCK_LOTS':
      return {
        ...state,
        stock_lots: action.stock_lots,
      };
    case 'SET_OPTIONAL_LOT_NUMBER':
      return {
        ...state,
        optional_lot_number: action.optional_lot_number,
      };
    case 'SET_DIRECTIONS':
      return {
        ...state,
        directions: action.directions,
      };
    case 'SET_DOSE':
      return {
        ...state,
        dose: action.dose,
      };
    case 'SET_QUANTITY':
      return {
        ...state,
        quantity: action.quantity,
      };
    case 'SET_STOCK_LOTS_AND_QUANTITY': {
      const calculatedQuantity = action.stock_lots
        ?.map((item) => {
          return item.dispensed_quantity;
        })
        ?.reduce((prev, next) => {
          const previous = Number(prev);
          const nextQuantity = Number(next);
          return previous + nextQuantity;
        }, 0);
      return {
        ...state,
        stock_lots: action.stock_lots,
        quantity: calculatedQuantity ? calculatedQuantity.toString() : '',
      };
    }
    case 'SET_FREQUENCY':
      return {
        ...state,
        frequency: action.frequency,
      };
    case 'SET_ROUTE':
      return {
        ...state,
        route: action.route,
      };
    case 'SET_START_DATE':
      return {
        ...state,
        start_date: action.start_date,
      };
    case 'SET_END_DATE':
      return {
        ...state,
        end_date: action.end_date,
      };
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.duration,
      };
    case 'SET_NOTE':
      return {
        ...state,
        note: action.note,
      };
    case 'TOGGLE_TAPERED': {
      const tapered = !state.tapered;
      return {
        ...state,
        tapered,
        directions: tapered ? null : state.directions,
        frequency: tapered ? null : state.frequency,
        dose: tapered ? null : state.dose,
      };
    }
    case 'AUTOPOPULATE_SELECTED_MED':
      return {
        ...state,
        frequency: action.frequency,
        route: action.route,
        prescriber: { id: action.prescriber.id, name: action.prescriber.name },
        external_prescriber_name: action.external_prescriber_name,
        medication: {
          value: action.medication.value,
          label: action.medication.label,
          stockId: action.medication.stockId,
          dispensable_drug_id: action.medication.dispensable_drug_id,
          drug_type: action.medication.drug_type,
        },
        prescription_date: action.prescription_date,
        directions: action.directions,
        tapered: action.tapered,
        dose: action.dose,
        quantity: action.quantity,
        optional_lot_number: action.lot_number,
        start_date: action.start_date,
        end_date: action.end_date,
        note: action.note,
      };
    case 'AUTOFILL_FROM_FAVORITE':
      return {
        ...state,
        tapered: action.tapered,
        frequency: action.frequency,
        route: action.route,
        directions: action.directions,
        dose: action.dose,
        duration: action.duration,
        start_date: state.prescription_date,
        end_date: moment(state.prescription_date).add(
          Number(action.duration) - 1,
          'days'
        ),
      };
    case 'SET_UNLISTED_MED_NAME':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          name: action.name,
        },
      };
    case 'SET_UNLISTED_MED_BRAND_NAME':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          brand_name: action.brandName,
        },
      };
    case 'SET_UNLISTED_MED_DRUG_FORM':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          drug_form: action.drugForm,
        },
      };
    case 'SET_UNLISTED_MED_STRENGTH':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          med_strength: action.strength,
        },
      };
    case 'SET_UNLISTED_MED_STRENGTH_UNIT':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          med_strength_unit: action.unit,
        },
      };
    case 'SET_UNLISTED_MED_OTHER_UNIT':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          med_strength_other_unit: action.unit,
        },
      };
    case 'SET_UNLISTED_MED_COUNTRY':
      return {
        ...state,
        unlistedMed: {
          ...state.unlistedMed,
          country: action.country,
        },
      };
    case 'TOGGLE_UNLISTED_MED_OPEN':
      return {
        ...state,
        unlistedMedOpen: !state.unlistedMedOpen,
      };
    case 'TOGGLE_MEDICATION_TUE_OPEN':
      return {
        ...state,
        medicationTUEOpen: !state.medicationTUEOpen,
      };
    case 'CLEAR_FORM':
      return InitialFormState;

    default:
      return state;
  }
};

const useMedicationForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    InitialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useMedicationForm;
