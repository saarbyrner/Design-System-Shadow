// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { getLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { exportOsha300Report } from '@kitman/services';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';

type Props = {
  isSettingsOpen: boolean,
  closeSettings: () => void,
  reportSettingsKey: string,
  onExportStartedSuccess?: () => void,
};

const Osha300Report = ({
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const exportHook = useExports(null, true);
  const reportTitle = t('OSHA 300 Report');

  const showIncludeCreatedPriorClub =
    window.featureFlags['nfl-include-prior-club-issues'];

  const extraSettings = [
    ...(showIncludeCreatedPriorClub
      ? [
          {
            value: 'include_created_by_prior_club',
            label: t('Include Created by Prior Club'),
          },
        ]
      : []),
  ];

  const onSave = (state) => {
    closeSettings();

    const filters = {
      include_created_by_prior_club:
        state.extraSettings?.includes('include_created_by_prior_club') || false,
      date_range: {
        start_time: state.dateRange[0],
        end_time: moment(state.dateRange[1])
          .endOf('day')
          .format(dateTransferFormat),
      },
    };

    exportHook.exportReports(
      () =>
        exportOsha300Report({
          filters,
          format: state.exportFormat,
        }),
      () => {
        onExportStartedSuccess?.();
        trackEvent(
          performanceMedicineEventNames.exportOSHA300Report,
          getLevelAndTab('team', tabHashes.OVERVIEW)
        );
      }
    );
  };

  return (
    <>
      <ExportSettings
        mui
        requiredKeys={['dateRange']}
        title={reportTitle}
        isOpen={isSettingsOpen}
        onSave={onSave}
        onCancel={closeSettings}
        settingsKey={reportSettingsKey}
      >
        <ExportSettings.CommonFields.Mui.DateRangePicker
          fieldKey="dateRange"
          label={t('Date range')}
          maxDate={moment()}
          isCached
        />
        {extraSettings.length !== 0 && (
          <ExportSettings.CommonFields.Mui.CheckboxList
            fieldKey="extraSettings"
            label={t('Settings')}
            items={extraSettings}
            defaultValue={
              showIncludeCreatedPriorClub
                ? ['include_created_by_prior_club']
                : []
            }
            isCached
          />
        )}
        <ExportSettings.CommonFields.Mui.RadioList
          fieldKey="exportFormat"
          label={t('Export format')}
          options={[
            {
              value: 'csv',
              name: 'CSV',
            },
            {
              value: 'xlsx',
              name: 'XLSX',
            },
            {
              value: 'pdf',
              name: 'PDF',
            },
          ]}
          defaultValue="csv"
          isCached
        />
      </ExportSettings>
      <ToastDialog
        toasts={exportHook.toasts}
        onCloseToast={exportHook.closeToast}
      />
    </>
  );
};

export const Osha300ReportTranslated: ComponentType<Props> =
  withNamespaces()(Osha300Report);
export default Osha300Report;
