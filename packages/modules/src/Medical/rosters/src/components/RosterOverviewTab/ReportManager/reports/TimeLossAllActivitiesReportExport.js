// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { exportTimeLossAllActivitiesReport } from '@kitman/services';
import type { TimeLossAllActivitiesReportAllowedColumns } from '@kitman/services/src/services/medical/exportTimeLossAllActivitiesReport';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';

type Props = {
  squadId: ?number,
  isSettingsOpen: boolean,
  closeSettings: () => void,
  reportSettingsKey: string,
  onExportStartedSuccess?: () => void,
};

const defaultColumns = [
  'issue_date',
  'athlete_id',
  'player_id',
  'player_name',
  'issue_name',
  'return_to_full',
  'games_missed',
  'practices_missed',
  'otas_missed',
  'walkthroughs_missed',
  'mini_camps_missed',
  'player_activity',
];

const desiredColumnOrder: Array<TimeLossAllActivitiesReportAllowedColumns> = [
  'issue_date',
  'athlete_id',
  'player_id',
  'player_name',
  'issue_name',
  'return_to_full',
  'games_missed',
  'practices_missed',
  'otas_missed',
  'walkthroughs_missed',
  'mini_camps_missed',
  'player_activity',
];

const orderColumns = (a, b) =>
  desiredColumnOrder.indexOf(a) - desiredColumnOrder.indexOf(b);

const TimeLossAllActivitiesReportExport = ({
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const exportHook = useExports(null, true);
  const reportTitle = t('Time Loss Report (All activities)');
  const isForNFL = window.organisationSport === 'nfl';
  const hiddenColumnOptions = isForNFL ? ['athlete_id'] : ['player_id'];

  const reportLabels: { [TimeLossAllActivitiesReportAllowedColumns]: string } =
    {
      issue_date: isForNFL ? t('Injury Date') : t('Issue Date'),
      athlete_id: t('Athlete id'),
      player_id: t('Player id'),
      player_name: t('Player name'),
      issue_name: isForNFL ? t('Injury') : t('Issue'),
      return_to_full: t('Return to full'),
      games_missed: t('Games Out'),
      practices_missed: t('Practices Out'),
      otas_missed: t('OTAs Out'),
      walkthroughs_missed: t('Walkthroughs Out'),
      mini_camps_missed: t('Mini-camps Out'),
      player_activity: t('Activity at Time of Injury'),
    };

  const showIncludeCreatedPriorClub =
    window.featureFlags['nfl-include-prior-club-issues'];

  const extraSettings = [
    {
      value: 'include_demographics',
      label: t('Demographics'),
    },
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
  ];

  const onSave = (state) => {
    closeSettings();

    const visibleColumns = state.activeColumns
      ? state.activeColumns.filter((col) => !hiddenColumnOptions.includes(col))
      : [];

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
        exportTimeLossAllActivitiesReport(
          issueTypes,
          state.population,
          [...visibleColumns],
          filters,
          state.exportFormat,
          state.extraSettings.includes('include_past_players'),
          state.extraSettings.includes('include_demographics')
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
        {!isForNFL && (
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
          defaultValue={
            showIncludeCreatedPriorClub
              ? ['include_created_by_prior_club', 'include_demographics']
              : ['include_demographics']
          }
          items={extraSettings}
          isCached
        />
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
        <Box sx={{ width: '100%', px: '24px' }}>
          <Accordion disableGutters>
            <AccordionSummary
              expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
              sx={{ px: 0 }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                {t('Columns')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <ExportSettings.CommonFields.Mui.CheckboxList
                fieldKey="activeColumns"
                items={defaultColumns
                  .map((columnId) => ({
                    value: columnId,
                    label: reportLabels[columnId],
                  }))
                  .filter(
                    (option) => !hiddenColumnOptions.includes(option.value)
                  )}
                defaultValue={defaultColumns}
                styles={{
                  padding: '6px 12px',
                  paddingBottom: '24px',
                }}
                isCached
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </ExportSettings>
      <ToastDialog
        toasts={exportHook.toasts}
        onCloseToast={exportHook.closeToast}
      />
    </>
  );
};

export const TimeLossAllActivitiesReportExportTranslated: ComponentType<Props> =
  withNamespaces()(TimeLossAllActivitiesReportExport);
export default TimeLossAllActivitiesReportExport;
