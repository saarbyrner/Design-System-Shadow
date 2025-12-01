import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';
import {
  fetchGraphColours,
  updatePrimaryWorkloadVariable,
  updateSecondaryWorkloadVariable,
  restoreDefaultWorkloadSettings,
  resetGraphColours,
  updateGraphColourPalette,
  updateRpeCollection,
  updateParticipationLevelName,
  updateIncludeInGroupCalculation,
  updateNameFormattings,
  openAddIntegrationModal,
  openUnlinkIntegrationModal,
  closeAddIntegrationModal,
  closeUnlinkIntegrationModal,
  fetchActiveIntegrationsSuccess,
  fetchActiveIntegrations,
  fetchAvailableIntegrationsSuccess,
  fetchAvailableIntegrations,
  unlinkIntegrationSuccess,
  unlinkIntegration,
  editingPrivacyPolicy,
  stagePrivacyPolicyText,
  closePrivacyPolicyModal,
  savePrivacyPolicyStarted,
  savePrivacyPolicySuccess,
  savePrivacyPolicyFailure,
  fetchPrivacyPolicySuccess,
  fetchPrivacyPolicyFailure,
  fetchPrivacyPolicy,
  savePrivacyPolicy,
  fetchPrivacyPolicyIsActive,
  fetchPrivacyPolicyIsActiveSuccess,
  savePrivacyPolicyIsActive,
  savePrivacyPolicyIsActiveSuccess,
  hideAppStatus,
} from '../actions';

describe('Organisation Settings Actions', () => {
  describe('Sync Action Creators', () => {
    it('creates the correct action for UPDATE_PRIMARY_WORKLOAD_VARIABLE', () => {
      const expectedAction = {
        type: 'UPDATE_PRIMARY_WORKLOAD_VARIABLE',
        payload: { variableId: 'catapult|total_distance' },
      };
      expect(updatePrimaryWorkloadVariable('catapult|total_distance')).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for UPDATE_SECONDARY_WORKLOAD_VARIABLE', () => {
      const expectedAction = {
        type: 'UPDATE_SECONDARY_WORKLOAD_VARIABLE',
        payload: { variableId: 'catapult|total_distance' },
      };
      expect(
        updateSecondaryWorkloadVariable('catapult|total_distance')
      ).toEqual(expectedAction);
    });

    it('creates the correct action for RESTORE_DEFAULT_WORKLOAD_SETTINGS', () => {
      const expectedAction = { type: 'RESTORE_DEFAULT_WORKLOAD_SETTINGS' };
      expect(restoreDefaultWorkloadSettings()).toEqual(expectedAction);
    });

    it('creates the correct action for UPDATE_RPE_COLLECTION', () => {
      const expectedAction = {
        type: 'UPDATE_RPE_COLLECTION',
        payload: { sessionType: 'GAME', channelType: 'KIOSK_APP', value: true },
      };
      expect(updateRpeCollection('GAME', 'KIOSK_APP', true)).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for UPDATE_PARTICIPATION_LEVEL_NAME', () => {
      const expectedAction = {
        type: 'UPDATE_PARTICIPATION_LEVEL_NAME',
        payload: {
          sessionType: 'GAME',
          participationLevelId: 2,
          value: 'new name',
        },
      };
      expect(updateParticipationLevelName('GAME', 2, 'new name')).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for UPDATE_INCLUDE_IN_GROUP_CALCULATION', () => {
      const expectedAction = {
        type: 'UPDATE_INCLUDE_IN_GROUP_CALCULATION',
        payload: { sessionType: 'GAME', participationLevelId: 2 },
      };
      expect(updateIncludeInGroupCalculation('GAME', 2)).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for OPEN_ADD_INTEGRATION_MODAL', () => {
      expect(openAddIntegrationModal()).toEqual({
        type: 'OPEN_ADD_INTEGRATION_MODAL',
      });
    });

    it('creates the correct action for OPEN_UNLINK_INTEGRATION_MODAL', () => {
      const expectedAction = {
        type: 'OPEN_UNLINK_INTEGRATION_MODAL',
        payload: { integrationId: 12, unlinkUrl: 'delete/fitbit' },
      };
      expect(openUnlinkIntegrationModal(12, 'delete/fitbit')).toEqual(
        expectedAction
      );
    });

    it('creates the correct action for CLOSE_ADD_INTEGRATION_MODAL', () => {
      expect(closeAddIntegrationModal()).toEqual({
        type: 'CLOSE_ADD_INTEGRATION_MODAL',
      });
    });

    it('creates the correct action for CLOSE_UNLINK_INTEGRATION_MODAL', () => {
      expect(closeUnlinkIntegrationModal()).toEqual({
        type: 'CLOSE_UNLINK_INTEGRATION_MODAL',
      });
    });

    it('has the correct action for EDITING_PRIVACY_POLICY', () => {
      const expectedAction = {
        type: 'EDITING_PRIVACY_POLICY',
        payload: { editing: true },
      };
      expect(editingPrivacyPolicy(true)).toEqual(expectedAction);
    });

    it('has the correct action for STAGE_PRIVACY_POLICY_TEXT', () => {
      const expectedAction = {
        type: 'STAGE_PRIVACY_POLICY_TEXT',
        payload: { text: 'test' },
      };
      expect(stagePrivacyPolicyText('test')).toEqual(expectedAction);
    });
  });

  describe('Async Thunks', () => {
    let dispatch;
    let getState;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe('fetchGraphColours', () => {
      it('dispatches SUCCESS with default colours when palette is null', async () => {
        const mockResponse = {
          colour_palette: {
            colours: null,
            default_colours: ['#FF0000', '#00FF00'],
          },
        };
        server.use(
          rest.get('/colour_palettes', (req, res, ctx) => {
            return res(ctx.json(mockResponse));
          })
        );

        await fetchGraphColours()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'FETCH_GRAPH_COLOURS_SUCCESS',
            payload: {
              colourPalette: mockResponse.colour_palette.default_colours,
            },
          });
        });
      });

      it('dispatches SUCCESS with saved colours when they exist', async () => {
        const mockResponse = {
          colour_palette: {
            colours: ['#111111'],
            default_colours: ['#FF0000', '#00FF00'],
          },
        };
        server.use(
          rest.get('/colour_palettes', (req, res, ctx) => {
            return res(ctx.json(mockResponse));
          })
        );

        await fetchGraphColours()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'FETCH_GRAPH_COLOURS_SUCCESS',
            payload: { colourPalette: mockResponse.colour_palette.colours },
          });
        });
      });

      it('dispatches FAILURE on API error', async () => {
        server.use(
          rest.get('/colour_palettes', (req, res, ctx) => res(ctx.status(500)))
        );
        await fetchGraphColours()(dispatch);
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'FETCH_GRAPH_COLOURS_FAILURE',
          });
        });
      });
    });

    describe('resetGraphColours', () => {
      it('dispatches SUCCESS on successful API call', async () => {
        const mockResponse = {
          colour_palette: { default_colours: ['#F39C11'] },
        };
        server.use(
          rest.delete('/colour_palettes', (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(mockResponse));
          })
        );

        await resetGraphColours()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'RESET_GRAPH_COLOURS_SUCCESS',
            payload: {
              colourPalette: mockResponse.colour_palette.default_colours,
            },
          });
        });
      });

      it('dispatches FAILURE on API error', async () => {
        server.use(
          rest.delete('/colour_palettes', (req, res, ctx) =>
            res(ctx.status(500))
          )
        );
        await resetGraphColours()(dispatch);
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'RESET_GRAPH_COLOURS_FAILURE',
          });
        });
      });
    });

    describe('updateGraphColourPalette', () => {
      it('dispatches SUCCESS on successful API call', async () => {
        const newPalette = ['#dedede'];
        const mockResponse = { colour_palette: { colours: newPalette } };
        server.use(
          rest.post('/colour_palettes', (req, res, ctx) =>
            res(ctx.json(mockResponse))
          )
        );

        await updateGraphColourPalette(newPalette)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS',
            payload: { colourPalette: newPalette },
          });
        });
      });
    });

    describe('updateNameFormattings', () => {
      it('dispatches SUCCESS on successful API call', async () => {
        const nameFormatting = { displayNameId: 2, shortenedNameId: 3 };
        server.use(
          rest.post('/name_formattings', (req, res, ctx) =>
            res(ctx.status(200))
          )
        );

        await updateNameFormattings(nameFormatting)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            type: 'UPDATE_NAME_FORMATTINGS_SUCCESS',
            payload: nameFormatting,
          });
        });
      });
    });

    describe('fetchActiveIntegrations', () => {
      it('dispatches SUCCESS with data on successful API call', async () => {
        const mockData = [{ name: 'fitbit' }];
        server.use(
          rest.get('/settings/integrations/integration_list', (req, res, ctx) =>
            res(ctx.json(mockData))
          )
        );

        await fetchActiveIntegrations()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            fetchActiveIntegrationsSuccess(mockData)
          );
        });
      });
    });

    describe('fetchAvailableIntegrations', () => {
      it('dispatches SUCCESS with data on successful API call', async () => {
        const mockData = [{ name: 'fitbit', url: 'login/fitbit' }];
        server.use(
          rest.get('/settings/integrations/vendor_list', (req, res, ctx) =>
            res(ctx.json(mockData))
          )
        );

        await fetchAvailableIntegrations()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            fetchAvailableIntegrationsSuccess(mockData)
          );
        });
      });
    });

    describe('unlinkIntegration', () => {
      it('dispatches the correct sequence on success', async () => {
        const state = {
          orgSettings: {
            integrations: {
              unlinkIntegrationModal: { id: 12, unlinkUrl: 'delete/test' },
            },
          },
        };
        getState.mockReturnValue(state);
        server.use(
          rest.delete('/settings/integrations/delete/test', (req, res, ctx) =>
            res(ctx.status(200))
          )
        );

        await unlinkIntegration()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(unlinkIntegrationSuccess(12));
          expect(dispatch).toHaveBeenCalledWith(closeUnlinkIntegrationModal());
        });
      });
    });

    describe('savePrivacyPolicy', () => {
      it('dispatches the correct sequence on success', async () => {
        const state = {
          orgSettings: {
            security: { privacyPolicy: { updatedText: '<p>test</p>' } },
          },
        };
        getState.mockReturnValue(state);
        server.use(
          rest.post('/privacy_policies', (req, res, ctx) =>
            res(ctx.status(200))
          )
        );

        savePrivacyPolicy()(dispatch, getState);

        // Initial sync dispatches
        expect(dispatch).toHaveBeenCalledWith(closePrivacyPolicyModal());
        expect(dispatch).toHaveBeenCalledWith(savePrivacyPolicyStarted());

        // Wait for async part to finish
        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(editingPrivacyPolicy(false));
          expect(dispatch).toHaveBeenCalledWith(
            savePrivacyPolicySuccess('<p>test</p>')
          );
        });

        // Fast-forward timers for the final action
        jest.runAllTimers();
        expect(dispatch).toHaveBeenCalledWith(hideAppStatus());
        expect(dispatch).toHaveBeenCalledTimes(5);
      });

      it('dispatches FAILURE action on failed API call', async () => {
        const state = {
          orgSettings: {
            security: { privacyPolicy: { updatedText: '<p>test</p>' } },
          },
        };
        getState.mockReturnValue(state);
        server.use(
          rest.post('/privacy_policies', (req, res, ctx) =>
            res(ctx.status(500))
          )
        );

        savePrivacyPolicy()(dispatch, getState);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(savePrivacyPolicyFailure());
        });
      });
    });

    describe('fetchPrivacyPolicy', () => {
      it('dispatches SUCCESS with the latest policy content', async () => {
        const mockPolicies = [
          { id: 1, content: '<p>Old policy</p>' },
          { id: 2, content: '<p>Newer test policy</p>' },
        ];
        server.use(
          rest.get('/privacy_policies', (req, res, ctx) =>
            res(ctx.json(mockPolicies))
          )
        );

        await fetchPrivacyPolicy()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            fetchPrivacyPolicySuccess({ content: '<p>Newer test policy</p>' })
          );
        });
      });

      it('dispatches FAILURE on API error', async () => {
        server.use(
          rest.get('/privacy_policies', (req, res, ctx) => res(ctx.status(500)))
        );

        await fetchPrivacyPolicy()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(fetchPrivacyPolicyFailure());
        });
      });
    });

    describe('savePrivacyPolicyIsActive', () => {
      it('dispatches SUCCESS on successful API call', async () => {
        server.use(
          rest.put(
            '/organisation_preferences/custom_privacy_policy',
            (req, res, ctx) => res(ctx.status(200))
          )
        );

        await savePrivacyPolicyIsActive(true)(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            savePrivacyPolicyIsActiveSuccess(true)
          );
        });
      });
    });

    describe('fetchPrivacyPolicyIsActive', () => {
      it('dispatches SUCCESS on successful API call', async () => {
        server.use(
          rest.get(
            '/organisation_preferences/custom_privacy_policy',
            (req, res, ctx) => res(ctx.json({ value: true }))
          )
        );

        await fetchPrivacyPolicyIsActive()(dispatch);

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith(
            fetchPrivacyPolicyIsActiveSuccess(true)
          );
        });
      });
    });
  });
});
