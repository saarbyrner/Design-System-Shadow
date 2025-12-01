// @flow
import { useState } from 'react';
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Printable } from '@kitman/printing/src/renderers';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { exportDemographicReport } from '@kitman/services';
import type {
  DemographicReport,
  AthleteDemographicData,
  DemographicReportAllowedColumns,
} from '@kitman/services/src/services/exports/exportDemographicReport';
import { AthleteDemographicReport as PrintAthleteDemographicReport } from '@kitman/printing/src/templates';
import type { ExtraSettings } from '@kitman/printing/src/templates/AthleteDemographic';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getErrorToast } from '../utils';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';
import csvProcessor from './csvProcessors/demographicReport';
import { sortDemographicAthletes } from './utils/sortingHelpers';
import type { CommonSortKeys } from './types';

type Props = {
  isReportActive: boolean,
  isSettingsOpen: boolean,
  closeSettings: Function,
  printReport: Function,
  onDownloadCSVSuccess?: Function,
  squadId: ?number,
  reportTitle: string,
  reportSettingsKey: 'emergency_medical' | 'x_ray_game_day',
  hideOptions: Array<DemographicReportAllowedColumns>,
  sortKeys: CommonSortKeys,
};

export type ReportData = {
  athletes: Array<AthleteDemographicData>,
  columns: DemographicReportAllowedColumns[],
  extraSettings: ExtraSettings[],
  reportType: 'emergency_medical' | 'x_ray_game_day',
};

const defaultColumns = [
  'jersey_number',
  'fullname',
  'nfl_id',
  'position_short',
  'dob_short',
  'height',
  'allergies',
  'athlete_medical_alerts',
];

const desiredColumnOrder: Array<DemographicReportAllowedColumns> = [
  'jersey_number',
  'fullname',
  'id',
  'nfl_id',
  'position',
  'position_short',
  'date_of_birth',
  'dob_short',
  'height',
  'weight_pounds',
  'weight_kilograms',
  'allergies',
  'athlete_medical_alerts',
];

const orderColumns = (a, b) =>
  desiredColumnOrder.indexOf(a) - desiredColumnOrder.indexOf(b);

function AthleteDemographicReport(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();
  const [reportData, setReportData] = useState<ReportData>({
    athletes: [],
    columns: [],
    extraSettings: [],
    reportType: props.reportSettingsKey,
  });

  const reportLabels: { [DemographicReportAllowedColumns]: string } = {
    jersey_number: '#',
    fullname: props.t('Name'),
    firstname: props.t('First Name'),
    lastname: props.t('Last Name'),
    id: props.t('Id'),
    nfl_id: props.t('NFL Id'),
    position: props.t('Position'),
    position_short: props.t('Pos'),
    date_of_birth: props.t('Date of Birth'),
    dob_short: props.t('Date of Birth'),
    height: props.t('Height'),
    weight_pounds: props.t('Weight (lbs)'),
    weight_kilograms: props.t('Weight (kg)'),
    allergies: props.t('Allergies'),
    athlete_medical_alerts: props.t('Alerts'),
  };

  const hiddenSettings = [
    ...(props.hideOptions.includes('allergies') &&
    props.hideOptions.includes('athlete_medical_alerts')
      ? ['show_severity']
      : []),
  ];

  const getDefaultSettings = (): Array<CheckboxListItem> => {
    const alwaysPresentSettings = [
      {
        value: 'download_csv',
        label: props.t('Download CSV'),
      },
    ];

    const conditionallyPresentSettings = [];

    if (!hiddenSettings.includes('show_severity')) {
      conditionallyPresentSettings.push({
        value: 'show_severity',
        label: props.t('Show Severity'),
      });
    }

    return [...conditionallyPresentSettings, ...alwaysPresentSettings];
  };

  const processData = (
    data: DemographicReport,
    visibleColumns,
    visibleSettings,
    onError: Function,
    onSuccess: Function
  ) => {
    const stateObject: ReportData = {
      athletes: sortDemographicAthletes(data.athletes, props.sortKeys),
      columns: visibleColumns,
      extraSettings: visibleSettings,
      reportType: data.report_type,
    };

    setReportData(stateObject);
    if (visibleSettings.includes('download_csv')) {
      const today = DateFormatter.formatShort(moment());
      const csvSuccess = () => {
        props.onDownloadCSVSuccess?.();
        onSuccess();
      };
      csvProcessor(
        `${props.reportTitle}_${today}`,
        stateObject,
        reportLabels,
        onError,
        csvSuccess
      ); // Pass stateObject as don't want to wait for useState change
    } else {
      props.printReport();
      onSuccess();
    }
  };

  return (
    <>
      <ExportSettings
        title={props.reportTitle}
        isOpen={props.isSettingsOpen}
        onSave={(state, updateStatus) => {
          props.closeSettings();
          updateStatus(
            'LOADING',
            props.t('Loading'),
            props.t('Loading athlete report data')
          );

          // State may include cached values from previously visible fields. Filter away
          const visibleColumns = state.activeColumns
            ? state.activeColumns.filter(
                (col) => !props.hideOptions.includes(col)
              )
            : [];

          // Sort because turning checkboxes on and off changes activeColumns order
          visibleColumns.sort(orderColumns);

          const visibleSettings = state.extraSettings
            ? state.extraSettings.filter((col) => !hiddenSettings.includes(col))
            : [];

          exportDemographicReport(
            props.reportSettingsKey,
            state.population,
            [...visibleColumns, 'id', 'firstname', 'lastname'] // include kitman id for unique key and firstname and lastname for use as sorting keys
          )
            .then((data) => {
              if (
                data.report_type === 'emergency_medical' ||
                data.report_type === 'x_ray_game_day'
              ) {
                const onProcessDataError = () =>
                  updateStatus(
                    'ERROR',
                    props.t('Error'),
                    props.t('Report failed to load')
                  );

                const onProcessDataSuccess = () =>
                  updateStatus(
                    'SUCCESS',
                    props.t('Success'),
                    props.t('Report loaded successfully')
                  );

                processData(
                  data,
                  visibleColumns,
                  visibleSettings,
                  onProcessDataError,
                  onProcessDataSuccess
                );
                return;
              }

              updateStatus(
                'ERROR',
                props.t('Error'),
                props.t('Report failed to load')
              );
            })
            .catch((error) => {
              const { status, title, description } = getErrorToast(error);

              updateStatus(status, title, description);
            });
        }}
        onCancel={props.closeSettings}
        settingsKey={props.reportSettingsKey}
      >
        <SquadSelectorField
          defaultValue={[
            {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [],
              squads: props.squadId != null ? [props.squadId] : [],
              context_squads: props.squadId != null ? [props.squadId] : [],
            },
          ]}
        />
        <ExportSettings.CommonFields.CheckboxList
          fieldKey="activeColumns"
          label={props.t('Columns')}
          defaultValue={defaultColumns}
          items={[
            {
              value: 'fullname',
              label: props.t('Player Name'),
              isDisabled: true,
            },
            {
              value: 'jersey_number',
              label: props.t('Jersey Number'),
            },
            {
              value: 'nfl_id',
              label: props.t('NFL ID'),
            },
            {
              value: 'position',
              label: props.t('Position (Full Name)'),
            },
            {
              value: 'position_short',
              label: props.t('Position (Abbreviation)'),
            },
            {
              value: 'date_of_birth',
              label: props.t('Date of Birth'),
            },
            {
              value: 'dob_short',
              label: props.t('Date of Birth'),
            },
            {
              value: 'height',
              label: props.t('Height'),
            },
            {
              value: 'weight_pounds',
              label: props.t('Weight (lbs)'),
            },
            {
              value: 'weight_kilograms',
              label: props.t('Weight (kgs)'),
            },
            {
              value: 'allergies',
              label: props.t('Allergies'),
            },
            {
              value: 'athlete_medical_alerts',
              label: props.t('Medical Alerts'),
            },
          ].filter((option) => !props.hideOptions.includes(option.value))}
          isCached
        />

        <ExportSettings.CommonFields.CheckboxList
          fieldKey="extraSettings"
          label={props.t('Settings')}
          defaultValue={[]}
          items={getDefaultSettings()}
          isCached
        />
      </ExportSettings>

      {props.isReportActive && (
        <Printable>
          <PrintAthleteDemographicReport
            organisationLogo={organisation.logo_full_path}
            organisationName={organisation.name}
            athletes={reportData.athletes}
            columns={reportData.columns}
            extraSettings={reportData.extraSettings}
            labels={reportLabels}
            generalLabels={{
              reportTitle: props.reportTitle,
            }}
          />
        </Printable>
      )}
    </>
  );
}

export const AthleteDemographicReportTranslated: ComponentType<Props> =
  withNamespaces()(AthleteDemographicReport);
export default AthleteDemographicReport;
