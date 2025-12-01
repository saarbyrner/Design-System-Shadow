/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
export default function (state = {}, action) {
  switch (action.type) {
    case 'OPEN_HEADER_WIDGET_MODAL': {
      return {
        ...state,
        open: true,
        name: action.payload.name,
        population: action.payload.population,
        color: action.payload.backgroundColor,
        showOrgLogo: action.payload.showOrganisationLogo,
        showOrgName: action.payload.showOrganisationName,
        hideOrgDetails: action.payload.hideOrganisationDetails,
        widgetId: action.payload.widgetId,
      };
    }
    case 'CLOSE_HEADER_WIDGET_MODAL': {
      return {
        ...state,
        open: false,
      };
    }
    case 'SET_HEADER_WIDGET_NAME': {
      return {
        ...state,
        name: action.payload.name,
      };
    }
    case 'SET_HEADER_WIDGET_POPULATION': {
      return {
        ...state,
        population: action.payload.population,
      };
    }
    case 'SET_HEADER_WIDGET_BACKGROUND_COLOR': {
      return {
        ...state,
        color: action.payload.color,
      };
    }
    case 'SET_SHOW_ORGANISATION_LOGO': {
      return {
        ...state,
        showOrgLogo: action.payload.showOrganisationLogo,
      };
    }
    case 'SET_SHOW_ORGANISATION_NAME': {
      return {
        ...state,
        showOrgName: action.payload.showOrganisationName,
        hideOrgDetails: false,
      };
    }
    case 'SET_HIDE_ORGANISATION_DETAILS': {
      return {
        ...state,
        hideOrgDetails: action.payload.hideOrganisationDetails,
        showOrgName: false,
      };
    }
    case 'SAVE_HEADER_WIDGET_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'SAVE_HEADER_WIDGET_SUCCESS': {
      return {
        ...state,
        open: false,
        status: null,
      };
    }
    case 'SAVE_HEADER_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'EDIT_HEADER_WIDGET_SUCCESS': {
      return {
        ...state,
        open: false,
        status: null,
      };
    }
    case 'EDIT_HEADER_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    default:
      return state;
  }
}
