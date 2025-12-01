// @flow
import type { Store as IssuesPageStore } from '../../../issues/src/redux/types/store';
import type { Action } from '../types/actions';

const initialState = {
  isOpen: false,
  page: 1,
  showPrintPreview: {
    sidePanel: false,
    card: false,
  },
  initialInformation: {
    reporter: {
      label: null,
      value: null,
    },
    title: null,
    reporterPhoneNumber: null,
    issueDate: null,
  },
  employeeDrInformation: {
    city: null,
    dateHired: null,
    dateOfBirth: null,
    emergencyRoom: false,
    facilityCity: null,
    facilityName: null,
    facilityState: null,
    facilityStreet: null,
    facilityZip: null,
    fullName: null,
    hospitalized: false,
    physicianFullName: null,
    sex: 'M',
    state: null,
    street: null,
    zip: null,
  },
  caseInformation: {
    athleteActivity: null,
    caseNumber: null,
    dateInjured: null,
    dateOfDeath: null,
    issueDescription: null,
    noTimeEvent: false,
    objectSubstance: null,
    timeBeganWork: null,
    timeEvent: null,
    whatHappened: null,
  },
};

export default (
  state: $PropertyType<IssuesPageStore, 'addOshaFormSidePanel'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_OSHA_FORM_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_OSHA_FORM_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'INITALISE_OSHA_FORM_STATE': {
      return {
        ...initialState,
      };
    }
    case 'GO_TO_NEXT_OSHA_PANEL_PAGE': {
      return {
        ...state,
        page: state.page + 1,
      };
    }
    case 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE': {
      return {
        ...state,
        page: state.page - 1,
      };
    }
    case 'UPDATE_INITIAL_INFORMATION_FIELD': {
      return {
        ...state,
        initialInformation: {
          ...state.initialInformation,
          [action.fieldName]: action.value,
        },
      };
    }
    case 'UPDATE_OSHA_INITIAL_INFORMATION': {
      return {
        ...state,
        initialInformation: {
          ...state.initialInformation,
          ...action.initialInformationValues,
        },
      };
    }
    case 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION': {
      return {
        ...state,
        employeeDrInformation: {
          ...state.employeeDrInformation,
          ...action.employeeDrInformationValues,
        },
      };
    }
    case 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD': {
      return {
        ...state,
        employeeDrInformation: {
          ...state.employeeDrInformation,
          [action.fieldName]: action.value,
        },
      };
    }
    case 'UPDATE_OSHA_CASE_INFORMATION': {
      return {
        ...state,
        caseInformation: {
          ...state.caseInformation,
          ...action.caseInformationValues,
        },
      };
    }
    case 'UPDATE_CASE_INFORMATION_FIELD': {
      return {
        ...state,
        caseInformation: {
          ...state.caseInformation,
          [action.fieldName]: action.value,
        },
      };
    }
    case 'PRINT_OSHA_FORM_FROM_SIDE_PANEL': {
      return {
        ...state,
        showPrintPreview: {
          ...state.showPrintPreview,
          sidePanel: action.showPrintPreview,
        },
      };
    }
    case 'PRINT_OSHA_FORM_FROM_CARD': {
      return {
        ...state,
        showPrintPreview: {
          ...state.showPrintPreview,
          card: action.showPrintPreview,
        },
      };
    }

    default:
      return state;
  }
};
