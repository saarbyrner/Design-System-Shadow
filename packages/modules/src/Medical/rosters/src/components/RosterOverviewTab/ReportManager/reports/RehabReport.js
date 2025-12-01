// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { Printable } from '@kitman/printing/src/renderers';
import type { FullRehabReport } from '@kitman/services/src/services/medical/getRehabReport';
import { RehabReport as PrintRehabReport } from '@kitman/printing/src/templates';
import type { AvailableColumns } from '@kitman/printing/src/templates/RehabReport';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { getRehabReport } from '@kitman/services/src/services/medical';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import { DatePicker } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getErrorToast } from '../utils';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';

type Props = {
  isReportActive: boolean,
  isSettingsOpen: boolean,
  closeSettings: Function,
  printReport: Function,
  squadId: ?number,
};

type RehabReportData = {
  date: {
    start_date: string,
    end_date: string,
  },
  report: FullRehabReport,
  columns: AvailableColumns[],
};

const RehabReport = ({
  isReportActive,
  isSettingsOpen,
  closeSettings,
  printReport,
  squadId,
  t,
}: I18nProps<Props>) => {
  const { data: organisation } = useGetOrganisationQuery();

  const [rehabReportData, setRehabReportData] = useState<RehabReportData>({
    date: {
      start_date: moment().format(dateTransferFormat),
      end_date: moment().format(dateTransferFormat),
    },
    report: [],
    columns: [],
  });

  return (
    <>
      <ExportSettings
        title={t('Rehab report')}
        isOpen={isSettingsOpen}
        onSave={(state, updateStatus) => {
          closeSettings();
          updateStatus('LOADING', t('Loading'), t('Loading rehab report data'));
          const date = {
            start_date: moment(state.date).format(dateTransferFormat),
            end_date: moment(state.date).format(dateTransferFormat),
          };

          const squadParams = window.featureFlags['rehab-report-enhancements']
            ? { population: state.population }
            : { squad_ids: state.squadIds };

          getRehabReport({
            ...squadParams,
            ...date,
          })
            .then((data) => {
              updateStatus(
                'SUCCESS',
                t('Success'),
                t('Report loaded successfully')
              );
              setRehabReportData({
                date,
                report: data,
                columns: state.columns,
              });
              printReport();
            })
            .catch((error) => {
              const { status, title, description } = getErrorToast(error);

              updateStatus(status, title, description);
            });
        }}
        onCancel={closeSettings}
        settingsKey="RehabReport"
      >
        <ExportSettings.Field
          fieldKey="date"
          defaultValue={moment().toISOString()}
          shouldResetValueOnClose
        >
          {({ value, onChange }) => (
            <DatePicker
              label={t('Date')}
              value={value}
              onDateChange={onChange}
              kitmanDesignSystem
            />
          )}
        </ExportSettings.Field>

        {window.featureFlags['rehab-report-enhancements'] && (
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
        )}

        {squadId && !window.featureFlags['rehab-report-enhancements'] ? (
          <ExportSettings.CommonFields.Squads
            fieldKey="squadIds"
            defaultValue={[squadId]}
            isMulti
            isCached
          />
        ) : null}
        <ExportSettings.CommonFields.CheckboxList
          fieldKey="columns"
          label={t('Columns')}
          defaultValue={['player_name', 'exercise_name']}
          items={[
            {
              value: 'player_name',
              label: t('Player Name'),
              isDisabled: true,
            },
            {
              value: 'exercise_name',
              label: t('Exercise name and variations'),
              isDisabled: true,
            },
            {
              value: 'exercise_comments',
              label: t('Exercise comments'),
            },
            {
              value: 'rehab_notes',
              label: t('Rehab notes'),
            },
            {
              value: 'injury_name',
              label: t('Injury name'),
            },
            {
              value: 'injury_date',
              label: t('Date of injury'),
            },
            {
              value: 'body_area',
              label: t('Body area'),
            },
            {
              value: 'body_side',
              label: t('Body side'),
            },
            {
              value: 'post_injury_days',
              label: t('Post injury days'),
            },
            {
              value: 'injury_status',
              label: t('Availability status'),
            },
            {
              value: 'blank_comment',
              label: t('Comment'),
            },
            {
              value: 'maintenance_exercises',
              label: t('Maintenance Exercises'),
            },
            {
              value: 'maintenance_reason',
              label: t('Reason'),
            },
          ]}
          isCached
        />
      </ExportSettings>
      {isReportActive && (
        <Printable>
          <PrintRehabReport
            organisationLogo={organisation?.logo_full_path}
            organisationName={organisation?.name}
            athletes={rehabReportData.report || []}
            startDate={rehabReportData.date.start_date}
            endDate={rehabReportData.date.end_date}
            columns={rehabReportData.columns}
            zeroIndexedDate={
              !window.featureFlags['rehab-post-injury-day-index']
            }
            labels={{
              rehabReport: t('Rehab Report'),
              athleteRehabPlans: t('{{num}} Athlete rehab plans', {
                num: rehabReportData.report.length,
              }),
              maintenance: t('Maintenance'),
              athlete: t('Athlete'),
              injury: t('Injury/ Illness'),
              rehab: t('Rehab'),
              day: t('Day'),
              comment: t('Comment'),
            }}
          />
        </Printable>
      )}
    </>
  );
};

export const RehabReportTranslated: ComponentType<Props> =
  withNamespaces()(RehabReport);
export default RehabReport;
