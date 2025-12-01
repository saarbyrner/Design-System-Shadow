// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import { Printable } from '@kitman/printing/src/renderers';
import type { FullInjuryReport } from '@kitman/services/src/services/medical/getInjuryReport';
import { InjuryReports } from '@kitman/printing/src/templates';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { getInjuryReport } from '@kitman/services/src/services/medical';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import type { AvailableColumns } from '@kitman/printing/src/templates/InjuryReports/index';
import { RadioList } from '@kitman/components';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';
import { getErrorToast } from '../utils';

type Props = {
  isReportActive: boolean,
  isSettingsOpen: boolean,
  closeSettings: Function,
  printReport: Function,
  squadId: ?number,
};

type InjuryReportData = {
  report: FullInjuryReport,
  columns: AvailableColumns[],
};

const InjuryReport = ({
  isReportActive,
  isSettingsOpen,
  closeSettings,
  printReport,
  squadId,
  t,
}: I18nProps<Props>) => {
  const { data: organisation } = useGetOrganisationQuery();

  const [injuryReportData, setInjuryReportData] = useState<InjuryReportData>({
    report: {},
    columns: [],
  });

  return (
    <>
      <ExportSettings
        title={t('Injury Report')}
        isOpen={isSettingsOpen}
        settingsKey="RosterOverview|InjuryReport"
        onSave={(state, updateStatus) => {
          closeSettings();
          updateStatus(
            'LOADING',
            t('Loading'),
            t('Loading injury report data')
          );
          const issueTypes = state.issueType === 'All' ? [] : [state.issueType];
          const population = state.population;

          getInjuryReport({ issueTypes, population })
            .then((data) => {
              updateStatus(
                'SUCCESS',
                t('Success'),
                t('Report loaded successfully')
              );
              setInjuryReportData({
                date: moment(state.date).format(dateTransferFormat),
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
        {window.featureFlags['injury-report-issue-type-field'] && (
          <ExportSettings.Field
            fieldKey="issueType"
            defaultValue="All"
            isCached
          >
            {({ value, onChange }) => (
              <RadioList
                radioName="RosterOverview|InjuryReport|IssueType"
                label={t('Issue Type')}
                value={value}
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
                change={onChange}
                kitmanDesignSystem
              />
            )}
          </ExportSettings.Field>
        )}
        <ExportSettings.CommonFields.CheckboxList
          fieldKey="columns"
          label={t('Columns')}
          defaultValue={['athlete_name', 'issue_name', 'onset_date']}
          items={[
            {
              value: 'athlete_name',
              label: t('Athlete Name'),
              isDisabled: true,
            },
            {
              value: 'issue_name',
              label: t('Issue Name'),
              isDisabled: true,
            },
            {
              value: 'onset_date',
              label: t('Onset Date'),
              isDisabled: true,
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
              value: 'injury_status',
              label: t('Injury Status'),
            },
            {
              value: 'latest_note',
              label: t('Latest Note'),
            },
          ]}
          isCached
        />
      </ExportSettings>

      {isReportActive && (
        <Printable>
          <InjuryReports
            organisationLogo={organisation?.logo_full_path}
            organisationName={organisation?.name}
            columns={injuryReportData.columns}
            injuryReport={injuryReportData.report || {}}
            labels={{
              issue_name: t('Issue Name'),
              onset_date: t('Onset Date'),
              player_id: t('Player Id'),
              jersey_number: t('#'),
              position: t('Pos'),
              pathology: t('Pathology'),
              injury_status: t('Status'),
              roster: t('Roster'),
              latest_note: t('Latest Note'),
            }}
          />
        </Printable>
      )}
    </>
  );
};

export const InjuryReportTranslated: ComponentType<Props> =
  withNamespaces()(InjuryReport);
export default InjuryReport;
