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
  submitModal: {
    isOpen: false,
    formState: {},
  },
  claimInformation: {
    personName: null,
    contactNumber: null,
    policyNumber: null,
    lossDate: null,
    lossTime: null,
    lossCity: null,
    lossState: null,
    lossJurisdiction: null,
    lossDescription: null,
    side: null,
    sideName: null,
    bodyArea: null,
    bodyAreaName: null,
  },
  additionalInformation: {
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zipCode: null,
    phoneNumber: null,
  },
};

export default (
  state: $PropertyType<IssuesPageStore, 'addWorkersCompSidePanel'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_WORKERS_COMP_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_WORKERS_COMP_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'GO_TO_NEXT_PANEL_PAGE': {
      return {
        ...state,
        page: state.page + 1,
      };
    }
    case 'GO_TO_PREVIOUS_PANEL_PAGE': {
      return {
        ...state,
        page: state.page - 1,
      };
    }
    case 'UPDATE_CLAIM_INFORMATION_FIELD': {
      return {
        ...state,
        claimInformation: {
          ...state.claimInformation,
          [action.fieldName]: action.value,
        },
      };
    }
    case 'UPDATE_ADDITIONAL_INFORMATION_FIELD': {
      return {
        ...state,
        additionalInformation: {
          ...state.additionalInformation,
          [action.fieldName]: action.value,
        },
      };
    }
    case 'SHOW_WORKERS_COMP_SUBMIT_MODAL': {
      return {
        ...state,
        submitModal: {
          isOpen: true,
          formState: action.formState,
        },
      };
    }
    case 'CLOSE_WORKERS_COMP_SUBMIT_MODAL': {
      return {
        ...state,
        submitModal: {
          isOpen: false,
        },
      };
    }
    case 'INITALISE_WORKERS_COMP_FORM_STATE': {
      return {
        ...initialState,
      };
    }
    case 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION': {
      return {
        ...state,
        claimInformation: {
          ...action.claimInformationValues,
        },
      };
    }
    case 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION': {
      return {
        ...state,
        additionalInformation: {
          ...action.additionalInformationValues,
        },
      };
    }
    case 'OPEN_WORKERS_COMP_PRINT_FLOW': {
      return {
        ...state,
        isOpen: true,
        page: 3,
      };
    }
    case 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL': {
      return {
        ...state,
        showPrintPreview: {
          ...state.showPrintPreview,
          sidePanel: action.showPrintPreview,
        },
        claimInformation: {
          ...state.claimInformation,
          sideName: action.side,
          bodyAreaName: action.bodyArea,
        },
      };
    }
    case 'PRINT_WORKERS_COMP_FROM_CARD': {
      return {
        ...state,
        showPrintPreview: {
          ...state.showPrintPreview,
          card: action.showPrintPreview,
        },
        claimInformation: {
          ...state.claimInformation,
          sideName: action.side,
          bodyAreaName: action.bodyArea,
        },
      };
    }
    default:
      return state;
  }
};
