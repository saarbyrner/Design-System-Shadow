// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { exportInjuryMedicationReport } from '@kitman/services';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import type { InjuryMedicationReportAllowedColumns } from '@kitman/services/src/services/medical/exportInjuryMedicationReport';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';

type Props = {
  squadId: number,
  isSettingsOpen: boolean,
  closeSettings: () => void,
  reportSettingsKey: string,
  onExportStartedSuccess?: () => void,
};

const defaultColumns = ['issue_name', 'issue_date', 'medications'];

const desiredColumnOrder: Array<InjuryMedicationReportAllowedColumns> = [
  'issue_name',
  'issue_date',
  'medications',
];

const orderColumns = (a, b) =>
  desiredColumnOrder.indexOf(a) - desiredColumnOrder.indexOf(b);

const InjuryMedicationReportExport = ({
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const exportHook = useExports(null, true);
  const reportTitle = t('Appendix BB Report');

  const reportLabels: { [InjuryMedicationReportAllowedColumns]: string } = {
    issue_name: t('Identity of Diagnosis'),
    issue_date: t('Initial Date of Diagnosis by Club Physician'),
    medications: t('Prescribed Medication'),
  };

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
    {
      value: 'include_past_players',
      label: t('Include Past players'),
    },
    {
      value: 'export_player_files_individually',
      label: t('Export player files individually'),
    },
  ];

  const onSave = (state) => {
    closeSettings();

    let visibleColumns = state.activeColumns || [];

    // Add filter as local cache may have previous values that are now unsupported
    visibleColumns = visibleColumns.filter((col) =>
      defaultColumns.includes(col)
    );

    // Sort because turning checkboxes on and off changes activeColumns order
    visibleColumns.sort(orderColumns);

    let issueTypes = [];
    if (state.issueType && state.issueType !== 'All') {
      issueTypes = [state.issueType];
    }

    const filters = {
      include_created_by_prior_club: state.extraSettings.includes(
        'include_created_by_prior_club'
      ),
      export_player_files_individually: state.extraSettings.includes(
        'export_player_files_individually'
      ),
      date_ranges: [
        {
          start_time: state.dateRange[0],
          end_time: moment(state.dateRange[1])
            .endOf('day')
            .format(dateTransferFormat),
        },
      ],
    };

    exportHook.exportReports(
      () =>
        exportInjuryMedicationReport(
          issueTypes,
          state.population,
          [...visibleColumns],
          filters,
          state.extraSettings.includes('include_past_players'),
          state.exportFormat
        ),
      onExportStartedSuccess
    );
  };

  return (
    <>
      <ExportSettings
        mui
        requiredKeys={['population', 'dateRange']}
        title={reportTitle}
        isOpen={isSettingsOpen}
        onSave={onSave}
        onCancel={closeSettings}
        settingsKey={reportSettingsKey}
      >
        <SquadSelectorField
          defaultValue={[
            {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [],
              squads: squadId != null ? [squadId] : [],
              context_squads: squadId != null ? [squadId] : [],
            },
          ]}
        />
        <ExportSettings.CommonFields.Mui.DateRangePicker
          fieldKey="dateRange"
          label={t('Date range')}
          maxDate={moment()}
          isCached
        />

        {window.organisationSport !== 'nfl' && (
          <ExportSettings.CommonFields.Mui.RadioList
            fieldKey="issueType"
            label={t('Issue Type')}
            options={[
              {
                value: 'All',
                name: t('All Issues'),
              },
              {
                value: 'Injury',
                name: t('Injuries'),
              },
              {
                value: 'Illness',
                name: t('Illnesses'),
              },
            ]}
            defaultValue="All"
            isCached
          />
        )}
        <ExportSettings.CommonFields.Mui.CheckboxList
          fieldKey="extraSettings"
          label={t('Settings')}
          items={extraSettings}
          defaultValue={
            showIncludeCreatedPriorClub ? ['include_created_by_prior_club'] : []
          }
          isCached
        />
        <ExportSettings.CommonFields.Mui.RadioList
          fieldKey="exportFormat"
          label={t('Export format')}
          options={[
            {
              value: 'xlsx',
              name: 'XLSX',
            },
            {
              value: 'pdf',
              name: 'PDF',
            },
          ]}
          defaultValue="xlsx"
          isCached
        />
        <ExportSettings.CommonFields.Mui.CheckboxList
          fieldKey="activeColumns"
          label={t('Columns')}
          items={defaultColumns.map((columnId) => ({
            value: columnId,
            label: reportLabels[columnId],
          }))}
          defaultValue={defaultColumns}
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

export const InjuryMedicationReportExportTranslated: ComponentType<Props> =
  withNamespaces()(InjuryMedicationReportExport);
export default InjuryMedicationReportExport;
