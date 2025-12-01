// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { Printable } from '@kitman/printing/src/renderers';
import { MedicationReports as MedicationReportTemplate } from '@kitman/printing/src/templates';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';
import { organisationAssociations } from '@kitman/common/src/variables';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { getMedicationsReport } from '@kitman/services/src/services/medical';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import { DatePicker } from '@kitman/components';
import type { MedicationsReport } from '@kitman/services/src/services/medical/getMedicationsReport';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import { transforms } from 'json2csv';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../../../../../rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';

type Props = {
  athleteId?: ?number,
  squadId?: number,
  exportType: 'pdf' | 'csv',
  isReportActive: boolean,
  printReport: Function,
  isSettingsOpen: boolean,
  closeSettings: Function,
  reportSettingsKey: string,
};

type MedicationReportData = {
  date: {
    start_date: string,
    end_date: string,
  },
  report: MedicationsReport,
};
function MedicationReport(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();
  const [medicationReportData, setMedicationReportData] =
    useState<MedicationReportData>({
      date: {
        start_date: moment().format(dateTransferFormat),
        end_date: moment().format(dateTransferFormat),
      },
      report: {},
    });
  const [formState, setFormState] = useState({});

  const defaultSettings: Array<CheckboxListItem> = [
    {
      value: 'include_all_active',
      label: props.t('Include all active medications'),
    },
  ];

  const CsvExportFn = useCSVExport(
    `MedicationsReport_${DateFormatter.formatShort(moment())}`,
    Object.values(medicationReportData?.report.medications || []),
    {
      transforms: transforms.unwind([{ paths: 'squads' }]),
      fields: [
        {
          label: props.t('Player Name'),
          value: 'athlete.fullname',
          labelValue: 'player_name',
        },
        {
          label: props.t('Reason'),
          value: (row) => row?.issues?.full_pathology,
          labelValue: 'reason',
        },
        {
          label: props.t('Medication'),
          value: (row) => row?.display_name || row?.drug?.name,
          labelValue: 'medication',
        },
        {
          label: props.t('Date'),
          value: (row) =>
            DateFormatter.formatShort(moment(row?.prescription_date)),
          labelValue: 'prescription_date',
        },
        {
          label: props.t('NFL Player ID'),
          value: 'athlete.nfl_id',
          labelValue: 'nfl_id',
        },
        {
          label: props.t('Injury Date'),
          value: (row) =>
            DateFormatter.formatShort(moment(row?.issues?.occurrence_date)),
          labelValue: 'injury_date',
        },
        {
          label: props.t('Dosage'),
          labelValue: 'dosage',
          value: (row) =>
            row.drug?.med_strength != null ||
            row.drug?.med_strength_unit != null
              ? `${row.drug?.med_strength} ${row.drug?.med_strength_unit}`
              : '', // TODO: EU meds do not have these properties yet
        },
        {
          label: props.t('Quantity'),
          value: 'quantity',
          labelValue: 'quantity',
        },
        {
          label: props.t('Type'),
          value: 'source',
          labelValue: 'type',
        },
        {
          label: props.t('Dispenser'),
          value: (row) =>
            row?.external_prescriber_name || row?.prescriber?.fullname,

          labelValue: 'external_prescriber_name',
        },
      ].filter((field) => formState.columns?.includes(field.labelValue)),
    }
  );

  useEffect(() => {
    // makes sure all data is loaded
    if (Object.keys(medicationReportData.report).length) {
      if (props.exportType === 'pdf') {
        props.printReport();
      } else {
        CsvExportFn();
      }
    }
  }, [medicationReportData.report]);

  const excludeOptions =
    organisation.association_name === organisationAssociations.nfl
      ? []
      : ['nfl_id'];

  return (
    <>
      <ExportSettings
        title={props.t('Medication report')}
        isOpen={props.isSettingsOpen}
        onSave={(state, updateStatus) => {
          setFormState(state);
          props.closeSettings();
          updateStatus(
            'LOADING',
            props.t('Loading'),
            props.t('Loading medication report data')
          );

          const dateRange = {
            start_date: moment(state.startDate).format(dateTransferFormat),
            end_date: moment(state.endDate).format(dateTransferFormat),
          };
          let allData = [];
          const loadData = () => {
            getMedicationsReport({
              filters: {
                population: state.population,
                report_range: dateRange,
                include_all_active:
                  state.extraSettings?.includes('include_all_active'),
                archived: false,
              },
            })
              .then((data) => {
                allData = [...allData, ...data.medications];
                setMedicationReportData({
                  ...medicationReportData,
                  report: { medications: allData },
                });
                updateStatus(
                  'SUCCESS',
                  props.t('Success'),
                  props.t('Report loaded successfully')
                );
              })
              .catch(() => {
                updateStatus(
                  'ERROR',
                  props.t('Error'),
                  props.t(
                    'There was an error loading your report, please try again'
                  )
                );
              });
          };
          loadData();
        }}
        onCancel={props.closeSettings}
        settingsKey={props.reportSettingsKey}
      >
        {(props.squadId || props.athleteId) && (
          <SquadSelectorField
            defaultValue={[
              {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: props.athleteId ? [props.athleteId] : [],
                squads: props.squadId ? [props.squadId] : [],
                context_squads: props.squadId ? [props.squadId] : [],
              },
            ]}
            isCached={
              props.reportSettingsKey !== 'MedicationsTab|MedicationsReport'
            }
          />
        )}

        <ExportSettings.Field
          fieldKey="startDate"
          defaultValue={moment().toISOString()}
          isCached
        >
          {({ value, onChange }) => (
            <DatePicker
              label={props.t('Start Date')}
              value={value}
              onDateChange={onChange}
              kitmanDesignSystem
            />
          )}
        </ExportSettings.Field>
        <ExportSettings.Field
          fieldKey="endDate"
          defaultValue={moment().toISOString()}
          isCached
        >
          {({ value, onChange }) => (
            <DatePicker
              label={props.t('End Date')}
              value={value}
              onDateChange={onChange}
              kitmanDesignSystem
            />
          )}
        </ExportSettings.Field>
        <ExportSettings.CommonFields.CheckboxList
          defaultValue={[
            'player_name',
            'reason',
            'medication',
            'prescription_date',
          ]}
          fieldKey="columns"
          label="Columns"
          items={[
            {
              value: 'player_name',
              label: props.t('Player Name'),
              isDisabled: true,
            },
            {
              value: 'reason',
              label: props.t('Reason'),
              isDisabled: true,
            },
            {
              value: 'medication',
              label: props.t('Medication'),
              isDisabled: true,
            },
            {
              value: 'prescription_date',
              label: props.t('Date'),
              isDisabled: true,
            },
            {
              value: 'nfl_id',
              label: 'NFL Player ID ',
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
          ].filter((item) => !excludeOptions.includes(item.value))}
          isCached
        />

        <ExportSettings.CommonFields.CheckboxList
          fieldKey="extraSettings"
          label={props.t('Settings')}
          defaultValue={[]}
          items={defaultSettings}
          isCached
        />
      </ExportSettings>

      {props.isReportActive && (
        <Printable>
          <MedicationReportTemplate
            organisationLogo={organisation.logo_full_path}
            organisationName={organisation.name || ''}
            reportTitle={props.t('Medications Report')}
            medicationsReport={medicationReportData.report.medications || []}
            labels={{
              player_name: props.t('Player Name'),
              reason: props.t('Reason'),
              medication: props.t('Medication'),
              prescription_date: props.t('Date'),
              nfl_id: props.t('NFL Player ID'),
              injury_date: props.t('Injury Date'),
              dosage: props.t('Dosage'),
              quantity: props.t('Quantity'),
              type: props.t('Type'),
              external_prescriber_name: props.t('Dispenser'),
            }}
            columns={formState.columns}
          />
        </Printable>
      )}
    </>
  );
}

export const MedicationReportTranslated: ComponentType<Props> =
  withNamespaces()(MedicationReport);
export default MedicationReport;
