// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import i18n from '@kitman/common/src/utils/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { TextButton, TooltipMenu } from '@kitman/components';
import { Button } from '@kitman/playbook/components';
import { MedicalHistoryTranslated as MedicalHistory } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/MedicalHistory';

type Props = {};

export type ReportKey = 'medical_history';

const ReportManager = ({ t }: I18nProps<Props>) => {
  const [openReportSettings, setOpenReportSettings] =
    useState<?ReportKey>(null);

  const {
    data: permissions = {
      ...DEFAULT_CONTEXT_VALUE.permissions,
    },
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const availabilityConfig = {
    medical_history: {
      isAvailable:
        window.featureFlags['medical-bulk-export'] &&
        permissions.medical.issues.canExport,
    },
  };

  const menuItems = [
    {
      key: 'medical_history',
      description: i18n.t('Medical History'),
      onClick: () => {
        setOpenReportSettings('medical_history');
      },
      isDisabled: false,
    },
  ]
    .filter(({ key }) => availabilityConfig[key].isAvailable)
    .map((item) => ({
      description: item.description,
      onClick: item.onClick,
      isDisabled: item.isDisabled,
    }));

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <>
      {menuItems.length > 1 && (
        <TooltipMenu
          appendToParent
          placement="bottom-end"
          offset={[0, 5]}
          menuItems={menuItems}
          tooltipTriggerElement={
            <TextButton
              text={t('Download')}
              iconAfter="icon-chevron-down"
              type="secondary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      )}
      {menuItems.length === 1 && (
        <Button
          color="secondary"
          onClick={menuItems[0].onClick}
          disabled={menuItems[0].isDisabled}
        >
          {menuItems[0].description}
        </Button>
      )}
      {availabilityConfig.medical_history.isAvailable && (
        <div data-testid="MedicalHistory">
          <MedicalHistory
            squadId={null}
            isSettingsOpen={openReportSettings === 'medical_history'}
            closeSettings={() => setOpenReportSettings(null)}
            reportSettingsKey="PastAthletes|MedicalHistory"
            displayPastAthletes
          />
        </div>
      )}
    </>
  );
};

export const ReportManagerTranslated: ComponentType<Props> =
  withNamespaces()(ReportManager);
export default ReportManager;
