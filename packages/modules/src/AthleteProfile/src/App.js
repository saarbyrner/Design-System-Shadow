// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Tab,
  Box,
  TabContext,
  TabList,
  TabPanel,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import {
  getAthleteFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  MODES,
  APP_BAR_HEIGHT,
  FORMS_PRODUCT_AREAS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { onUpdateShowMenuIcons } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { useGetAthleteIdFromPath } from '@kitman/modules/src/HumanInput/hooks/helperHooks';
import EmergencyContactsContainer from '@kitman//modules/src/EmergencyContacts/src/containers/App';
import useGenericActionButtons from '@kitman/modules/src/HumanInput/hooks/useGenericActionButtons';
import AthleteDetailsTab from '@kitman/modules/src/HumanInput/shared/components/FormDetailsTab';
import { ThirdPartySettingsTranslated as ThridPartySettings } from '@kitman/modules/src/AthleteProfile/src/components/ThirdPartySettings';
import GuardiansTab from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians';
import { updateAthleteProfile } from '@kitman/services/src/services/humanInput/api';
import type { FormUpdateRequestBody } from '@kitman/services/src/services/humanInput/api/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { HeaderContainerTranslated as Header } from './components/HeaderContainer/HeaderContainer';

const ATHLETE_PROFILE_ERROR_TOAST_ID = 'ATHLETE_PROFILE_ERROR_TOAST';
const ATHLETE_PROFILE_SUCCESS_TOAST_ID = 'ATHLETE_PROFILE_SUCCESS_TOAST';

const tabKeysEnumLike = {
  athleteDetails: 'athleteDetails',
  emergencyContacts: 'emergencyContacts',
  thirdPartySettings: 'thirdPartySettings',
  guardians: 'guardians',
};

type TabKey = $Values<typeof tabKeysEnumLike>;

const App = (props: I18nProps<{}>) => {
  const [tab, setTab] = useState<TabKey>(tabKeysEnumLike.athleteDetails);
  const mode = useSelector(getModeFactory());
  const athlete = useSelector(getAthleteFactory());
  const dispatch = useDispatch();
  const handleChange = (event, newValue: TabKey) => {
    setTab(newValue);
  };

  const {
    data: permissions = DEFAULT_CONTEXT_VALUE.permissions,
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const athleteId = useGetAthleteIdFromPath();

  const onUpdateAthlete = useCallback(
    (requestBody: FormUpdateRequestBody) =>
      updateAthleteProfile({ requestBody, athleteId }),
    [athleteId]
  );
  const canViewSettingsAthletes = permissions.settings?.canViewSettingsAthletes;
  const canViewGuardiansTab =
    window.getFlag('athlete-guardian-access') &&
    permissions.guardianAccess?.canManageGuardians;
  const { actionButtons } = useGenericActionButtons({
    onUpdate: onUpdateAthlete,
    toastIds: {
      errorToastId: ATHLETE_PROFILE_ERROR_TOAST_ID,
      successToastId: ATHLETE_PROFILE_SUCCESS_TOAST_ID,
    },
    doesUserHaveRequiredPermissions: !!canViewSettingsAthletes,
    isGenericForm: false,
    productArea: FORMS_PRODUCT_AREAS.ATHLETE_PROFILE,
  });

  useEffect(() => {
    dispatch(onUpdateShowMenuIcons({ showMenuIcons: mode === MODES.CREATE }));
  }, [mode, dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        background: colors.background,
        overflow: 'hidden',
        typography: 'body1',
        height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
      }}
    >
      <FormLayout.Title withTabs>
        <Header athlete={athlete} athleteId={athleteId} />
      </FormLayout.Title>
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: colors.white,
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label={props.t('Athlete Profile Tabs')}
          >
            <Tab
              label={props.t('Athlete Details')}
              value={tabKeysEnumLike.athleteDetails}
            />
            {permissions.settings.canViewSettingsEmergencyContacts && (
              <Tab
                label={props.t('Emergency Contacts')}
                value={tabKeysEnumLike.emergencyContacts}
              />
            )}
            {canViewSettingsAthletes && (
              <Tab
                label={props.t('Third Party Settings')}
                value={tabKeysEnumLike.thirdPartySettings}
              />
            )}
            {canViewGuardiansTab && (
              <Tab
                label={props.t('Guardians')}
                value={tabKeysEnumLike.guardians}
              />
            )}
          </TabList>
        </Box>
        <TabPanel
          sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}
          value={tabKeysEnumLike.athleteDetails}
        >
          <AthleteDetailsTab actionButtons={actionButtons} />
        </TabPanel>
        {permissions.settings.canViewSettingsEmergencyContacts && (
          <TabPanel value={tabKeysEnumLike.emergencyContacts}>
            <EmergencyContactsContainer />
          </TabPanel>
        )}
        {canViewSettingsAthletes && (
          <TabPanel sx={{ p: 0 }} value={tabKeysEnumLike.thirdPartySettings}>
            <ThridPartySettings />
          </TabPanel>
        )}
        {canViewGuardiansTab && (
          <TabPanel sx={{ p: 0 }} value={tabKeysEnumLike.guardians}>
            <GuardiansTab />
          </TabPanel>
        )}
      </TabContext>
    </Box>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
