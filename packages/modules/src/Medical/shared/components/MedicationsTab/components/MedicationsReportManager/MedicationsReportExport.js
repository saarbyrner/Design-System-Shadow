// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { exportMedicationsReport } from '@kitman/services';
import type { MedicationExportAllowedColumns } from '@kitman/services/src/services/medical/exports/exportMedicationsReport';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { organisationAssociations } from '@kitman/common/src/variables';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';

const desiredColumnOrder: Array<MedicationExportAllowedColumns> = [
  'player_name',
  'reason',
  'medication',
  'start_date',
  'end_date',
  'nfl_id',
  'injury_date',
  'dosage',
  'quantity',
  'type',
  'external_prescriber_name',
];

const orderColumns = (a, b) =>
  desiredColumnOrder.indexOf(a) - desiredColumnOrder.indexOf(b);

type Props = {
  athleteId?: ?number,
  squadId?: number,
  isSettingsOpen: boolean,
  closeSettings: Function,
  reportSettingsKey: string,
  onExportStartedSuccess?: Function,
};

const MedicationsReportExport = ({
  athleteId,
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const exportHook = useExports(null, true);

  const { data: organisation } = useGetOrganisationQuery();

  const defaultColumns = [
    {
      value: 'player_name',
      label: t('Player Name'),
      isDisabled: true,
    },
    {
      value: 'reason',
      label: t('Reason'),
      isDisabled: true,
    },
    {
      value: 'medication',
      label: t('Medication'),
      isDisabled: true,
    },
    {
      value: 'start_date',
      label: t('Start date'),
      isDisabled: true,
    },
    {
      value: 'end_date',
      label: t('End date'),
      isDisabled: true,
    },
    {
      value: 'nfl_id',
      label: 'NFL Player ID',
    },
    {
      value: 'injury_date',
      label: 'Injury Date',
    },
    {
      value: 'dosage',
      label: 'Dosage',
    },
    {
      value: 'quantity',
      label: 'Quantity',
    },
    {
      value: 'type',
      label: 'Type',
    },
    {
      value: 'external_prescriber_name',
      label: 'Dispenser',
    },
  ];

  const defaultColumnsValues = defaultColumns.map(
    (defaultColumn) => defaultColumn.value
  );

  const defaultSettings: Array<CheckboxListItem> = [
    {
      value: 'include_all_active',
      label: t('Include all active medications'),
    },
  ];

  const excludeOptions =
    organisation?.association_name === organisationAssociations.nfl
      ? []
      : ['nfl_id'];

  const onSave = (state) => {
    closeSettings();
    let visibleColumns = state.activeColumns || [];
    // Add filter as local cache may have previous values that are now unsupported
    visibleColumns = visibleColumns.filter((col) =>
      defaultColumnsValues.includes(col)
    );
    // Sort because turning checkboxes on and off changes activeColumns order
    visibleColumns.sort(orderColumns);

    const dateRange = {
      start_date: state.dateRange[0],
      end_date: state.dateRange[1],
    };

    exportHook.exportReports(
      () =>
        exportMedicationsReport({
          population: state.population,
          columns: visibleColumns,
          filters: {
            report_range: dateRange,
            include_all_active:
              state.extraSettings?.includes('include_all_active') || false,
            archived: false,
          },
          format: state.exportFormat,
        }),
      onExportStartedSuccess
    );
  };

  return (
    <>
      <ExportSettings
        mui
        requiredKeys={['population', 'dateRange']}
        title={t('Medication Report')}
        isOpen={isSettingsOpen}
        onSave={onSave}
        onCancel={closeSettings}
        settingsKey={reportSettingsKey}
      >
        {squadId || athleteId ? (
          <SquadSelectorField
            defaultValue={[
              {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: athleteId ? [athleteId] : [],
                squads: squadId ? [squadId] : [],
                context_squads: squadId ? [squadId] : [],
              },
            ]}
            isCached={
              reportSettingsKey !== 'MedicationsTab|MedicationsReportExport'
            }
          />
        ) : null}
        <ExportSettings.CommonFields.Mui.DateRangePicker
          fieldKey="dateRange"
          label={t('Date range')}
          isCached
        />
        <ExportSettings.CommonFields.Mui.RadioList
          defaultValue="pdf"
          fieldKey="exportFormat"
          label={t('Export format')}
          options={[
            {
              value: 'pdf',
              name: 'PDF',
            },
            {
              value: 'csv',
              name: 'CSV',
            },
          ]}
          isCached
        />
        <ExportSettings.CommonFields.Mui.CheckboxList
          defaultValue={[
            'player_name',
            'reason',
            'medication',
            'start_date',
            'end_date',
          ]}
          fieldKey="activeColumns"
          label="Columns"
          items={defaultColumns.filter(
            (item) => !excludeOptions.includes(item.value)
          )}
          isCached
        />
        <ExportSettings.CommonFields.Mui.CheckboxList
          fieldKey="extraSettings"
          label={t('Settings')}
          items={defaultSettings}
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

export const MedicationsReportExportTranslated: ComponentType<Props> =
  withNamespaces()(MedicationsReportExport);
export default MedicationsReportExport;
