// @flow
import type { ModalStatus } from '@kitman/common/src/types';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import type { ActionState } from './components/privacyPolicySettings/index';
import type { TermsOfUseActionState } from './components/termsOfUsePolicySettings';

export type ParticipationLevel = {
  id: number,
  name: string,
  canonical_participation_level: 'full' | 'partial' | 'modified' | 'none',
  include_in_group_calculations: boolean,
  default: boolean,
};

export type updateParticipationLevelName = {
  type: 'UPDATE_PARTICIPATION_LEVEL_NAME',
  payload: {
    sessionType: 'GAME' | 'TRAINING_SESSION',
    participationLevelId: number,
    value: string,
  },
};

export type updateIncludeInGroupCalculation = {
  type: 'UPDATE_INCLUDE_IN_GROUP_CALCULATION',
  payload: {
    sessionType: 'GAME' | 'TRAINING_SESSION',
    participationLevelId: number,
  },
};

type NameFormattingsOption = {
  id: number,
  title: string,
};

export type NameFormattings = {
  display_name: {
    active: number,
    options: Array<NameFormattingsOption>,
  },
  shortened_name: {
    active: number,
    options: Array<NameFormattingsOption>,
  },
};

export type NameFormattingsIds = {
  displayNameId: number,
  shortenedNameId: number,
};

export type rpeCollection = {
  kioskApp: boolean,
  athleteApp: boolean,
};

export type ActiveIntegrationListItem = {
  id: number,
  name: string,
  expiry_date: string,
  unlink_url: string,
};

export type AvailableIntegrationListItem = {
  name: string,
  url: string,
};

export type IntegrationsTabState = {
  activeIntegrations: Array<ActiveIntegrationListItem>,
  availableIntegrations: Array<AvailableIntegrationListItem>,
  addIntegrationModal: {
    isOpen: boolean,
  },
  unlinkIntegrationModal: {
    isOpen: boolean,
    id: ?number,
    unlinkUrl: ?string,
  },
};

// Privacy Policy
export type SecurityState = {
  privacyPolicy: {
    actionState: ActionState,
    isActive: boolean,
    updatedText: ?string,
    currentText: ?string,
  },
  updatePrivacyPolicyModal: {
    isOpen: boolean,
  },
};

export type PrivacyPolicyData = {
  content: ?string,
};

// Terms of Use
export type TermsOfUseState = {
  termsOfUsePolicy: {
    actionState: TermsOfUseActionState,
    isActive: boolean,
    updatedText: ?string,
    currentText: ?string,
  },
  updateTermsOfUsePolicyModal: {
    isOpen: boolean,
  },
};

export type TermsOfUsePolicyData = {
  content: ?string,
};

export type OrgSettingsState = {
  groupedWorkloadOptions: Array<GroupedDropdownItem>,
  primaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  secondaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  gameRpeCollection: rpeCollection,
  trainingRpeCollection: rpeCollection,
  gameParticipationLevels: Array<ParticipationLevel>,
  trainingParticipationLevels: Array<ParticipationLevel>,
  nameFormattings: NameFormattings,
  integrations: IntegrationsTabState,
  security: SecurityState,
  legal: TermsOfUseState,
};

export type AppStatusState = {
  status: ?ModalStatus,
  message: ?string,
};

type updateRpeCollection = {
  type: 'UPDATE_RPE_COLLECTION',
  payload: {
    sessionType: 'GAME' | 'TRAINING_SESSION',
    channelType: 'ATHLETE_APP' | 'KIOSK_APP',
    value: boolean,
  },
};

type updatePrimaryWorkloadVariable = {
  type: 'UPDATE_PRIMARY_WORKLOAD_VARIABLE',
  payload: {
    variableId: $PropertyType<GroupedDropdownItem, 'id'>,
  },
};

type updateSecondaryWorkloadVariable = {
  type: 'UPDATE_SECONDARY_WORKLOAD_VARIABLE',
  payload: {
    variableId: $PropertyType<GroupedDropdownItem, 'id'>,
  },
};

type restoreDefaultWorkloadSettings = {
  type: 'RESTORE_DEFAULT_WORKLOAD_SETTINGS',
};

type serverRequestSaveWorkloadSettings = {
  type: 'SERVER_REQUEST_SAVE_WORKLOAD_SETTINGS',
};

type saveWorkloadSettingsSuccess = {
  type: 'SAVE_WORKLOAD_SETTINGS_SUCCESS',
};

type fetchGraphColoursSuccess = {
  type: 'FETCH_GRAPH_COLOURS_SUCCESS',
  payload: {
    colourPalette: Array<string>,
  },
};

type fetchGraphColoursFailure = {
  type: 'FETCH_GRAPH_COLOURS_FAILURE',
};

type resetGraphColoursSuccess = {
  type: 'RESET_GRAPH_COLOURS_SUCCESS',
  payload: {
    colourPalette: Array<string>,
  },
};

type resetGraphColoursFailure = {
  type: 'RESET_GRAPH_COLOURS_FAILURE',
};

type updateGraphColourPaletteSuccess = {
  type: 'UPDATE_GRAPH_COLOUR_PALETTE_SUCCESS',
  payload: {
    colourPalette: Array<string>,
  },
};

type updateGraphColourPaletteFailure = {
  type: 'UPDATE_GRAPH_COLOUR_PALETTE_FAILURE',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type updateNameFormattingsSuccess = {
  type: 'UPDATE_NAME_FORMATTINGS_SUCCESS',
  payload: {
    displayNameId: number,
    shortenedNameId: number,
  },
};

type updateNameFormattingsFailure = {
  type: 'UPDATE_NAME_FORMATTINGS_FAILURE',
};

type fetchActiveIntegrationsSuccess = {
  type: 'FETCH_ACTIVE_INTEGRATIONS_SUCCESS',
  payload: {
    activeIntegrations: Array<ActiveIntegrationListItem>,
  },
};

type fetchActiveIntegrationsFailure = {
  type: 'FETCH_ACTIVE_INTEGRATIONS_FAILURE',
};

type fetchAvailableIntegrationsSuccess = {
  type: 'FETCH_AVAILABLE_INTEGRATIONS_SUCCESS',
  payload: {
    availableIntegrations: Array<AvailableIntegrationListItem>,
  },
};

type fetchAvailableIntegrationsFailure = {
  type: 'FETCH_AVAILABLE_INTEGRATIONS_FAILURE',
};

type openAddIntegrationModal = {
  type: 'OPEN_ADD_INTEGRATION_MODAL',
};

type closeAddIntegrationModal = {
  type: 'CLOSE_ADD_INTEGRATION_MODAL',
};

type openUnlinkIntegrationModal = {
  type: 'OPEN_UNLINK_INTEGRATION_MODAL',
  payload: {
    integrationId: number,
    unlinkUrl: string,
  },
};

type closeUnlinkIntegrationModal = {
  type: 'CLOSE_UNLINK_INTEGRATION_MODAL',
};

type unlinkIntegrationSuccess = {
  type: 'UNLINK_INTEGRATION_SUCCESS',
  payload: {
    integrationId: number,
  },
};

type editingPrivacyPolicy = {
  type: 'EDITING_PRIVACY_POLICY',
  payload: {
    editing: boolean,
  },
};

type stagePrivacyPolicyText = {
  type: 'STAGE_PRIVACY_POLICY_TEXT',
  payload: {
    text: string,
  },
};

type openPrivacyPolicyModal = {
  type: 'OPEN_PRIVACY_POLICY_MODAL',
};

type closePrivacyPolicyModal = {
  type: 'CLOSE_PRIVACY_POLICY_MODAL',
};

type savePrivacyPolicyStarted = {
  type: 'SAVE_PRIVACY_POLICY_STARTED',
};

type savePrivacyPolicySuccess = {
  type: 'SAVE_PRIVACY_POLICY_SUCCESS',
  payload: {
    text: string,
  },
};

type savePrivacyPolicyFailure = {
  type: 'SAVE_PRIVACY_POLICY_FAILURE',
};

type fetchPrivacyPolicySuccess = {
  type: 'FETCH_PRIVACY_POLICY_SUCCESS',
  payload: {
    privacyPolicyData: PrivacyPolicyData,
  },
};

type fetchPrivacyPolicyFailure = {
  type: 'FETCH_PRIVACY_POLICY_FAILURE',
};

type fetchPrivacyPolicyIsActiveSuccess = {
  type: 'FETCH_PRIVACY_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive: boolean,
  },
};

type fetchPrivacyPolicyIsActiveFailure = {
  type: 'FETCH_PRIVACY_POLICY_IS_ACTIVE_FAILURE',
};

type savePrivacyPolicyIsActiveSuccess = {
  type: 'SAVE_PRIVACY_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive: boolean,
  },
};

type savePrivacyPolicyIsActiveFailure = {
  type: 'SAVE_PRIVACY_POLICY_IS_ACTIVE_FAILURE',
};

// Terms of Use
type editingTermsOfUsePolicy = {
  type: 'EDITING_TERMS_OF_USE_POLICY',
  payload: {
    editing: boolean,
  },
};

type stageTermsOfUsePolicyText = {
  type: 'STAGE_TERMS_OF_USE_POLICY_TEXT',
  payload: {
    text: string,
  },
};

type openTermsOfUsePolicyModal = {
  type: 'OPEN_TERMS_OF_USE_POLICY_MODAL',
};

type closeTermsOfUsePolicyModal = {
  type: 'CLOSE_TERMS_OF_USE_POLICY_MODAL',
};

type saveTermsOfUsePolicyStarted = {
  type: 'SAVE_TERMS_OF_USE_POLICY_STARTED',
};

type saveTermsOfUsePolicySuccess = {
  type: 'SAVE_TERMS_OF_USE_POLICY_SUCCESS',
  payload: {
    text: string,
  },
};

type saveTermsOfUsePolicyFailure = {
  type: 'SAVE_TERMS_OF_USE_POLICY_FAILURE',
};

type fetchTermsOfUsePolicySuccess = {
  type: 'FETCH_TERMS_OF_USE_POLICY_SUCCESS',
  payload: {
    termsOfUsePolicyData: TermsOfUsePolicyData,
  },
};

type fetchTermsOfUsePolicyFailure = {
  type: 'FETCH_TERMS_OF_USE_POLICY_FAILURE',
};

type fetchTermsOfUsePolicyIsActiveSuccess = {
  type: 'FETCH_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive: boolean,
  },
};

type fetchTermsOfUsePolicyIsActiveFailure = {
  type: 'FETCH_TERMS_OF_USE_POLICY_IS_ACTIVE_FAILURE',
};

type saveTermsOfUsePolicyIsActiveSuccess = {
  type: 'SAVE_TERMS_OF_USE_POLICY_IS_ACTIVE_SUCCESS',
  payload: {
    isActive: boolean,
  },
};

type saveTermsOfUsePolicyIsActiveFailure = {
  type: 'SAVE_TERMS_OF_USE_POLICY_IS_ACTIVE_FAILURE',
};

export type Action =
  | serverRequestSaveWorkloadSettings
  | saveWorkloadSettingsSuccess
  | fetchGraphColoursSuccess
  | fetchGraphColoursFailure
  | resetGraphColoursSuccess
  | resetGraphColoursFailure
  | updateGraphColourPaletteSuccess
  | updateGraphColourPaletteFailure
  | hideAppStatus
  | serverRequestError
  | updatePrimaryWorkloadVariable
  | updateSecondaryWorkloadVariable
  | restoreDefaultWorkloadSettings
  | updateRpeCollection
  | updateParticipationLevelName
  | updateIncludeInGroupCalculation
  | updateNameFormattingsSuccess
  | updateNameFormattingsFailure
  | fetchActiveIntegrationsSuccess
  | fetchActiveIntegrationsFailure
  | fetchAvailableIntegrationsSuccess
  | fetchAvailableIntegrationsFailure
  | openAddIntegrationModal
  | closeAddIntegrationModal
  | openUnlinkIntegrationModal
  | closeUnlinkIntegrationModal
  | unlinkIntegrationSuccess

  // Security ( Privacy policy )
  | openPrivacyPolicyModal
  | closePrivacyPolicyModal
  | editingPrivacyPolicy
  | stagePrivacyPolicyText
  | savePrivacyPolicyStarted
  | savePrivacyPolicySuccess
  | savePrivacyPolicyFailure
  | fetchPrivacyPolicySuccess
  | fetchPrivacyPolicyFailure
  | fetchPrivacyPolicyIsActiveSuccess
  | fetchPrivacyPolicyIsActiveFailure
  | savePrivacyPolicyIsActiveSuccess
  | savePrivacyPolicyIsActiveFailure

  // Legal ( Terms of Service policy )
  | openTermsOfUsePolicyModal
  | closeTermsOfUsePolicyModal
  | editingTermsOfUsePolicy
  | stageTermsOfUsePolicyText
  | saveTermsOfUsePolicyStarted
  | saveTermsOfUsePolicySuccess
  | saveTermsOfUsePolicyFailure
  | fetchTermsOfUsePolicySuccess
  | fetchTermsOfUsePolicyFailure
  | fetchTermsOfUsePolicyIsActiveSuccess
  | fetchTermsOfUsePolicyIsActiveFailure
  | saveTermsOfUsePolicyIsActiveSuccess
  | saveTermsOfUsePolicyIsActiveFailure;
