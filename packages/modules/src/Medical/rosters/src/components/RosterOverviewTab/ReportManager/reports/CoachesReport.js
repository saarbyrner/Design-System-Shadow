// @flow
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  Radio,
  RadioGroup,
  FormLabel,
  Box,
  FormControl,
  FormControlLabel,
} from '@kitman/playbook/components';
import { Printable } from '@kitman/printing/src/renderers';
import type {
  ReportConfigV2,
  GroupingTypeV2,
} from '@kitman/services/src/services/medical/getCoachesReportV2';
import type {
  GroupConfig,
  AvailableColumns,
  CoachesReportGrouped,
  CoachesReportDoubleGrouped,
  ReportConfig,
} from '@kitman/services/src/services/medical/getCoachesReport';
import { CoachesReport as CoachesReportTemplate } from '@kitman/printing/src/templates';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';
import {
  getCoachesReport,
  getCoachesReportV2,
} from '@kitman/services/src/services/medical';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import { Select, TextLink } from '@kitman/components';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';
import { getErrorToast, getDynamicGroupingOptions } from '../utils';

type Props = {
  isReportActive: boolean,
  isSettingsOpen: boolean,
  closeSettings: Function,
  printReport: Function,
  onDownloadCSVSuccess?: Function,
  reportSettingsKey: string,
  dataGridCurrentDate?: string,
  squads: number[],
};

type CoachesReportData = {
  report: ?(CoachesReportGrouped | CoachesReportDoubleGrouped),
  columns: AvailableColumns[],
  rowStyling: boolean,
};

type UpdateStatusFunction = (
  status: 'LOADING' | 'SUCCESS' | 'ERROR',
  title: string,
  description: string
) => void;

const CoachesReport = ({
  dataGridCurrentDate,
  isReportActive,
  isSettingsOpen,
  closeSettings,
  printReport,
  onDownloadCSVSuccess,
  reportSettingsKey,
  squads,
  t,
}: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const coachesReportV2Enabled = window.featureFlags['coaches-report-v2'];
  const isDailyStatusReportVersion =
    window.featureFlags['coaches-report-refactor'];
  const titleText = isDailyStatusReportVersion
    ? t('Daily Status Report')
    : t('Coaches Report');
  const statusText = t('Loading {{versionName}} data', {
    versionName: titleText,
  });

  const { data: organisation } = useGetOrganisationQuery();

  const [coachesReportData, setCoachesReportData] = useState<CoachesReportData>(
    {
      report: null,
      columns: [],
      rowStyling: true,
    }
  );
  const columnsV2 = [
    {
      value: 'athlete_name',
      label: t('Athlete Name'),
    },
    {
      value: 'availability_status',
      label: t('Availability'),
    },
    {
      value: 'open_injuries_names',
      label: t('Open Injuries'),
    },
    {
      value: 'last_daily_status_content',
      label: isDailyStatusReportVersion
        ? t('Last Daily Status Note')
        : t('Last Coaches Note'),
    },
    {
      value: 'position',
      label: t('Position'),
    },
    {
      value: 'athlete_squad_names',
      label: t('Squads'),
    },
    {
      value: 'unavailable_since',
      label: t('Unavalable since'),
    },
  ];

  const [exportType, setExportType] = useState<string>(
    coachesReportV2Enabled ? 'download_csv' : ''
  );

  const defaultSettings: Array<CheckboxListItem> = [
    ...(coachesReportV2Enabled
      ? [
          {
            value: 'exclude_players_with_no_notes',
            label: t('Exclude players with no notes'),
          },
          {
            value: 'only_include_most_recent_injury',
            label: t('Only include most recent injury'),
          },
        ]
      : [
          {
            value: 'exclude_uninjured_players',
            label: t('Exclude non-injured players'),
          },
          {
            value: 'worst_injury_status',
            label: t('Only include worst injuries'),
          },
          {
            value: 'row_styling',
            label: t('Row styling'),
          },
          {
            value: 'download_csv',
            label: t('Download CSV'),
          },
        ]),
  ];

  const handleAsyncJobFormat = (
    data: Object,
    updateStatus: UpdateStatusFunction
  ) => {
    if (typeof data === 'string') {
      const hiddenElement = document.createElement('a');
      hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
        data
      )}`;
      hiddenElement.target = '_blank';
      hiddenElement.download = `${titleText}.csv`;
      hiddenElement.click();
      hiddenElement.remove();

      updateStatus('SUCCESS', t('Success'), t('Report loaded successfully'));

      onDownloadCSVSuccess?.();
    }
  };

  const getV1ExportPayload = (
    shouldRequestCSV,
    issueTypes,
    population,
    grouping,
    hidePlayersThatLeftClub,
    state
  ) => {
    const payloadV1: ReportConfig = {
      reportDate: formatStandard({ date: moment() }),
      format: shouldRequestCSV ? 'CSV' : 'JSON',
      issueTypes,
      population,
      grouping,
      columns: state.columns,
      sortKey: state.sort_key,
      hidePlayersThatLeftClub,
      excludeUninjuredPlayers: state.extraSettings?.includes(
        'exclude_uninjured_players'
      ),
      worstInjuryOnly: state.extraSettings?.includes('worst_injury_status'),
    };
    return payloadV1;
  };

  const getV2ExportPayload = (
    shouldRequestCSV,
    grouping,
    hidePlayersThatLeftClub,
    state
  ) => {
    const payloadV2: ReportConfigV2 = {
      reportDate: dataGridCurrentDate ?? '',
      format: shouldRequestCSV ? 'CSV' : 'PDF',
      squadIds: squads,
      grouping,
      columns: state.columns,
      hidePlayersThatLeftClub,
      onlyIncludeMostRecentInjury: state.extraSettings?.includes(
        'only_include_most_recent_injury'
      ),
      excludePlayersWithNoNotes: state.extraSettings?.includes(
        'exclude_players_with_no_notes'
      ),
    };

    return payloadV2;
  };

  const handleSuccessfulExport = (
    updateStatus,
    shouldRequestCSV,
    data,
    state
  ) => {
    updateStatus(
      'SUCCESS',
      t('Report loaded successfully'),
      <TextLink
        text={t('Exports')}
        href={
          window.featureFlags['side-nav-update']
            ? '/administration/exports'
            : '/settings/exports'
        }
        kitmanDesignSystem
      />
    );
    if (coachesReportV2Enabled) {
      handleAsyncJobFormat(data, updateStatus);
    } else if (shouldRequestCSV) {
      handleAsyncJobFormat(data, updateStatus);
    } else if (typeof data !== 'string') {
      // if coachesReportV2Enabled is true we will not make it here
      setCoachesReportData({
        // $FlowIgnore we have checked already if not v2 - data will be v1 DS
        report: data,
        columns: state.columns,
        rowStyling: state.extraSettings?.includes('row_styling'),
      });
      printReport();
    }
    trackEvent(performanceMedicineEventNames.clickDownloadDailyStatusNotes);
  };

  return (
    <>
      <ExportSettings
        title={titleText}
        isOpen={isSettingsOpen}
        settingsKey={reportSettingsKey}
        onSave={(state, updateStatus) => {
          closeSettings();
          updateStatus('LOADING', t('Loading'), statusText);

          const issueTypes = []; // All issues. (injury and illness)
          const population = state.population;
          const hidePlayersThatLeftClub = true;
          const grouping: GroupConfig = {
            type:
              state.grouping === 'injury_status_reverse'
                ? 'injury_status'
                : state.grouping,
            reverse: state.grouping === 'injury_status_reverse',
          };
          const shouldRequestCSV =
            (!coachesReportV2Enabled &&
              state.extraSettings?.includes('download_csv')) ||
            (coachesReportV2Enabled && exportType === 'download_csv');

          const payloadV1 = getV1ExportPayload(
            shouldRequestCSV,
            issueTypes,
            population,
            grouping,
            hidePlayersThatLeftClub,
            state
          );

          // no_grouping is default and BE expects null
          const groupingV2: GroupingTypeV2 =
            state.grouping === 'no_grouping' ? null : state.grouping;

          const payloadV2 = getV2ExportPayload(
            shouldRequestCSV,
            groupingV2,
            hidePlayersThatLeftClub,
            state
          );

          // fetch coaches report v1
          const fetchCoachesReport = () => {
            return getCoachesReport(payloadV1);
          };

          // fetch coaches report V2
          const fetchCoachesReportV2 = () => {
            return getCoachesReportV2(payloadV2);
          };

          const fetchReport = coachesReportV2Enabled
            ? fetchCoachesReportV2
            : fetchCoachesReport;

          fetchReport()
            .then((data) => {
              handleSuccessfulExport(
                updateStatus,
                shouldRequestCSV,
                data,
                state
              );
            })
            .catch((error) => {
              const { status, title, description } = getErrorToast(error);

              updateStatus(status, title, description);
            });
        }}
        onCancel={closeSettings}
      >
        <SquadSelectorField
          defaultValue={[
            {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [],
              squads:
                squads && squads !== undefined && squads.length > 0
                  ? [squads[0]]
                  : [],
              context_squads:
                squads && squads !== undefined && squads.length > 0
                  ? [squads[0]]
                  : [],
            },
          ]}
        />

        <ExportSettings.Field
          fieldKey="grouping"
          defaultValue="no_grouping"
          isCached
        >
          {({ value, onChange }) => (
            <Select
              label={t('Grouping')}
              options={[...getDynamicGroupingOptions(coachesReportV2Enabled)]}
              value={value}
              onChange={onChange}
            />
          )}
        </ExportSettings.Field>
        {!coachesReportV2Enabled && (
          <ExportSettings.Field
            fieldKey="sort_key"
            defaultValue="name"
            isCached
          >
            {({ value, onChange }) => (
              <Select
                label={t('Sorting')}
                options={[
                  {
                    value: 'name',
                    label: t('A - Z'),
                  },
                  {
                    value: 'date',
                    label: t('Onset date'),
                  },
                ]}
                value={value}
                onChange={onChange}
              />
            )}
          </ExportSettings.Field>
        )}
        {coachesReportV2Enabled && (
          <Box
            sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}
            data-testid="coachesReportV2ExportControls"
          >
            <FormControl>
              <FormLabel id="exportTypeLabel">{t('Export as')}</FormLabel>
              <RadioGroup
                aria-labelledby="exportTypeLabel"
                name="radio-buttons-group"
                row
              >
                <FormControlLabel
                  value="csv"
                  checked={exportType === 'download_csv'}
                  control={<Radio />}
                  label={t('CSV')}
                  onClick={() => setExportType('download_csv')}
                />
                <FormControlLabel
                  value="json"
                  checked={exportType === 'download_pdf'}
                  control={<Radio />}
                  label={t('PDF')}
                  onClick={() => setExportType('download_pdf')}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        <ExportSettings.CommonFields.CheckboxList
          fieldKey="columns"
          label={t('Columns')}
          defaultValue={['athlete', 'issue_name', 'onset_date']}
          items={
            coachesReportV2Enabled
              ? columnsV2
              : [
                  {
                    value: 'athlete',
                    label: t('Player Name'),
                    isDisabled: true,
                  },
                  {
                    value: 'issue_name',
                    label: t('Issue Name'),
                  },
                  {
                    value: 'onset_date',
                    label: t('Onset Date'),
                  },
                  {
                    value: 'player_id',
                    label: t('Player ID'),
                  },
                  {
                    value: 'jersey_number',
                    label: t('Jersey Number'),
                  },
                  {
                    value: 'position',
                    label: t('Position'),
                  },
                  {
                    value: 'pathology',
                    label: t('Pathology'),
                  },
                  {
                    value: 'body_part',
                    label: t('Body Part'),
                  },
                  {
                    value: 'side',
                    label: t('Side'),
                  },
                  {
                    value: 'comment',
                    label: t('Comment'),
                  },
                  ...(coachesReportV2Enabled
                    ? [
                        {
                          value: 'note',
                          label: t('Note'),
                        },
                      ]
                    : []),

                  {
                    value: 'injury_status',
                    label: t('Injury Status'),
                  },
                  {
                    value: 'latest_note',
                    label: t('Latest Note'),
                  },
                ]
          }
          isCached
        />

        <ExportSettings.CommonFields.CheckboxList
          fieldKey="extraSettings"
          label={t('Settings')}
          defaultValue={['exclude_uninjured_players', 'row_styling']}
          items={defaultSettings}
          isCached
        />
      </ExportSettings>

      {isReportActive && (
        <Printable>
          <CoachesReportTemplate
            organisationLogo={organisation?.logo_full_path}
            organisationName={organisation?.name || ''}
            reportTitle={titleText}
            columns={coachesReportData.columns}
            reportData={coachesReportData.report || { groupingType: 'single' }}
            rowStyling={coachesReportData.rowStyling}
            labels={{
              jersey_number: '#',
              position: t('Pos'),
              player_id: t('Player Id'),
              side: t('Side'),
              body_part: t('Body Part'),
              issue_name: t('Issue Name'),
              onset_date: t('Onset Date'),
              pathology: t('Pathology'),
              injury_status: t('Status'),
              latest_note: t('Latest Note'),
              comment: t('Comment'),
              ...(coachesReportV2Enabled && { note: t('Note') }),
            }}
            categoryLabels={{
              athlete: t('Player'),
              Out: t('Out'),
              Limited: t('Limited'),
              Full: t('Full'),
            }}
          />
        </Printable>
      )}
    </>
  );
};

export const CoachesReportTranslated: ComponentType<Props> =
  withNamespaces()(CoachesReport);
export default CoachesReport;
