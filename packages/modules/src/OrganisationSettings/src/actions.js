// @flow
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import $ from 'jquery';
import type {
  Action,
  ActiveIntegrationListItem,
  AvailableIntegrationListItem,
  NameFormattingsIds,
  PrivacyPolicyData,
  TermsOfUsePolicyData,
} from './types';

export const updateRpeCollection = (
  sessionType: 'GAME' | 'TRAINING_SESSION',
  channelType: 'KIOSK_APP' | 'ATHLETE_APP',
  value: boolean
): Action => ({
  type: 'UPDATE_RPE_COLLECTION',
  payload: {
    sessionType,
    channelType,
    value,
  },
});

export const updateParticipationLevelName = (
  sessionType: 'GAME' | 'TRAINING_SESSION',
  participationLevelId: number,
  value: string
): Action => ({
  type: 'UPDATE_PARTICIPATION_LEVEL_NAME',
  payload: { sessionType, participationLevelId, value },
});

export const updateIncludeInGroupCalculation = (
  sessionType: 'GAME' | 'TRAINING_SESSION',
  participationLevelId: number
): Action => ({
  type: 'UPDATE_INCLUDE_IN_GROUP_CALCULATION',
  payload: { sessionType, participationLevelId },
});

export const updatePrimaryWorkloadVariable = (
  variableId: $PropertyType<GroupedDropdownItem, 'id'>
): Action => ({
  type: 'UPDATE_PRIMARY_WORKLOAD_VARIABLE',
  payload: {
    variableId,
  },
});

export const updateSecondaryWorkloadVariable = (
  variableId: $PropertyType<GroupedDropdownItem, 'id'>
): Action => ({
  type: 'UPDATE_SECONDARY_WORKLOAD_VARIABLE',
  payload: {
    variableId,
  },
});

export const serverRequestSaveWorkloadSettings = (): Action => ({
  type: 'SERVER_REQUEST_SAVE_WORKLOAD_SETTINGS',
});

export const restoreDefaultWorkloadSettings = (): Action => ({
  type: 'RESTORE_DEFAULT_WORKLOAD_SETTINGS',
});
export const saveWorkloadSettingsSuccess = (): Action => ({
  type: 'SAVE_WORKLOAD_SETTINGS_SUCCESS',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const saveWorkloadSettings =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(serverRequestSaveWorkloadSettings());
    $.ajax({
      url: `/settings/organisation`,
      contentType: 'application/json',
      method: 'PATCH',
      data: JSON.stringify({
        primary_workload: getState().orgSettings.primaryWorkloadVariableId,
        secondary_workload: getState().orgSettings.secondaryWorkloadVariableId,
        game_kiosk_rpe: getState().orgSettings.gameRpeCollection.kioskApp,
        game_athlete_rpe: getState().orgSettings.gameRpeCollection.athleteApp,
        ts_kiosk_rpe: getState().orgSettings.trainingRpeCollection.kioskApp,
        ts_athlete_rpe: getState().orgSettings.trainingRpeCollection.athleteApp,
        game_participation_levels:
          getState().orgSettings.gameParticipationLevels,
        training_participation_levels:
          getState().orgSettings.trainingParticipationLevels,
      }),
    })
      .done(() => {
        dispatch(saveWorkloadSettingsSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const fetchGraphColoursSuccess = (
  colourPalette: Array<string>
): Action => ({
  type: 'FETCH_GRAPH_COLOURS_SUCCESS',
  payload: { colourPalette },
});

export const fetchGraphColoursFailure = (): Action => ({
  type: 'FETCH_GRAPH_COLOURS_FAILURE',
});

export const fetchGraphColours = () => (dispatch: (action: Action) => void) => {
  $.ajax({
    url: '/colour_palettes',
    contentType: 'application/json',
    method: 'GET',
    data: {
      type: 'GraphSeries',
    },
  })
    .done((response) => {
      if (response && response.colour_palette) {
        let colourPalette = [];
        if (response.colour_palette.colours) {
          colourPalette = response.colour_palette.colours;
        } else {
          colourPalette = response.colour_palette.default_colours;
        }
        dispatch(fetchGraphColoursSuccess(colourPalette));
      }
    })
    .fail(() => {
      dispatch(fetchGraphColoursFailure());
    });
};

export const resetGraphColoursSuccess = (
  colourPalette: Array<string>
): Action => ({
  type: 'RESET_GRAPH_COLOURS_SUCCESS',
  payload: { colourPalette },
});

export const resetGraphColoursFailure = (): Action => ({
  type: 'RESET_GRAPH_COLOURS_FAILURE',
});

export const resetGraphColours = () => (dispatch: (action: Action) => void) => {
  $.ajax({
    url: '/colour_palettes',
    contentType: 'application/json',
    method: 'DELETE',
    data: JSON.stringify({
      type: 'GraphSeries',
    }),
  })
    .done((response) => {
      if (response && response.colour_palette) {
        dispatch(
          resetGraphColoursSuccess(response.colour_palette.default_colours)
        );
      }
    })
    .fail(() => {
      dispatch(resetGraphColoursFailure());
    });
};

export const updateGraphColourPaletteSuccess = (
  colourPalette: Array<string>
): Action => ({
  type: 'UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS',
  payload: { colourPalette },
});

export const updateGraphColourPaletteFailure = (): Action => ({
  type: 'UPDATE_GRAPH_COLOUR_PALETTE_FAILURE',
});

export const updateGraphColourPalette =
  (colourPalette: Array<string>) => (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/colour_palettes',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        type: 'GraphSeries',
        colours: colourPalette,
      }),
    })
      .done((response) => {
        if (response && response.colour_palette) {
          dispatch(
            updateGraphColourPaletteSuccess(response.colour_palette.colours)
          );
        }
      })
      .fail(() => {
        dispatch(updateGraphColourPaletteFailure());
      });
  };

// naming

export const updateNameFormattingSuccess = ({
  displayNameId,
  shortenedNameId,
}: NameFormattingsIds): Action => ({
  type: 'UPDATE_NAME_FORMATTINGS_SUCCESS',
  payload: { displayNameId, shortenedNameId },
});

export const updateNameFormattingsFailure = (): Action => ({
  type: 'UPDATE_NAME_FORMATTINGS_FAILURE',
});

export const updateNameFormattings =
  ({ displayNameId, shortenedNameId }: NameFormattingsIds) =>
  (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/name_formattings',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify({
        display_name: displayNameId,
        shortened_name: shortenedNameId,
      }),
    })
      .done(() => {
        dispatch(
          updateNameFormattingSuccess({
            displayNameId,
            shortenedNameId,
          })
        );
      })
      .fail(() => {
        dispatch(updateNameFormattingsFailure());
      });
  };

// integrations tab

export const openAddIntegrationModal = (): Action => ({
  type: 'OPEN_ADD_INTEGRATION_MODAL',
});

export const openUnlinkIntegrationModal = (
  integrationId: number,
  unlinkUrl: string
): Action => ({
  type: 'OPEN_UNLINK_INTEGRATION_MODAL',
  payload: {
    integrationId,
    unlinkUrl,
  },
});

export const closeAddIntegrationModal = (): Action => ({
  type: 'CLOSE_ADD_INTEGRATION_MODAL',
});

export const closeUnlinkIntegrationModal = (): Action => ({
  type: 'CLOSE_UNLINK_INTEGRATION_MODAL',
});

export const fetchActiveIntegrationsSuccess = (
  activeIntegrations: Array<ActiveIntegrationListItem>
): Action => ({
  type: 'FETCH_ACTIVE_INTEGRATIONS_SUCCESS',
  payload: { activeIntegrations },
});

export const fetchActiveIntegrationsFailure = (): Action => ({
  type: 'FETCH_ACTIVE_INTEGRATIONS_FAILURE',
});

export const fetchActiveIntegrations =
  () => (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/settings/integrations/integration_list',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(fetchActiveIntegrationsSuccess(response));
      })
      .fail(() => {
        dispatch(fetchActiveIntegrationsFailure());
      });
  };

export const fetchAvailableIntegrationsSuccess = (
  availableIntegrations: Array<AvailableIntegrationListItem>
): Action => ({
  type: 'FETCH_AVAILABLE_INTEGRATIONS_SUCCESS',
  payload: { availableIntegrations },
});

export const fetchAvailableIntegrationsFailure = (): Action => ({
  type: 'FETCH_AVAILABLE_INTEGRATIONS_FAILURE',
});

export const fetchAvailableIntegrations =
  () => (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/settings/integrations/vendor_list',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(fetchAvailableIntegrationsSuccess(response));
      })
      .fail(() => {
        dispatch(fetchAvailableIntegrationsFailure());
      });
  };

export const unlinkIntegrationSuccess = (integrationId: number): Action => ({
  type: 'UNLINK_INTEGRATION_SUCCESS',
  payload: { integrationId },
});

export const unlinkIntegration =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    const { id, unlinkUrl } =
      getState().orgSettings.integrations.unlinkIntegrationModal;

    $.ajax({
      url: `/settings/integrations/${unlinkUrl}`,
      contentType: 'application/json',
      method: 'DELETE',
    }).done(() => {
      dispatch(unlinkIntegrationSuccess(id));
      dispatch(closeUnlinkIntegrationModal());
    });
  };

export const openPrivacyPolicyModal = (): Action => ({
  type: 'OPEN_PRIVACY_POLICY_MODAL',
});

export const closePrivacyPolicyModal = (): Action => ({
  type: 'CLOSE_PRIVACY_POLICY_MODAL',
});

export const savePrivacyPolicyStarted = (): Action => ({
  type: 'SAVE_PRIVACY_POLICY_STARTED',
});

export const editingPrivacyPolicy = (editing: boolean): Action => ({
  type: 'EDITING_PRIVACY_POLICY',
  payload: {
    editing,
  },
});

export const savePrivacyPolicySuccess = (text: string): Action => ({
  type: 'SAVE_PRIVACY_POLICY_SUCCESS',
  payload: {
    text,
  },
});

// Make the policy text the user created ready to submit
export const stagePrivacyPolicyText = (text: string): Action => ({
  type: 'STAGE_PRIVACY_POLICY_TEXT',
  payload: {
    text,
  },
});

export const savePrivacyPolicyFailure = (): Action => ({
  type: 'SAVE_PRIVACY_POLICY_FAILURE',
});

export const fetchPrivacyPolicySuccess = (
  privacyPolicyData: PrivacyPolicyData
): Action => ({
  type: 'FETCH_PRIVACY_POLICY_SUCCESS',
  payload: {
    privacyPolicyData,
  },
});

export const fetchPrivacyPolicyFailure = (): Action => ({
  type: 'FETCH_PRIVACY_POLICY_FAILURE',
});

export const fetchPrivacyPolicyIsActiveSuccess = (
  isActive: boolean
): Action => ({
  type: 'FETCH_PRIVACY_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive,
  },
});

export const fetchPrivacyPolicyIsActiveFailure = (): Action => ({
  type: 'FETCH_PRIVACY_POLICY_IS_ACTIVE_FAILURE',
});

export const savePrivacyPolicyIsActiveSuccess = (
  isActive: boolean
): Action => ({
  type: 'SAVE_PRIVACY_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive,
  },
});

export const savePrivacyPolicyIsActiveFailure = (): Action => ({
  type: 'SAVE_PRIVACY_POLICY_IS_ACTIVE_FAILURE',
});

export const fetchPrivacyPolicy =
  () => (dispatch: (action: Action) => Action) => {
    $.ajax({
      url: '/privacy_policies',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((dataArray) => {
        if (dataArray.length === 0) {
          const latestPolicy: PrivacyPolicyData = { content: null };
          dispatch(fetchPrivacyPolicySuccess(latestPolicy));
        } else {
          const lastEntry = dataArray[dataArray.length - 1];
          const latestPolicy: PrivacyPolicyData = {
            content: lastEntry.content,
          };
          dispatch(fetchPrivacyPolicySuccess(latestPolicy));
        }
      })
      .fail(() => {
        dispatch(fetchPrivacyPolicyFailure());
      });
  };

export const savePrivacyPolicy =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(closePrivacyPolicyModal());
    dispatch(savePrivacyPolicyStarted());
    const text = getState().orgSettings.security.privacyPolicy.updatedText;
    const privacyPolicyData = { content: text };
    $.ajax({
      url: '/privacy_policies',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify(privacyPolicyData),
    })
      .done(() => {
        dispatch(editingPrivacyPolicy(false));
        dispatch(savePrivacyPolicySuccess(text));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(savePrivacyPolicyFailure());
      });
  };

export const fetchPrivacyPolicyIsActive =
  () => (dispatch: (action: Action) => Action) => {
    $.ajax({
      url: '/organisation_preferences/custom_privacy_policy',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(fetchPrivacyPolicyIsActiveSuccess(response.value === true));
      })
      .fail(() => {
        dispatch(fetchPrivacyPolicyIsActiveFailure());
      });
  };

export const savePrivacyPolicyIsActive =
  (active: boolean) => (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/organisation_preferences/custom_privacy_policy',
      contentType: 'application/json',
      method: 'PUT',
      data: JSON.stringify({ value: active }),
    })
      .done(() => {
        dispatch(savePrivacyPolicyIsActiveSuccess(active));
      })
      .fail(() => {
        dispatch(savePrivacyPolicyIsActiveFailure());
      });
  };

// Terms of Use
export const openTermsOfUsePolicyModal = (): Action => ({
  type: 'OPEN_TERMS_OF_USE_POLICY_MODAL',
});

export const closeTermsOfUsePolicyModal = (): Action => ({
  type: 'CLOSE_TERMS_OF_USE_POLICY_MODAL',
});

export const saveTermsOfUsePolicyStarted = (): Action => ({
  type: 'SAVE_TERMS_OF_USE_POLICY_STARTED',
});

export const editingTermsOfUsePolicy = (editing: boolean): Action => ({
  type: 'EDITING_TERMS_OF_USE_POLICY',
  payload: {
    editing,
  },
});

export const saveTermsOfUsePolicySuccess = (text: string): Action => ({
  type: 'SAVE_TERMS_OF_USE_POLICY_SUCCESS',
  payload: {
    text,
  },
});

// Make the policy text the user created ready to submit
export const stageTermsOfUsePolicyText = (text: string): Action => ({
  type: 'STAGE_TERMS_OF_USE_POLICY_TEXT',
  payload: {
    text,
  },
});

export const saveTermsOfUsePolicyFailure = (): Action => ({
  type: 'SAVE_TERMS_OF_USE_POLICY_FAILURE',
});

export const fetchTermsOfUsePolicySuccess = (
  termsOfUsePolicyData: TermsOfUsePolicyData
): Action => ({
  type: 'FETCH_TERMS_OF_USE_POLICY_SUCCESS',
  payload: {
    termsOfUsePolicyData,
  },
});

export const fetchTermsOfUsePolicyFailure = (): Action => ({
  type: 'FETCH_TERMS_OF_USE_POLICY_FAILURE',
});

export const fetchTermsOfUsePolicyIsActiveSuccess = (
  isActive: boolean
): Action => ({
  type: 'FETCH_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive,
  },
});

export const fetchTermsOfUsePolicyIsActiveFailure = (): Action => ({
  type: 'FETCH_TERMS_OF_USE_POLICY_IS_ACTIVE_FAILURE',
});

export const saveTermsOfUsePolicyIsActiveSuccess = (
  isActive: boolean
): Action => ({
  type: 'SAVE_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive,
  },
});

export const saveTermsOfUsePolicyIsActiveFailure = (): Action => ({
  type: 'SAVE_TERMS_OF_USE_POLICY_IS_ACTIVE_FAILURE',
});

export const fetchTermsOfUsePolicy =
  () => (dispatch: (action: Action) => Action) => {
    $.ajax({
      url: '/settings/organisation/terms_of_use_policies',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((dataArray) => {
        if (dataArray.length === 0) {
          const latestPolicy: TermsOfUsePolicyData = { content: null };
          dispatch(fetchTermsOfUsePolicySuccess(latestPolicy));
        } else {
          const lastEntry = dataArray[dataArray.length - 1];
          const latestPolicy: TermsOfUsePolicyData = {
            content: lastEntry.content,
          };
          dispatch(fetchTermsOfUsePolicySuccess(latestPolicy));
        }
      })
      .fail(() => {
        dispatch(fetchTermsOfUsePolicyFailure());
      });
  };

export const saveTermsOfUsePolicy =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    dispatch(closeTermsOfUsePolicyModal());
    dispatch(saveTermsOfUsePolicyStarted());
    const text = getState().orgSettings.legal.termsOfUsePolicy.updatedText;
    const termsOfUsePolicyData = { content: text };
    $.ajax({
      url: '/settings/organisation/terms_of_use_policies',
      contentType: 'application/json',
      method: 'POST',
      data: JSON.stringify(termsOfUsePolicyData),
    })
      .done(() => {
        dispatch(editingTermsOfUsePolicy(false));
        dispatch(saveTermsOfUsePolicySuccess(text));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(saveTermsOfUsePolicyFailure());
      });
  };

export const fetchTermsOfUsePolicyIsActive =
  () => (dispatch: (action: Action) => Action) => {
    $.ajax({
      url: '/organisation_preferences/use_custom_terms_of_use_policy',
      contentType: 'application/json',
      method: 'GET',
    })
      .done((response) => {
        dispatch(fetchTermsOfUsePolicyIsActiveSuccess(response.value === true));
      })
      .fail(() => {
        dispatch(fetchTermsOfUsePolicyIsActiveFailure());
      });
  };

export const saveTermsOfUsePolicyIsActive =
  (active: boolean) => (dispatch: (action: Action) => void) => {
    $.ajax({
      url: '/organisation_preferences/use_custom_terms_of_use_policy',
      contentType: 'application/json',
      method: 'PUT',
      data: JSON.stringify({ value: active }),
    })
      .done(() => {
        dispatch(saveTermsOfUsePolicyIsActiveSuccess(active));
      })
      .fail(() => {
        dispatch(saveTermsOfUsePolicyIsActiveFailure());
      });
  };
