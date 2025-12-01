// @flow
import moment from 'moment';
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { exportTimeLossBodyPartReport } from '@kitman/services';
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
import { useGetReportColumnsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { type ReportColumn } from '@kitman/services/src/services/medical/getReportColumns';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';

type Props = {
  squadId: ?number,
  isSettingsOpen: boolean,
  isV2MultiCodingSystem: boolean,
  closeSettings: () => void,
  reportSettingsKey: string,
  onExportStartedSuccess?: () => void,
};

const TimeLossBodyPartReportExport = ({
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  isV2MultiCodingSystem,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const exportHook = useExports(null, true);
  const { data: columns = [] }: { data: ReportColumn[] } =
    useGetReportColumnsQuery('time_loss_body_part', { skip: !isSettingsOpen });

  const columnValues = useMemo(
    () => columns.map(({ value }) => value),
    [columns]
  );

  const reportTitle = t('Time Loss Report (Body Part)');
  const isForNFL = window.organisationSport === 'nfl';

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
  ];

  const onSave = (state) => {
    closeSettings();

    let visibleColumns = state.activeColumns || [];

    // Add filter as local cache may have previous values that are now unsupported
    visibleColumns = visibleColumns.filter((col) => columnValues.includes(col));

    // Sort because turning checkboxes on and off changes activeColumns order
    visibleColumns.sort(
      (a, b) => columnValues.indexOf(a) - columnValues.indexOf(b)
    );

    let issueTypes = [];
    if (state.issueType && state.issueType !== 'All') {
      issueTypes = [state.issueType];
    }

    let coding;

    if (state.bodyParts?.length > 0) {
      coding = {
        clinical_impressions: {
          body_area_ids: state.bodyParts.map(({ id }) => id),
        },
      };
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
      coding,
    };

    exportHook.exportReports(
      () =>
        exportTimeLossBodyPartReport({
          issueTypes,
          population: state.population,
          columns: [...visibleColumns],
          filters,
          format: state.exportFormat,
          includePastPlayers: state.extraSettings.includes(
            'include_past_players'
          ),
        }),
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
            showIncludeCreatedPriorClub ? ['include_created_by_prior_club'] : []
          }
          items={extraSettings}
          isCached
        />

        {isV2MultiCodingSystem ? (
          <ExportSettings.CommonFields.Mui.BodyPartsFieldMultiCodingV2
            fieldKey="bodyParts"
            label={t('Body Part')}
            multiple
            shouldResetValueOnClose
            performServiceCall={isSettingsOpen}
          />
        ) : (
          <ExportSettings.CommonFields.Mui.CIBodyParts
            fieldKey="bodyParts"
            label={t('Body Part')}
            multiple
            shouldResetValueOnClose
            performServiceCall={isSettingsOpen}
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
        {columnValues.length !== 0 && (
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
                  items={columns.map(({ value, label }) => ({
                    value,
                    label,
                  }))}
                  defaultValue={columnValues}
                  styles={{
                    padding: '6px 12px',
                    paddingBottom: '24px',
                  }}
                  isCached
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </ExportSettings>
      <ToastDialog
        toasts={exportHook.toasts}
        onCloseToast={exportHook.closeToast}
      />
    </>
  );
};

export const TimeLossBodyPartReportExportTranslated: ComponentType<Props> =
  withNamespaces()(TimeLossBodyPartReportExport);
export default TimeLossBodyPartReportExport;
