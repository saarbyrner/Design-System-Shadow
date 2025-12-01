// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { OrgSettingsState, AppStatusState, Action } from './types';

export const orgSettings = (
  state: OrgSettingsState = {},
  action: Action
): OrgSettingsState => {
  switch (action.type) {
    case 'UPDATE_PRIMARY_WORKLOAD_VARIABLE':
      return {
        ...state,
        primaryWorkloadVariableId: action.payload.variableId,
      };
    case 'UPDATE_SECONDARY_WORKLOAD_VARIABLE':
      return {
        ...state,
        secondaryWorkloadVariableId: action.payload.variableId,
      };
    case 'RESTORE_DEFAULT_WORKLOAD_SETTINGS':
      return {
        ...state,
        primaryWorkloadVariableId: 'kitman|workload',
        secondaryWorkloadVariableId: '',
      };
    case 'FETCH_GRAPH_COLOURS_SUCCESS':
    case 'RESET_GRAPH_COLOURS_SUCCESS':
    case 'UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS':
      return {
        ...state,
        graphColourPalette: action.payload.colourPalette,
      };
    case 'UPDATE_RPE_COLLECTION': {
      if (action.payload.sessionType === 'GAME') {
        return {
          ...state,
          gameRpeCollection: {
            kioskApp:
              action.payload.channelType === 'KIOSK_APP'
                ? action.payload.value
                : state.gameRpeCollection.kioskApp,
            athleteApp:
              action.payload.channelType === 'ATHLETE_APP'
                ? action.payload.value
                : state.gameRpeCollection.athleteApp,
          },
        };
      }

      if (action.payload.sessionType === 'TRAINING_SESSION') {
        return {
          ...state,
          trainingRpeCollection: {
            kioskApp:
              action.payload.channelType === 'KIOSK_APP'
                ? action.payload.value
                : state.trainingRpeCollection.kioskApp,
            athleteApp:
              action.payload.channelType === 'ATHLETE_APP'
                ? action.payload.value
                : state.trainingRpeCollection.athleteApp,
          },
        };
      }

      return state;
    }
    case 'UPDATE_PARTICIPATION_LEVEL_NAME': {
      if (action.payload.sessionType === 'GAME') {
        return {
          ...state,
          gameParticipationLevels: state.gameParticipationLevels.map(
            (participationLevel) => {
              if (
                participationLevel.id === action.payload.participationLevelId
              ) {
                return {
                  ...participationLevel,
                  name: action.payload.value,
                };
              }

              return participationLevel;
            }
          ),
        };
      }

      if (action.payload.sessionType === 'TRAINING_SESSION') {
        return {
          ...state,
          trainingParticipationLevels: state.trainingParticipationLevels.map(
            (participationLevel) => {
              if (
                participationLevel.id === action.payload.participationLevelId
              ) {
                return {
                  ...participationLevel,
                  name: action.payload.value,
                };
              }

              return participationLevel;
            }
          ),
        };
      }

      return state;
    }
    case 'UPDATE_INCLUDE_IN_GROUP_CALCULATION': {
      if (action.payload.sessionType === 'GAME') {
        return {
          ...state,
          gameParticipationLevels: state.gameParticipationLevels.map(
            (participationLevel) => {
              if (
                participationLevel.id === action.payload.participationLevelId
              ) {
                return {
                  ...participationLevel,
                  include_in_group_calculations:
                    !participationLevel.include_in_group_calculations,
                };
              }

              return participationLevel;
            }
          ),
        };
      }

      if (action.payload.sessionType === 'TRAINING_SESSION') {
        return {
          ...state,
          trainingParticipationLevels: state.trainingParticipationLevels.map(
            (participationLevel) => {
              if (
                participationLevel.id === action.payload.participationLevelId
              ) {
                return {
                  ...participationLevel,
                  include_in_group_calculations:
                    !participationLevel.include_in_group_calculations,
                };
              }

              return participationLevel;
            }
          ),
        };
      }

      return state;
    }

    case 'UPDATE_NAME_FORMATTINGS_SUCCESS':
      return {
        ...state,
        nameFormattings: {
          display_name: {
            active: action.payload.displayNameId,
            options: [...state.nameFormattings.display_name.options],
          },
          shortened_name: {
            active: action.payload.shortenedNameId,
            options: [...state.nameFormattings.shortened_name.options],
          },
        },
      };

    case 'FETCH_ACTIVE_INTEGRATIONS_SUCCESS':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          activeIntegrations: action.payload.activeIntegrations,
        },
      };

    case 'FETCH_AVAILABLE_INTEGRATIONS_SUCCESS':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          availableIntegrations: action.payload.availableIntegrations,
        },
      };

    case 'OPEN_ADD_INTEGRATION_MODAL':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          addIntegrationModal: {
            ...state.integrations.addIntegrationModal,
            isOpen: true,
          },
        },
      };

    case 'OPEN_UNLINK_INTEGRATION_MODAL':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          unlinkIntegrationModal: {
            ...state.integrations.unlinkIntegrationModal,
            isOpen: true,
            id: action.payload.integrationId,
            unlinkUrl: action.payload.unlinkUrl,
          },
        },
      };

    case 'CLOSE_ADD_INTEGRATION_MODAL':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          addIntegrationModal: {
            ...state.integrations.addIntegrationModal,
            isOpen: false,
          },
        },
      };

    case 'CLOSE_UNLINK_INTEGRATION_MODAL':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          unlinkIntegrationModal: {
            ...state.integrations.unlinkIntegrationModal,
            isOpen: false,
            id: null,
            unlinkUrl: null,
          },
        },
      };

    case 'UNLINK_INTEGRATION_SUCCESS':
      return {
        ...state,
        integrations: {
          ...state.integrations,
          activeIntegrations: state.integrations.activeIntegrations.filter(
            (integration) => integration.id !== action.payload.integrationId
          ),
        },
      };

    // Security ( Privacy policy actions )
    case 'OPEN_PRIVACY_POLICY_MODAL':
      return {
        ...state,
        security: {
          ...state.security,
          updatePrivacyPolicyModal: {
            ...state.security.updatePrivacyPolicyModal,
            isOpen: true,
          },
        },
      };

    case 'CLOSE_PRIVACY_POLICY_MODAL':
      return {
        ...state,
        security: {
          ...state.security,
          updatePrivacyPolicyModal: {
            ...state.security.updatePrivacyPolicyModal,
            isOpen: false,
          },
        },
      };
    case 'STAGE_PRIVACY_POLICY_TEXT':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            updatedText: action.payload.text,
          },
        },
      };

    case 'EDITING_PRIVACY_POLICY':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            actionState: action.payload.editing ? 'EDITING' : 'LOADED',
          },
        },
      };

    case 'FETCH_PRIVACY_POLICY_SUCCESS':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            updatedText: null,
            currentText: action.payload.privacyPolicyData.content,
            actionState: 'LOADED',
          },
        },
      };

    case 'FETCH_PRIVACY_POLICY_IS_ACTIVE_SUCCESS':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            isActive: action.payload.isActive,
          },
        },
      };

    case 'SAVE_PRIVACY_POLICY_SUCCESS':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            updatedText: null,
            currentText: action.payload.text,
          },
        },
      };

    case 'SAVE_PRIVACY_POLICY_IS_ACTIVE_SUCCESS':
      return {
        ...state,
        security: {
          ...state.security,
          privacyPolicy: {
            ...state.security.privacyPolicy,
            isActive: action.payload.isActive,
          },
        },
      };

    // Legal ( Terms of Use actions )
    case 'OPEN_TERMS_OF_USE_POLICY_MODAL':
      return {
        ...state,
        legal: {
          ...state.legal,
          updateTermsOfUsePolicyModal: {
            ...state.legal.updateTermsOfUsePolicyModal,
            isOpen: true,
          },
        },
      };

    case 'CLOSE_TERMS_OF_USE_POLICY_MODAL':
      return {
        ...state,
        legal: {
          ...state.legal,
          updateTermsOfUsePolicyModal: {
            ...state.legal.updateTermsOfUsePolicyModal,
            isOpen: false,
          },
        },
      };
    case 'STAGE_TERMS_OF_USE_POLICY_TEXT':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            updatedText: action.payload.text,
          },
        },
      };

    case 'EDITING_TERMS_OF_USE_POLICY':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            actionState: action.payload.editing ? 'EDITING' : 'LOADED',
          },
        },
      };

    case 'FETCH_TERMS_OF_USE_POLICY_SUCCESS':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            updatedText: null,
            currentText: action.payload.termsOfUsePolicyData.content,
            actionState: 'LOADED',
          },
        },
      };

    case 'FETCH_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            isActive: action.payload.isActive,
          },
        },
      };

    case 'SAVE_TERMS_OF_USE_POLICY_SUCCESS':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            updatedText: null,
            currentText: action.payload.text,
          },
        },
      };

    case 'SAVE_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS':
      return {
        ...state,
        legal: {
          ...state.legal,
          termsOfUsePolicy: {
            ...state.legal.termsOfUsePolicy,
            isActive: action.payload.isActive,
          },
        },
      };

    default:
      return state;
  }
};

export const appStatus = (state: AppStatusState = {}, action: Action) => {
  switch (action.type) {
    case 'SERVER_REQUEST_SAVE_WORKLOAD_SETTINGS':
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
      };
    case 'SAVE_WORKLOAD_SETTINGS_SUCCESS': {
      return {
        status: 'success',
        message: i18n.t('Workload Settings successfully updated'),
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    case 'FETCH_ACTIVE_INTEGRATIONS_FAILURE':
      return {
        status: 'error',
        message: i18n.t('Could not retrieve active integrations'),
      };
    case 'FETCH_AVAILABLE_INTEGRATIONS_FAILURE':
      return {
        status: 'error',
        message: i18n.t('Could not retrieve available integrations'),
      };
    case 'FETCH_GRAPH_COLOURS_FAILURE':
      return {
        status: 'error',
        message: i18n.t('Could not retrieve graph colours'),
      };
    case 'UPDATE_GRAPH_COLOUR_PALETTE_FAILURE': {
      return {
        status: 'error',
        message: i18n.t('Colour was not saved correctly'),
      };
    }
    case 'RESET_GRAPH_COLOURS_FAILURE':
      return {
        status: 'error',
        message: i18n.t('Could not restore graph colours'),
      };
    case 'UPDATE_NAME_FORMATTINGS_FAILURE':
      return {
        status: 'error',
        message: i18n.t('Naming was not saved correctly'),
      };
    case 'SAVE_PRIVACY_POLICY_STARTED': {
      return {
        status: 'loading',
        message: i18n.t('Updating privacy policy ...'),
      };
    }
    case 'SAVE_PRIVACY_POLICY_SUCCESS': {
      return {
        status: 'success',
        message: i18n.t('Privacy policy updated'),
      };
    }
    case 'SAVE_PRIVACY_POLICY_FAILURE': {
      return {
        status: 'error',
        message: i18n.t('Could not update privacy policy'),
      };
    }
    case 'SAVE_TERMS_OF_USE_POLICY_STARTED': {
      return {
        status: 'loading',
        message: i18n.t('Updating Terms of Use policy ...'),
      };
    }
    case 'SAVE_TERMS_OF_USE_POLICY_SUCCESS': {
      return {
        status: 'success',
        message: i18n.t('Terms of Use policy updated'),
      };
    }
    case 'SAVE_TERMS_OF_USE_POLICY_FAILURE': {
      return {
        status: 'error',
        message: i18n.t('Could not update Terms of Use policy'),
      };
    }

    default:
      return state;
  }
};
