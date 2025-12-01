import { connect } from 'react-redux';
import { getAreCoachingPrinciplesEnabled } from '@kitman/services';
import setCoachingPrinciplesEnabled from '@kitman/common/src/actions/coachingPrinciplesActions';
import { AppTranslated as AppComponent } from '../components/App';
import {
  fetchActiveIntegrations,
  fetchAvailableIntegrations,
  fetchGraphColours,
  openAddIntegrationModal,
  openUnlinkIntegrationModal,
  resetGraphColours,
  restoreDefaultWorkloadSettings,
  saveWorkloadSettings,
  updateGraphColourPalette,
  updateIncludeInGroupCalculation,
  updateNameFormattings,
  updateParticipationLevelName,
  updatePrimaryWorkloadVariable,
  updateRpeCollection,
  updateSecondaryWorkloadVariable,
  openPrivacyPolicyModal,
  stagePrivacyPolicyText,
  editingPrivacyPolicy,
  fetchPrivacyPolicy,
  fetchPrivacyPolicyIsActive,
  savePrivacyPolicyIsActive,
  openTermsOfUsePolicyModal,
  stageTermsOfUsePolicyText,
  editingTermsOfUsePolicy,
  fetchTermsOfUsePolicy,
  fetchTermsOfUsePolicyIsActive,
  saveTermsOfUsePolicyIsActive,
} from '../actions';

const mapStateToProps = (state) => ({
  activeIntegrations: state.orgSettings.integrations.activeIntegrations,
  graphColourPalette: state.orgSettings.graphColourPalette,
  groupedWorkloadOptions: state.orgSettings.groupedWorkloadOptions,
  primaryWorkloadVariableId: state.orgSettings.primaryWorkloadVariableId,
  secondaryWorkloadVariableId: state.orgSettings.secondaryWorkloadVariableId,
  gameRpeCollection: state.orgSettings.gameRpeCollection,
  trainingRpeCollection: state.orgSettings.trainingRpeCollection,
  gameParticipationLevels: state.orgSettings.gameParticipationLevels,
  trainingParticipationLevels: state.orgSettings.trainingParticipationLevels,
  nameFormattings: state.orgSettings.nameFormattings,

  // Privacy Policy
  privacyPolicyIsActive: state.orgSettings.security.privacyPolicy.isActive,
  privacyPolicyText: state.orgSettings.security.privacyPolicy.currentText,
  privacyPolicyActionState:
    state.orgSettings.security.privacyPolicy.actionState,

  // Terms of Use Policy
  termsOfUsePolicyIsActive: state.orgSettings.legal.termsOfUsePolicy.isActive,
  termsOfUsePolicyText: state.orgSettings.legal.termsOfUsePolicy.currentText,
  termsOfUsePolicyActionState:
    state.orgSettings.legal.termsOfUsePolicy.actionState,

  hasDevelopmentGoalsModule: state.orgSettings.hasDevelopmentGoalsModule,
  isPlanningAdmin: state.orgSettings.isPlanningAdmin,
  areCoachingPrinciplesEnabled: state.coachingPrinciples.isEnabled || false,
});

const mapDispatchToProps = (dispatch) => ({
  fetchActiveIntegrations: () => {
    dispatch(fetchActiveIntegrations());
  },
  fetchAvailableIntegrations: () => {
    dispatch(fetchAvailableIntegrations());
  },
  fetchGraphColours: () => {
    dispatch(fetchGraphColours());
  },
  resetGraphColours: () => {
    dispatch(resetGraphColours());
  },
  updateGraphColourPalette: (colourPalette) => {
    dispatch(updateGraphColourPalette(colourPalette));
  },
  updateRpeCollection: (sessionType, channelType, value) => {
    dispatch(updateRpeCollection(sessionType, channelType, value));
  },
  onClickAddIntegration: () => {
    dispatch(openAddIntegrationModal());
  },
  onClickUnlinkIntegration: (integrationId, unlinkUrl) => {
    dispatch(openUnlinkIntegrationModal(integrationId, unlinkUrl));
  },
  onParticipationLevelNameChange: (
    sessionType,
    participationLevelId,
    value
  ) => {
    dispatch(
      updateParticipationLevelName(sessionType, participationLevelId, value)
    );
  },
  onIncludeInGroupCalculationChange: (sessionType, participationLevelId) => {
    dispatch(
      updateIncludeInGroupCalculation(sessionType, participationLevelId)
    );
  },
  updatePrimaryWorkloadVariable: (variableId) => {
    dispatch(updatePrimaryWorkloadVariable(variableId));
  },
  updateSecondaryWorkloadVariable: (variableId) => {
    dispatch(updateSecondaryWorkloadVariable(variableId));
  },
  restoreDefaultWorkloadSettings: () => {
    dispatch(restoreDefaultWorkloadSettings());
    dispatch(saveWorkloadSettings());
  },
  saveWorkloadSettings: (type) => {
    dispatch(saveWorkloadSettings(type));
  },
  updateNameFormattings: (nameFormattingsIds) => {
    dispatch(updateNameFormattings(nameFormattingsIds));
  },

  // Privacy Policy
  onConfirmUpdatePrivacyPolicy: (text) => {
    dispatch(stagePrivacyPolicyText(text));
    dispatch(openPrivacyPolicyModal());
  },
  onEditingPolicy: (areEditing) => {
    dispatch(editingPrivacyPolicy(areEditing));
  },
  fetchPrivacyPolicy: () => {
    dispatch(fetchPrivacyPolicy());
  },
  fetchPrivacyPolicyIsActive: () => {
    dispatch(fetchPrivacyPolicyIsActive());
  },
  savePrivacyPolicyIsActive: (active) => {
    dispatch(savePrivacyPolicyIsActive(active));
  },

  // Terms of Use Policy
  onConfirmUpdateTermsOfUsePolicy: (text) => {
    dispatch(stageTermsOfUsePolicyText(text));
    dispatch(openTermsOfUsePolicyModal());
  },
  onEditingTermsOfUsePolicy: (areEditing) => {
    dispatch(editingTermsOfUsePolicy(areEditing));
  },
  fetchTermsOfUsePolicy: () => {
    dispatch(fetchTermsOfUsePolicy());
  },
  fetchTermsOfUsePolicyIsActive: () => {
    dispatch(fetchTermsOfUsePolicyIsActive());
  },
  saveTermsOfUsePolicyIsActive: (active) => {
    dispatch(saveTermsOfUsePolicyIsActive(active));
  },

  fetchCoachingPrinciplesEnabled: () => {
    getAreCoachingPrinciplesEnabled().then((res) =>
      dispatch(setCoachingPrinciplesEnabled(res.value || false))
    );
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
