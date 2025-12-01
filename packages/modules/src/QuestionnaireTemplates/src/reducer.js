// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Action } from '../types/actions';
import type { State } from '../types/state';

const defaultState = {
  templates: {},
  modals: {
    addTemplateVisible: false,
    renameTemplateVisible: false,
    duplicateTemplateVisible: false,
    templateName: '',
  },
  appStatus: {
    status: null,
  },
  dialogues: {
    delete: {
      isVisible: false,
      templateId: null,
    },
    activate: {
      isVisible: false,
      templateId: null,
    },
  },
  reminderSidePanel: {
    templateId: '',
    isOpen: false,
    notifyAthletes: false,
    scheduledTime: null,
    localTimeZone: '',
    scheduledDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  },
  filters: {
    searchText: '',
    searchStatus: '',
    searchScheduled: '',
  },
  sorting: {
    column: 'name',
    direction: 'asc',
  },
};

export const templates = (
  state: $PropertyType<State, 'templates'> = defaultState.templates,
  action: Action
): $PropertyType<State, 'templates'> => {
  switch (action.type) {
    case 'DELETE_TEMPLATE': {
      const newState = Object.assign({}, state);
      delete newState[action.payload.templateId];
      return newState;
    }
    case 'UPDATE_TEMPLATE': {
      return Object.assign({}, state, {
        [action.payload.templateId.toString()]: action.payload.templateData,
      });
    }
    case 'ACTIVATE_TEMPLATE': {
      const newState = JSON.parse(JSON.stringify(state));

      if (!window.featureFlags['athlete-forms-list']) {
        // only one template can be active when athlete-forms-list is disabled
        Object.keys(newState).forEach((id) => {
          newState[id].active = false;
        });
      }

      newState[action.payload.templateId].active = true;
      return newState;
    }
    case 'DEACTIVATE_TEMPLATE': {
      const newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.templateId].active = false;
      return newState;
    }
    case 'SET_SCHEDULE': {
      const newState = JSON.parse(JSON.stringify(state));
      newState[action.payload.templateId].scheduled_time = action.payload.time;
      newState[action.payload.templateId].local_timezone =
        action.payload.timezone;
      newState[action.payload.templateId].scheduled_days = action.payload.days;
      return newState;
    }
    default:
      return state;
  }
};

export const modals = (
  state: $PropertyType<State, 'modals'> = defaultState.modals,
  action: Action
): $PropertyType<State, 'modals'> => {
  switch (action.type) {
    case 'SHOW_ADD_MODAL':
      return Object.assign({}, state, {
        addTemplateVisible: true,
      });
    case 'CLOSE_MODAL':
      return Object.assign({}, state, {
        addTemplateVisible: false,
        renameTemplateVisible: false,
        duplicateTemplateVisible: false,
        templateId: '',
      });
    case 'SHOW_RENAME_MODAL':
      return Object.assign({}, state, {
        renameTemplateVisible: true,
        templateId: action.payload.templateId,
      });
    case 'SHOW_DUPLICATE_MODAL':
      return Object.assign({}, state, {
        duplicateTemplateVisible: true,
        templateId: action.payload.templateId,
      });
    default:
      return state;
  }
};

export const appStatus = (
  state: $PropertyType<State, 'appStatus'> = defaultState.appStatus,
  action: Action
): $PropertyType<State, 'appStatus'> => {
  switch (action.type) {
    case 'SAVING_REQUEST': {
      return {
        status: 'loading',
        message: `${i18n.t('Saving')}...`,
      };
    }
    case 'REQUEST_SUCCESS': {
      return {
        status: 'success',
        message: i18n.t('Success'),
      };
    }
    case 'REQUEST_ERROR': {
      return {
        status: 'error',
        message: i18n.t('Questionnaire saving failed'),
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    default:
      return state;
  }
};

export const reminderSidePanel = (
  state: $PropertyType<
    State,
    'reminderSidePanel'
  > = defaultState.reminderSidePanel,
  action: Action
): $PropertyType<State, 'reminderSidePanel'> => {
  switch (action.type) {
    case 'CLOSE_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    case 'OPEN_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        templateId: action.payload.template.id,
        notifyAthletes: Boolean(action.payload.template.scheduled_time),
        scheduledTime: action.payload.template.scheduled_time,
        scheduledDays: action.payload.template.scheduled_days,
        localTimeZone:
          action.payload.template.local_timezone || action.payload.orgTimeZone,
      };
    }
    case 'TOGGLE_NOTIFY_ATHLETES': {
      return {
        ...state,
        notifyAthletes: !state.notifyAthletes,
      };
    }
    case 'UPDATE_SCHEDULE_TIME': {
      return {
        ...state,
        scheduledTime: action.payload.time,
      };
    }
    case 'UPDATE_LOCAL_TIMEZONE': {
      return {
        ...state,
        localTimeZone: action.payload.timezone,
      };
    }
    case 'TOGGLE_DAY': {
      const newDay = {};
      newDay[action.payload.day] = !state.scheduledDays[action.payload.day];
      const scheduledDays = Object.assign({}, state.scheduledDays, newDay);
      return Object.assign({}, state, { scheduledDays });
    }
    default:
      return state;
  }
};

export const dialogues = (
  state: $PropertyType<State, 'dialogues'> = defaultState.dialogues,
  action: Action
): $PropertyType<State, 'dialogues'> => {
  switch (action.type) {
    case 'SHOW_ACTIVATE_DIALOGUE': {
      return {
        ...state,
        activate: { isVisible: true, templateId: action.payload.templateId },
      };
    }
    case 'SHOW_DELETE_DIALOGUE': {
      return {
        ...state,
        delete: { isVisible: true, templateId: action.payload.templateId },
      };
    }
    case 'HIDE_ACTIVATE_DIALOGUE': {
      return {
        ...state,
        activate: { isVisible: false, templateId: null },
      };
    }
    case 'HIDE_DELETE_DIALOGUE': {
      return {
        ...state,
        delete: { isVisible: false, templateId: null },
      };
    }
    default:
      return state;
  }
};

export const filters = (
  state: $PropertyType<State, 'filters'> = defaultState.filters,
  action: Action
): $PropertyType<State, 'filters'> => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        searchText: action.payload,
      };
    case 'SET_SEARCH_STATUS':
      return {
        ...state,
        searchStatus: action.payload,
      };
    case 'SET_SEARCH_SCHEDULED':
      return {
        ...state,
        searchScheduled: action.payload,
      };
    default:
      return state;
  }
};

export const sorting = (
  state: $PropertyType<State, 'sorting'> = defaultState.sorting,
  action: Action
): $PropertyType<State, 'sorting'> => {
  switch (action.type) {
    case 'SET_SORTING_PARAMS':
      return {
        ...state,
        column: action.payload.column,
        direction: action.payload.direction,
      };
    default:
      return state;
  }
};
