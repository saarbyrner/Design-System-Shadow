// @flow
import {
  useGetPermissionsQuery,
  useFetchOrganisationPreferenceQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import { DownloadCSVTranslated as DownloadCSV } from '@kitman/modules/src/shared/MassUpload/components/DownloadCSV';

import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Button, Stack } from '@kitman/playbook/components';

import { Printable } from '@kitman/printing/src/renderers';
import { AllSquad } from '@kitman/printing/src/templates';
import { ReminderTriggerTranslated as ReminderTrigger } from '@kitman/modules/src/AthleteManagement/shared/components/ReminderTrigger';
import { NewAthleteTranslated as NewAthleteButton } from '@kitman/modules/src/AthleteManagement/shared/components/NewAthlete';
import { ExportMenuTranslated as ExportMenu } from '../ExportMenu/ExportMenu';
import useAllAthletesPdfTemplate from '../../hooks/useAllAthletesPdfTemplate';

type Props = {
  isAssociationAdmin: boolean,
  isLeagueStaffUser: boolean,
};

// TODO: These really should be MUI going forward, but there's a mixture here
// MassUpload & DownloadCSV need to be rewired to use MUI
const Actions = (props: Props) => {
  const { data: permissions } = useGetPermissionsQuery();
  const { preferences } = usePreferences();
  const useCommunicationsFlow = preferences?.league_game_communications;
  const showAllAthletesPdfButton = window.getFlag(
    'league-ops-athlete-pdf-download'
  );

  const {
    data: isActivityTypeCategoryEnabled,
    isLoading: isActivityTypeCategoryPreferenceLoading,
  } = useFetchOrganisationPreferenceQuery('enable_activity_type_category');

  const {
    data: shouldHideAthleteCreateButton,
    isLoading: isHideAthleteCreateButtonPreferenceLoading,
  } = useFetchOrganisationPreferenceQuery('hide_athlete_create_button');

  const {
    templateData: athletesData,
    getTemplateData,
    isTemplateDataLoading,
  } = useAllAthletesPdfTemplate();

  const renderNewAthleteButton = () => {
    if (window.featureFlags['manage-athletes-grid-mui']) {
      if (isHideAthleteCreateButtonPreferenceLoading) return false;
      return shouldHideAthleteCreateButton?.value === false;
    }
    if (props.isAssociationAdmin) {
      if (isActivityTypeCategoryPreferenceLoading) return false;
      return isActivityTypeCategoryEnabled?.value === false;
    }
    return null;
  };

  const renderReminderTrigger =
    props.isAssociationAdmin &&
    permissions.general.canManageAbsence &&
    permissions.settings.canViewSettingsQuestionnaire;

  const renderUploadAndDownloadCSV =
    props.isAssociationAdmin &&
    permissions.settings.canCreateImports &&
    window.featureFlags['league-ops-mass-create-athlete-staff'];

  return (
    <Stack direction="row" gap={1}>
      {renderNewAthleteButton() && <NewAthleteButton />}
      {renderUploadAndDownloadCSV && (
        <>
          <MassUpload userType="athlete" />
          <DownloadCSV userType="athlete" />
        </>
      )}
      {useCommunicationsFlow &&
        !props.isLeagueStaffUser &&
        showAllAthletesPdfButton && (
          <Button
            color="primary"
            sx={{
              padding: '4px 12px',
            }}
            disabled={isTemplateDataLoading}
            onClick={() => getTemplateData()}
          >
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Print}
              sx={{
                marginRight: '6px',
              }}
            />
            Team
          </Button>
        )}
      {athletesData && (
        <Printable>
          <AllSquad templateData={athletesData} />
        </Printable>
      )}
      <ExportMenu />
      {renderReminderTrigger && <ReminderTrigger />}
    </Stack>
  );
};

export default Actions;
