import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';
import { buildTemplate } from './test_utils';
import {
  renameTemplateRequest,
  activateTemplateRequest,
  deactivateTemplateRequest,
  deleteTemplate,
  updateTemplate,
  addTemplate,
  showRenameModal,
  showDuplicateModal,
  closeModal,
  savingRequest,
  requestSuccess,
  hideAppStatus,
  requestError,
  activateTemplate,
  deactivateTemplate,
  showActivateDialogue,
  showDeleteDialogue,
  hideActivateDialogue,
  hideDeleteDialogue,
  closeSidePanel,
  openSidePanel,
  toggleNotifyAthletes,
  updateScheduleTime,
  saveScheduleReminder,
  updateLocalTimeZone,
  setSearchText,
  setSearchStatus,
  setSearchScheduled,
  setTemplateSchedule,
} from '../actions';

describe('Questionnaire Template actions', () => {
  describe('Sync Action Creators', () => {
    it('creates the correct action for SHOW_ADD_MODAL', () => {
      expect(addTemplate()).toEqual({ type: 'SHOW_ADD_MODAL' });
    });

    it('creates the correct action for SHOW_RENAME_MODAL', () => {
      const templateId = '1';
      expect(showRenameModal(templateId)).toEqual({
        type: 'SHOW_RENAME_MODAL',
        payload: { templateId },
      });
    });

    it('creates the correct action for SHOW_DUPLICATE_MODAL', () => {
      const templateId = '1';
      expect(showDuplicateModal(templateId)).toEqual({
        type: 'SHOW_DUPLICATE_MODAL',
        payload: { templateId },
      });
    });

    it('creates the correct action for DELETE_TEMPLATE', () => {
      const templateId = '1';
      expect(deleteTemplate(templateId)).toEqual({
        type: 'DELETE_TEMPLATE',
        payload: { templateId },
      });
    });

    it('creates the correct action for CLOSE_MODAL', () => {
      expect(closeModal()).toEqual({ type: 'CLOSE_MODAL' });
    });

    it('creates the correct action for SAVING_REQUEST', () => {
      expect(savingRequest()).toEqual({ type: 'SAVING_REQUEST' });
    });

    it('creates the correct action for REQUEST_SUCCESS', () => {
      expect(requestSuccess()).toEqual({ type: 'REQUEST_SUCCESS' });
    });

    it('creates the correct action for HIDE_APP_STATUS', () => {
      expect(hideAppStatus()).toEqual({ type: 'HIDE_APP_STATUS' });
    });

    it('creates the correct action for UPDATE_TEMPLATE', () => {
      const templateId = '1';
      const templateData = buildTemplate({ id: templateId });
      expect(updateTemplate(templateId, templateData)).toEqual({
        type: 'UPDATE_TEMPLATE',
        payload: { templateId, templateData },
      });
    });

    it('creates the correct action for SHOW_ACTIVATE_DIALOGUE', () => {
      expect(showActivateDialogue('1')).toEqual({
        type: 'SHOW_ACTIVATE_DIALOGUE',
        payload: { templateId: '1' },
      });
    });

    it('creates the correct action for SHOW_DELETE_DIALOGUE', () => {
      expect(showDeleteDialogue('1')).toEqual({
        type: 'SHOW_DELETE_DIALOGUE',
        payload: { templateId: '1' },
      });
    });

    it('creates the correct action for HIDE_ACTIVATE_DIALOGUE', () => {
      expect(hideActivateDialogue()).toEqual({
        type: 'HIDE_ACTIVATE_DIALOGUE',
      });
    });

    it('creates the correct action for HIDE_DELETE_DIALOGUE', () => {
      expect(hideDeleteDialogue()).toEqual({ type: 'HIDE_DELETE_DIALOGUE' });
    });

    it('creates the correct action for CLOSE_SIDE_PANEL', () => {
      expect(closeSidePanel()).toEqual({ type: 'CLOSE_SIDE_PANEL' });
    });

    it('creates the correct action for OPEN_SIDE_PANEL', () => {
      const template = buildTemplate({});
      expect(openSidePanel(template, 'Europe/Dublin')).toEqual({
        type: 'OPEN_SIDE_PANEL',
        payload: { template, orgTimeZone: 'Europe/Dublin' },
      });
    });

    it('creates the correct action for TOGGLE_NOTIFY_ATHLETES', () => {
      expect(toggleNotifyAthletes()).toEqual({
        type: 'TOGGLE_NOTIFY_ATHLETES',
      });
    });

    it('creates the correct action for UPDATE_SCHEDULE_TIME', () => {
      expect(updateScheduleTime('10:20:30')).toEqual({
        type: 'UPDATE_SCHEDULE_TIME',
        payload: { time: '10:20:30' },
      });
    });

    it('creates the correct action for UPDATE_LOCAL_TIMEZONE', () => {
      expect(updateLocalTimeZone('Europe/Dublin')).toEqual({
        type: 'UPDATE_LOCAL_TIMEZONE',
        payload: { timezone: 'Europe/Dublin' },
      });
    });

    it('creates the correct action for SET_TEMPLATE_SCHEDULE', () => {
      const selectedDays = { monday: true, tuesday: false };
      expect(
        setTemplateSchedule('id', 'time', 'timezone', selectedDays)
      ).toEqual({
        type: 'SET_SCHEDULE',
        payload: {
          templateId: 'id',
          time: 'time',
          timezone: 'timezone',
          days: selectedDays,
        },
      });
    });

    it('creates the correct action for SET_SEARCH_TEXT', () => {
      expect(setSearchText('abc123')).toEqual({
        type: 'SET_SEARCH_TEXT',
        payload: 'abc123',
      });
    });

    it('creates the correct action for SET_SEARCH_STATUS', () => {
      expect(setSearchStatus('active')).toEqual({
        type: 'SET_SEARCH_STATUS',
        payload: 'active',
      });
    });

    it('creates the correct action for SET_SEARCH_SCHEDULED', () => {
      expect(setSearchScheduled('scheduled')).toEqual({
        type: 'SET_SEARCH_SCHEDULED',
        payload: 'scheduled',
      });
    });
  });

  describe('Async Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
      window.featureFlags = {};
    });

    describe('renameTemplateRequest', () => {
      it('dispatches success actions on successful request', async () => {
        const templateId = '1';
        const updatedTemplate = buildTemplate({ id: templateId });
        getState.mockReturnValue({ modals: { templateId } });

        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/rename`,
            (req, res, ctx) => {
              return res(
                ctx.status(200),
                ctx.json({ template: updatedTemplate })
              );
            }
          )
        );

        renameTemplateRequest('New name')(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            updateTemplate(templateId, updatedTemplate)
          );
        });
      });

      it('dispatches error action on failed request', async () => {
        const templateId = '1';

        getState.mockReturnValue({ modals: { templateId } });
        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/rename`,
            (req, res, ctx) => {
              return res(ctx.status(500));
            }
          )
        );

        renameTemplateRequest('New name')(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(requestError());
        });
      });
    });

    describe('activateTemplateRequest', () => {
      it('dispatches success actions on successful request', async () => {
        const templateId = '1';

        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/activate`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            }
          )
        );

        activateTemplateRequest(templateId)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(activateTemplate(templateId));
        });
      });

      it('dispatches error action on failed request', async () => {
        const templateId = '1';

        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/activate`,
            (req, res, ctx) => {
              return res(ctx.status(500));
            }
          )
        );

        activateTemplateRequest(templateId)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(requestError());
        });
      });
    });

    describe('deactivateTemplateRequest', () => {
      it('dispatches success actions on successful request', async () => {
        const templateId = '1';

        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/deactivate`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            }
          )
        );

        deactivateTemplateRequest(templateId)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(deactivateTemplate(templateId));
        });
      });

      it('dispatches error action on failed request', async () => {
        const templateId = '1';

        server.use(
          rest.patch(
            `/settings/questionnaire_templates/${templateId}/deactivate`,
            (req, res, ctx) => {
              return res(ctx.status(500));
            }
          )
        );

        deactivateTemplateRequest(templateId)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(requestError());
        });
      });
    });

    describe('saveScheduleReminder', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });
      afterEach(() => {
        jest.useRealTimers();
      });

      it('dispatches success actions and closes panel after timeout', async () => {
        window.featureFlags['repeat-reminders'] = true;

        const templateId = '1';
        const scheduledTime = '10:30:00';
        const localTimeZone = 'Europe/Dublin';
        const scheduledDays = { monday: true, tuesday: true };

        getState.mockReturnValue({
          reminderSidePanel: {
            templateId,
            scheduledTime,
            localTimeZone,
            scheduledDays,
            notifyAthletes: true,
          },
        });

        server.use(
          rest.put(
            `/settings/questionnaire_templates/${templateId}`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            }
          )
        );

        saveScheduleReminder()(dispatch, getState);

        // Wait for the initial sync dispatch
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });

        // Fast-forward timers to trigger the setTimeout in the .done() callback
        jest.runAllTimers();

        // Now check for the actions that were inside the timeout
        expect(dispatch).toHaveBeenCalledWith(
          setTemplateSchedule(
            templateId,
            scheduledTime,
            localTimeZone,
            scheduledDays
          )
        );
        expect(dispatch).toHaveBeenCalledWith(closeSidePanel());
        expect(dispatch).toHaveBeenCalledWith(hideAppStatus());

        // Verify the total number of calls
        expect(dispatch).toHaveBeenCalledTimes(4);
      });

      it('dispatches error action on failed request', async () => {
        const templateId = '1';

        getState.mockReturnValue({ reminderSidePanel: { templateId } });

        server.use(
          rest.put(
            `/settings/questionnaire_templates/${templateId}`,
            (req, res, ctx) => {
              return res(ctx.status(500));
            }
          )
        );

        saveScheduleReminder()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(requestError());
        });
      });

      it('dispatches with all days true when repeat-reminders FF is off', async () => {
        window.featureFlags['repeat-reminders'] = false;

        const templateId = '1';
        const scheduledTime = '10:30:00';
        const localTimeZone = 'Europe/Dublin';
        const allTrueDays = {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };

        getState.mockReturnValue({
          reminderSidePanel: {
            templateId,
            scheduledTime,
            localTimeZone,
            scheduledDays: { monday: false, tuesday: false }, // Ignored when FF is off
            notifyAthletes: true,
          },
        });

        server.use(
          rest.put(
            `/settings/questionnaire_templates/${templateId}`,
            (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({}));
            }
          )
        );

        saveScheduleReminder()(dispatch, getState);

        // Wait for the initial dispatch
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savingRequest());
        });

        // Run timers to execute the code inside setTimeout
        jest.runAllTimers();

        // Assert the final state
        expect(dispatch).toHaveBeenCalledWith(
          setTemplateSchedule(
            templateId,
            scheduledTime,
            localTimeZone,
            allTrueDays
          )
        );
      });
    });
  });
});
