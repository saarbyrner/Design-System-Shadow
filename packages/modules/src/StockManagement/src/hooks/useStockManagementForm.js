// @flow
import { useReducer } from 'react';
import type { DrugType } from '@kitman/modules/src/Medical/shared/types/medical';

type Dispatch<T> = (action: T) => any;

export type FormState = {
  drug: {
    label: string,
    value: string,
    id: ?number,
    drug_type: ?(DrugType | 'FdbDispensableDrug'),
  },
  lotNumber: string,
  expirationDate: string,
  removalReason: string,
  quantity: ?number,
  noteContent?: string,
};

export type FormAction =
  | {
      type: 'SET_DRUG',
      drug: {
        label: string,
        value: string,
        id: ?number,
        drug_type: ?(DrugType | 'FdbDispensableDrug'),
      },
    }
  | { type: 'SET_LOT_NUMBER', lotNumber: string }
  | { type: 'SET_EXPIRATION_DATE', expirationDate: string }
  | {
      type: 'SET_STOCK_REMOVAL_REASON',
      removalReason: string,
    }
  | { type: 'SET_QUANTITY', quantity: ?number }
  | { type: 'SET_NOTE_CONTENT', noteContent: string }
  | { type: 'CLEAR_FORM' };

export const initialFormState = {
  drug: {
    value: '',
    label: '',
    id: null,
    drug_type: null,
  },
  lotNumber: '',
  expirationDate: '',
  removalReason: '',
  quantity: null,
  noteContent: '',
};

const formReducer = (
  state: FormState = initialFormState,
  action: FormAction
) => {
  switch (action.type) {
    case 'SET_DRUG':
      return {
        ...state,
        drug: action.drug,
      };

    case 'SET_LOT_NUMBER':
      return {
        ...state,
        lotNumber: action.lotNumber,
      };

    case 'SET_EXPIRATION_DATE':
      return {
        ...state,
        expirationDate: action.expirationDate,
      };

    case 'SET_QUANTITY': {
      return {
        ...state,
        quantity: action.quantity,
      };
    }

    case 'SET_STOCK_REMOVAL_REASON': {
      return {
        ...state,
        removalReason: action.removalReason,
      };
    }

    case 'SET_NOTE_CONTENT': {
      return {
        ...state,
        noteContent: action.noteContent,
      };
    }

    case 'CLEAR_FORM':
      return {
        ...initialFormState,
      };

    default:
      return state;
  }
};

const useStockManagementForm = () => {
  const [formState, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(
    formReducer,
    initialFormState
  );

  return {
    formState,
    dispatch,
  };
};

export default useStockManagementForm;
