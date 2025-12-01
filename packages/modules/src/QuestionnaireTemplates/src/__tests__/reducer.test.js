import {
  templates,
  modals,
  appStatus,
  reminderSidePanel,
  dialogues,
  filters,
  sorting,
} from '../reducer';
import { buildTemplates, buildTemplate } from './test_utils';

describe('For templates state', () => {
  it('returns the correct state on ACTIVATE_TEMPLATE', () => {
    const initialState = {
      12: { active: true },
      88: { active: false },
      8: { active: false },
    };
    const action = {
      type: 'ACTIVATE_TEMPLATE',
      payload: { templateId: 8 },
    };

    const nextState = templates(initialState, action);
    expect(nextState).toEqual({
      12: { active: false },
      88: { active: false },
      8: { active: true },
    });
  });

  describe('when athlete-forms-list is enabled', () => {
    beforeEach(() => {
      window.featureFlags['athlete-forms-list'] = true;
    });

    afterEach(() => {
      window.featureFlags['athlete-forms-list'] = false;
    });

    it('returns the correct state on ACTIVATE_TEMPLATE', () => {
      const initialState = {
        12: { active: true },
        88: { active: false },
        8: { active: false },
      };
      const action = {
        type: 'ACTIVATE_TEMPLATE',
        payload: { templateId: 8 },
      };

      const nextState = templates(initialState, action);
      expect(nextState).toEqual({
        12: { active: true },
        88: { active: false },
        8: { active: true },
      });
    });

    it('returns the correct state on DEACTIVATE_TEMPLATE', () => {
      const initialState = {
        12: { active: true },
        88: { active: true },
        8: { active: true },
      };
      const action = {
        type: 'DEACTIVATE_TEMPLATE',
        payload: { templateId: 8 },
      };

      const nextState = templates(initialState, action);
      expect(nextState).toEqual({
        12: { active: true },
        88: { active: true },
        8: { active: false },
      });
    });
  });

  it('returns the correct state on DELETE_TEMPLATE', () => {
    const initialState = buildTemplates(4);
    const templateIds = Object.keys(initialState);
    const templateIdToDelete = templateIds[1];
    const action = {
      type: 'DELETE_TEMPLATE',
      payload: { templateId: templateIdToDelete },
    };

    const nextState = templates(initialState, action);
    const expectedState = { ...initialState };
    delete expectedState[templateIdToDelete];

    expect(nextState).toEqual(expectedState);
    expect(nextState[templateIdToDelete]).toBeUndefined();
  });

  it('returns the correct state on UPDATE_TEMPLATE', () => {
    const initialState = buildTemplates(2);
    const templateData = { ...initialState['1'], name: 'New Name' };
    const action = {
      type: 'UPDATE_TEMPLATE',
      payload: { templateId: '1', templateData },
    };
    const nextState = templates(initialState, action);
    expect(nextState['1']).toEqual(templateData);
    expect(nextState['2']).toEqual(initialState['2']); // Ensure other templates are untouched
  });

  it('returns the correct state on SET_SCHEDULE', () => {
    const initialState = buildTemplates(1);

    const templateId = Object.keys(initialState)[0];

    const schedulePayload = {
      templateId,
      time: '10:00:00',
      timezone: 'Europe/London',
      days: { monday: true },
    };
    const action = { type: 'SET_SCHEDULE', payload: schedulePayload };
    const nextState = templates(initialState, action);

    expect(nextState[templateId].scheduled_time).toBe(schedulePayload.time);
    expect(nextState[templateId].local_timezone).toBe(schedulePayload.timezone);
    expect(nextState[templateId].scheduled_days).toEqual(schedulePayload.days);
  });
});

describe('For modals state', () => {
  const initialState = {
    addTemplateVisible: false,
    renameTemplateVisible: false,
    duplicateTemplateVisible: false,
  };

  it('returns the correct state on SHOW_ADD_MODAL', () => {
    const action = { type: 'SHOW_ADD_MODAL' };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: true,
      renameTemplateVisible: false,
      duplicateTemplateVisible: false,
    });
  });

  it('returns the correct state on SHOW_RENAME_MODAL', () => {
    const templateId = '1';
    const action = { type: 'SHOW_RENAME_MODAL', payload: { templateId } };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      renameTemplateVisible: true,
      duplicateTemplateVisible: false,
      templateId,
    });
  });

  it('returns the correct state on SHOW_DUPLICATE_MODAL', () => {
    const templateId = '1';
    const action = { type: 'SHOW_DUPLICATE_MODAL', payload: { templateId } };
    const nextState = modals(initialState, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      renameTemplateVisible: false,
      duplicateTemplateVisible: true,
      templateId,
    });
  });

  it('returns the correct state on CLOSE_MODAL', () => {
    const stateWithModalOpen = {
      ...initialState,
      renameTemplateVisible: true,
      templateId: '1',
    };
    const action = { type: 'CLOSE_MODAL' };
    const nextState = modals(stateWithModalOpen, action);
    expect(nextState).toEqual({
      addTemplateVisible: false,
      renameTemplateVisible: false,
      duplicateTemplateVisible: false,
      templateId: '',
    });
  });
});

describe('For appStatus state', () => {
  const initialState = { status: null, message: null };

  it('returns the correct state on SAVING_REQUEST', () => {
    const action = { type: 'SAVING_REQUEST' };
    const nextState = appStatus(initialState, action);
    expect(nextState).toEqual({ status: 'loading', message: 'Saving...' });
  });

  it('returns the correct state on REQUEST_SUCCESS', () => {
    const stateBefore = { status: 'loading', message: 'Saving...' };
    const action = { type: 'REQUEST_SUCCESS' };
    const nextState = appStatus(stateBefore, action);
    expect(nextState).toEqual({ status: 'success', message: 'Success' });
  });

  it('returns the correct state on REQUEST_ERROR', () => {
    const stateBefore = { status: 'loading', message: 'Saving...' };
    const action = { type: 'REQUEST_ERROR' };
    const nextState = appStatus(stateBefore, action);
    expect(nextState).toEqual({
      status: 'error',
      message: 'Questionnaire saving failed',
    });
  });

  it('returns the correct state on HIDE_APP_STATUS', () => {
    const stateBefore = { status: 'success', message: 'Success' };
    const action = { type: 'HIDE_APP_STATUS' };
    const nextState = appStatus(stateBefore, action);
    expect(nextState).toEqual({ status: null, message: null });
  });
});

describe('For reminderSidePanel state', () => {
  const initialState = {
    templateId: null,
    isOpen: false,
    notifyAthletes: false,
    scheduledTime: null,
    localTimeZone: 'Europe/Dublin',
    scheduledDays: {},
  };

  it('returns the correct state on CLOSE_SIDE_PANEL', () => {
    const stateBefore = { ...initialState, isOpen: true };
    const action = { type: 'CLOSE_SIDE_PANEL' };
    const nextState = reminderSidePanel(stateBefore, action);
    expect(nextState).toEqual({ ...initialState, isOpen: false });
  });

  it('returns the correct state on OPEN_SIDE_PANEL', () => {
    const template = buildTemplate({
      id: 3,
      scheduled_time: '10:20:30',
      local_timezone: '',
      scheduled_days: { monday: true },
    });
    const action = {
      type: 'OPEN_SIDE_PANEL',
      payload: { template, orgTimeZone: 'Europe/Amsterdam' },
    };
    const nextState = reminderSidePanel(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      templateId: 3,
      notifyAthletes: true,
      scheduledTime: '10:20:30',
      scheduledDays: { monday: true },
      localTimeZone: 'Europe/Amsterdam',
    });
  });

  it('returns the correct state on UPDATE_LOCAL_TIMEZONE', () => {
    const action = {
      type: 'UPDATE_LOCAL_TIMEZONE',
      payload: { timezone: 'Europe/Amsterdam' },
    };
    const nextState = reminderSidePanel(initialState, action);
    expect(nextState.localTimeZone).toBe('Europe/Amsterdam');
  });

  it('returns the correct state on TOGGLE_NOTIFY_ATHLETES', () => {
    const action = { type: 'TOGGLE_NOTIFY_ATHLETES' };
    const nextState = reminderSidePanel(initialState, action);
    expect(nextState.notifyAthletes).toBe(true);
  });

  it('returns the correct state on UPDATE_SCHEDULE_TIME', () => {
    const action = {
      type: 'UPDATE_SCHEDULE_TIME',
      payload: { time: '10:20:30' },
    };
    const nextState = reminderSidePanel(initialState, action);
    expect(nextState.scheduledTime).toBe('10:20:30');
  });

  it('returns the correct state on TOGGLE_DAY', () => {
    const stateBefore = { ...initialState, scheduledDays: { monday: false } };
    const action = { type: 'TOGGLE_DAY', payload: { day: 'monday' } };
    const nextState = reminderSidePanel(stateBefore, action);
    expect(nextState.scheduledDays.monday).toBe(true);
  });
});

describe('For dialogues state', () => {
  const initialState = {
    delete: { isVisible: false, templateId: null },
    activate: { isVisible: false, templateId: null },
  };

  it('returns the correct state on SHOW_ACTIVATE_DIALOGUE', () => {
    const action = {
      type: 'SHOW_ACTIVATE_DIALOGUE',
      payload: { templateId: 5 },
    };
    const nextState = dialogues(initialState, action);
    expect(nextState.activate).toEqual({ isVisible: true, templateId: 5 });
  });

  it('returns the correct state on SHOW_DELETE_DIALOGUE', () => {
    const action = { type: 'SHOW_DELETE_DIALOGUE', payload: { templateId: 5 } };
    const nextState = dialogues(initialState, action);
    expect(nextState.delete).toEqual({ isVisible: true, templateId: 5 });
  });

  it('returns the correct state on HIDE_ACTIVATE_DIALOGUE', () => {
    const stateBefore = {
      ...initialState,
      activate: { isVisible: true, templateId: 5 },
    };
    const action = { type: 'HIDE_ACTIVATE_DIALOGUE' };
    const nextState = dialogues(stateBefore, action);
    expect(nextState.activate).toEqual({ isVisible: false, templateId: null });
  });

  it('returns the correct state on HIDE_DELETE_DIALOGUE', () => {
    const stateBefore = {
      ...initialState,
      delete: { isVisible: true, templateId: 5 },
    };
    const action = { type: 'HIDE_DELETE_DIALOGUE' };
    const nextState = dialogues(stateBefore, action);
    expect(nextState.delete).toEqual({ isVisible: false, templateId: null });
  });
});

describe('For filters state', () => {
  const defaultState = {
    searchText: '',
    searchStatus: '',
    searchScheduled: '',
  };

  it('returns correct state on SET_SEARCH_TEXT', () => {
    const action = { type: 'SET_SEARCH_TEXT', payload: 'abc123' };
    const nextState = filters(defaultState, action);
    expect(nextState.searchText).toBe('abc123');
  });

  it('returns correct state on SET_SEARCH_STATUS', () => {
    const action = { type: 'SET_SEARCH_STATUS', payload: 'active' };
    const nextState = filters(defaultState, action);
    expect(nextState.searchStatus).toBe('active');
  });

  it('returns correct state on SET_SEARCH_SCHEDULED', () => {
    const action = { type: 'SET_SEARCH_SCHEDULED', payload: 'scheduled' };
    const nextState = filters(defaultState, action);
    expect(nextState.searchScheduled).toBe('scheduled');
  });
});

describe('For sorting state', () => {
  const defaultState = {
    column: 'name',
    direction: 'asc',
  };

  it('returns correct state on SET_SORTING_PARAMS', () => {
    const action = {
      type: 'SET_SORTING_PARAMS',
      payload: { column: 'last_edited_at', direction: 'desc' },
    };
    const nextState = sorting(defaultState, action);
    expect(nextState).toEqual({
      column: 'last_edited_at',
      direction: 'desc',
    });
  });
});
