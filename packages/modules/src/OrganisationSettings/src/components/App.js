// @flow
import { useState, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  Tab,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import Toasts from '@kitman/modules/src/Toasts';
import { colors } from '@kitman/common/src/variables';
import { getPermissions } from '@kitman/services';
import useLocationHash from '@kitman/common/src/hooks/useLocationHash';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ActiveIntegrationListItem,
  OrgSettingsState,
  ParticipationLevel,
  NameFormattings,
} from '../types';
import AppStatus from '../containers/AppStatus';
import { AppearanceSettingsTranslated as AppearanceSettings } from './appearanceSettings';
import { CalendarSettingsTranslated as CalendarSettings } from './CalendarSettings';
import { NotificationsTranslated as Notifications } from './Notifications';
import { LocationsTranslated as Locations } from './Locations';
import { IntegrationsSettingsTranslated as IntegrationsSettings } from './integrationsSettings';
import PlanningSettings from './planningSettings';
import { WorkloadSettingsTranslated as WorkloadSettings } from './workloadSettings';
import { TerminologySettingsTranslated as TerminologySettings } from './terminologySettings';
import AddIntegrationModal from '../containers/AddIntegrationModal';
import UnlinkIntegrationModal from '../containers/UnlinkIntegrationModal';

// Privacy Policy
import SecurityAndPrivacySettings from './securityAndPrivacySettings';
import UpdatePrivacyPolicyModal from '../containers/UpdatePrivacyPolicyModal';
import type { ActionState } from './privacyPolicySettings';

// Terms of Use Policy
import TermsOfUseSettings from './termsOfUseSettings';
import UpdateTermsOfUsePolicyModal from '../containers/UpdateTermsOfUsePolicyModal';
import type { TermsOfUseActionState } from './termsOfUsePolicySettings';

type Props = {
  activeIntegrations: Array<ActiveIntegrationListItem>,
  fetchActiveIntegrations: Function,
  fetchAvailableIntegrations: Function,
  fetchGraphColours: Function,
  graphColourPalette: Array<string>,
  groupedWorkloadOptions: Array<GroupedDropdownItem>,
  primaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  secondaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  gameRpeCollection: $PropertyType<OrgSettingsState, 'gameRpeCollection'>,
  trainingRpeCollection: $PropertyType<
    OrgSettingsState,
    'trainingRpeCollection'
  >,
  gameParticipationLevels: Array<ParticipationLevel>,
  trainingParticipationLevels: Array<ParticipationLevel>,
  nameFormattings: NameFormattings,
  resetGraphColours: Function,
  onClickAddIntegration: Function,
  onClickUnlinkIntegration: Function,
  onParticipationLevelNameChange: Function,
  onIncludeInGroupCalculationChange: Function,
  updateRpeCollection: Function,
  updateGraphColourPalette: Function,
  updatePrimaryWorkloadVariable: Function,
  updateSecondaryWorkloadVariable: Function,
  updateNameFormattings: Function,
  restoreDefaultWorkloadSettings: Function,
  saveWorkloadSettings: Function,
  hasDevelopmentGoalsModule: boolean,
  isPlanningAdmin: boolean,
  areCoachingPrinciplesEnabled: boolean,

  // Privacy policy props
  privacyPolicyText: ?string,
  privacyPolicyIsActive: ?boolean,
  fetchPrivacyPolicy: Function,
  fetchPrivacyPolicyIsActive: Function,
  onConfirmUpdatePrivacyPolicy: Function,
  privacyPolicyActionState: ActionState,
  onEditingPolicy: Function,
  savePrivacyPolicyIsActive: Function,

  // Terms of Use policy props
  termsOfUsePolicyText: ?string,
  termsOfUsePolicyIsActive: ?boolean,
  fetchTermsOfUsePolicy: Function,
  fetchTermsOfUsePolicyIsActive: Function,
  onConfirmUpdateTermsOfUsePolicy: Function,
  termsOfUsePolicyActionState: TermsOfUseActionState,
  onEditingTermsOfUsePolicy: Function,
  saveTermsOfUsePolicyIsActive: Function,

  fetchCoachingPrinciplesEnabled: Function,
};

type Status = 'LOADING' | 'LOADED' | 'ERROR';

const App = (props: I18nProps<Props>) => {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState<Status>('LOADING');
  const [value, setValue] = useState('Appearance');

  const hash = useLocationHash();
  const assign = useLocationAssign();

  const [hasPrivacyPolicyPermissions, setHasPrivacyPolicyPermissions] =
    useState(false);

  useEffect(() => {
    props.fetchCoachingPrinciplesEnabled();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const updateStatus = (statusValue: Status) => {
      if (isMounted) {
        setStatus(statusValue);
      }
    };

    getPermissions().then(
      (permissions) => {
        const hasOrgSettings = permissions.settings
          ? permissions.settings.includes('organisation-settings')
          : false;

        const hasManagePrivacySettings = permissions.settings
          ? permissions.settings.includes('manage-privacy-settings')
          : false;

        setHasPrivacyPolicyPermissions(
          hasOrgSettings && hasManagePrivacySettings
        );

        updateStatus('LOADED');
      },
      () => {
        updateStatus('ERROR');
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = useMemo(() => {
    const appearanceSettingsTab = {
      title: props.t('Appearance'),
      content: (
        <AppearanceSettings
          fetchGraphColours={props.fetchGraphColours}
          nameFormattings={props.nameFormattings}
          updateNameFormattings={props.updateNameFormattings}
          graphColourPalette={props.graphColourPalette}
          onResetGraphColours={props.resetGraphColours}
          onUpdateGraphColourPalette={props.updateGraphColourPalette}
        />
      ),
      key: 'Appearance',
    };

    const workloadSettingsTab = {
      key: 'Workload',
      title: props.t('Workload'),
      content: (
        <WorkloadSettings
          groupedWorkloadOptions={props.groupedWorkloadOptions}
          primaryWorkloadVariableId={props.primaryWorkloadVariableId}
          secondaryWorkloadVariableId={props.secondaryWorkloadVariableId}
          gameParticipationLevels={props.gameParticipationLevels}
          trainingParticipationLevels={props.trainingParticipationLevels}
          onChangePrimaryVariable={props.updatePrimaryWorkloadVariable}
          onChangeSecondaryVariable={props.updateSecondaryWorkloadVariable}
          gameRpeCollection={props.gameRpeCollection}
          trainingRpeCollection={props.trainingRpeCollection}
          onChangeRpeCollection={props.updateRpeCollection}
          onParticipationLevelNameChange={props.onParticipationLevelNameChange}
          onIncludeInGroupCalculationChange={
            props.onIncludeInGroupCalculationChange
          }
          onRestoreDefaults={props.restoreDefaultWorkloadSettings}
          onSaveForm={props.saveWorkloadSettings}
        />
      ),
    };

    const integrationsSettingsTab = {
      key: 'Integrations',
      title: props.t('Integrations'),
      content: (
        <IntegrationsSettings
          activeIntegrations={props.activeIntegrations}
          fetchActiveIntegrations={props.fetchActiveIntegrations}
          fetchAvailableIntegrations={props.fetchAvailableIntegrations}
          onClickAddIntegration={props.onClickAddIntegration}
          onClickUnlinkIntegration={props.onClickUnlinkIntegration}
        />
      ),
    };

    const planningSettingsTab = {
      key: 'Planning',
      title: props.t('Planning'),
      content: (
        <PlanningSettings
          hasDevelopmentGoalsModule={props.hasDevelopmentGoalsModule}
          areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
        />
      ),
    };

    const securityAndPrivacyTab = {
      key: 'SecurityAndprivacy',
      title: props.t('Security and privacy'),
      content: (
        <SecurityAndPrivacySettings
          privacyPolicyText={props.privacyPolicyText}
          privacyPolicyIsActive={props.privacyPolicyIsActive}
          fetchPrivacyPolicy={props.fetchPrivacyPolicy}
          fetchPrivacyPolicyIsActive={props.fetchPrivacyPolicyIsActive}
          onConfirmUpdatePrivacyPolicy={props.onConfirmUpdatePrivacyPolicy}
          privacyPolicyActionState={props.privacyPolicyActionState}
          onEditingPolicy={props.onEditingPolicy}
          savePrivacyPolicyIsActive={props.savePrivacyPolicyIsActive}
        />
      ),
    };

    const termsOfUsePolicyTab = {
      key: 'TermsOfUse',
      title: props.t('Terms of Use Policy'),
      content: (
        <TermsOfUseSettings
          termsOfUsePolicyText={props.termsOfUsePolicyText}
          termsOfUsePolicyIsActive={props.termsOfUsePolicyIsActive}
          fetchTermsOfUsePolicy={props.fetchTermsOfUsePolicy}
          fetchTermsOfUsePolicyIsActive={props.fetchTermsOfUsePolicyIsActive}
          onConfirmUpdateTermsOfUsePolicy={
            props.onConfirmUpdateTermsOfUsePolicy
          }
          termsOfUsePolicyActionState={props.termsOfUsePolicyActionState}
          onEditingPolicy={props.onEditingTermsOfUsePolicy}
          saveTermsOfUsePolicyIsActive={props.saveTermsOfUsePolicyIsActive}
        />
      ),
    };

    const terminologyTab = {
      title: props.t('Terminology'),
      content: <TerminologySettings />,
      key: 'Terminology',
    };

    const calendarSettingsTab = {
      title: props.t('Calendar'),
      key: 'Calendar',
      content: <CalendarSettings />,
    };

    const locationsTab = {
      title: props.t('Locations'),
      key: 'Locations',
      content: <Locations />,
    };

    const notificationsTab = {
      title: props.t('Notifications'),
      key: 'Notifications',
      content: <Notifications />,
    };

    const availableTabs = [appearanceSettingsTab, workloadSettingsTab];

    if (window.featureFlags['integrations-tab-organisation-settings']) {
      availableTabs.push(integrationsSettingsTab);
    }

    if (window.getFlag('planning-session-planning') && props.isPlanningAdmin) {
      availableTabs.push(planningSettingsTab);
    }

    if (
      window.featureFlags['custom-privacy-policy'] &&
      hasPrivacyPolicyPermissions
    ) {
      availableTabs.push(securityAndPrivacyTab);
    }

    if (window.getFlag('organisation-settings-terminology-updates')) {
      availableTabs.push(terminologyTab);
    }

    if (window.featureFlags['calendar-settings-ip']) {
      availableTabs.push(calendarSettingsTab);
    }

    if (window.featureFlags['location-settings-managements-on-i-p']) {
      availableTabs.push(locationsTab);
    }

    if (window.ipForGovernment) {
      availableTabs.push(termsOfUsePolicyTab);
    }

    if (window.getFlag('event-notifications')) {
      availableTabs.push(notificationsTab);
    }

    return availableTabs;
  }, [props, hasPrivacyPolicyPermissions]);

  // Effect to sync the selected tab with the URL hash
  useEffect(() => {
    const currentHash = hash ? hash.replace('#', '') : null;
    const defaultTabKey = tabs[0]?.key;

    if (currentHash && tabs.some((tab) => tab.key === currentHash)) {
      if (currentHash !== value) {
        setValue(currentHash);
      }
    } else if (defaultTabKey && value !== defaultTabKey) {
      setValue(defaultTabKey);
    }
  }, [hash, tabs, value]);

  const handleTabChange = (event, newValue: string) => {
    setValue(newValue);
    assign(`#${newValue}`);
  };

  return (
    <div className="organisationSettings">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleTabChange}
            aria-label={props.t('Organisation Settings Tabs')}
          >
            {tabs.map((tab) => (
              <Tab label={tab.title} value={tab.key} key={tab.key} />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab) => (
          <TabPanel
            value={tab.key}
            key={tab.key}
            sx={{
              p: 2,
              background: colors.background,
            }}
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabContext>
      <AddIntegrationModal />
      <UnlinkIntegrationModal />
      <UpdatePrivacyPolicyModal />
      <UpdateTermsOfUsePolicyModal />
      <AppStatus />
      <Toasts />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
