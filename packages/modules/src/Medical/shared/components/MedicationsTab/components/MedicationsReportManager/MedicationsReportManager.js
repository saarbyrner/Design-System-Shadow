// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import i18n from '@kitman/common/src/utils/i18n';
import { TextButton, TooltipMenu } from '@kitman/components';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import { MedicationReportTranslated as MedicationReport } from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationReport';
import { MedicationsReportExportTranslated as MedicationsReportExport } from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationsReportManager/MedicationsReportExport';

export type ReportKey = 'medications' | 'medications_report_export';

type Props = {
  athleteId?: ?number,
};

const MedicationsReportManager = ({ athleteId, t }: I18nProps<Props>) => {
  const {
    data: permissions = {
      ...DEFAULT_CONTEXT_VALUE.permissions,
    },
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const availabilityConfig = {
    medications: {
      isAvailable:
        window.featureFlags['medications-report'] &&
        permissions.medical.medications.canView,
    },
    medications_report_export: {
      isAvailable:
        window.featureFlags['medications-report-export'] &&
        permissions.medical.medications.canView,
    },
  };

  const [openReportSettings, setOpenReportSettings] =
    useState<null | ReportKey>(null);
  const [exportType, setExportType] = useState<'pdf' | 'csv'>('pdf');

  const printReport = () => {
    setTimeout(() => {
      window.print();
    }, 0);
  };

  const menuItems = [
    {
      key: 'medications',
      description: i18n.t('Medication Report PDF'),
      onClick: () => {
        setExportType('pdf');
        setOpenReportSettings('medications');
      },
      isDisabled: false,
    },
    {
      key: 'medications',
      description: i18n.t('Medication Report CSV'),
      onClick: () => {
        setExportType('csv');
        setOpenReportSettings('medications');
      },
      isDisabled: false,
    },
    {
      key: 'medications_report_export',
      description: i18n.t('Medication Report'),
      onClick: () => {
        setOpenReportSettings('medications_report_export');
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
        <TextButton
          type="secondary"
          text={menuItems[0].description}
          onClick={menuItems[0].onClick}
          isDisabled={menuItems[0].isDisabled}
          kitmanDesignSystem
        />
      )}
      {availabilityConfig.medications.isAvailable && (
        <MedicationReport
          athleteId={athleteId}
          exportType={exportType}
          isReportActive
          printReport={() => printReport()}
          isSettingsOpen={openReportSettings === 'medications'}
          closeSettings={() => setOpenReportSettings(null)}
          reportSettingsKey="MedicationsTab|MedicationsReport"
        />
      )}
      {availabilityConfig.medications_report_export.isAvailable && (
        <MedicationsReportExport
          athleteId={athleteId}
          isSettingsOpen={openReportSettings === 'medications_report_export'}
          closeSettings={() => setOpenReportSettings(null)}
          reportSettingsKey="MedicationsTab|MedicationsReportExport"
        />
      )}
    </>
  );
};

export const MedicationsReportManagerTranslated: ComponentType<Props> =
  withNamespaces()(MedicationsReportManager);
export default MedicationsReportManager;
