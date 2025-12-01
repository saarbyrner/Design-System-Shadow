// @flow
import { useState } from 'react';
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Printable } from '@kitman/printing/src/renderers';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { exportDemographicReport } from '@kitman/services';
import type {
  AthleteEmergencyContactData,
  EmergencyContactsAllowedColumns,
  EmergencyContactsReport,
  EmergencyContactFieldNames,
} from '@kitman/services/src/services/exports/exportDemographicReport';
import { AthleteEmergencyContactsReport as PrintAthleteEmergencyContactsReport } from '@kitman/printing/src/templates';
import type { ExtraSettings } from '@kitman/printing/src/templates/AthleteDemographic';
import type { CheckboxListItem } from '@kitman/components/src/CheckboxList';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getErrorToast } from '../utils';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '../SquadSelectorField';
import csvProcessor from './csvProcessors/emergencyContactsReport';
import { sortEmergencyContactAthletes } from './utils/sortingHelpers';
import type { CommonSortKeys } from './types';

type Props = {
  isReportActive: boolean,
  isSettingsOpen: boolean,
  closeSettings: Function,
  printReport: Function,
  onDownloadCSVSuccess?: Function,
  squadId: ?number,
  reportTitle: string,
  reportSettingsKey: 'emergency_contacts',
  hideOptions: Array<EmergencyContactsAllowedColumns>,
  sortKeys: CommonSortKeys,
};

export type ReportData = {
  athletes: Array<AthleteEmergencyContactData>,
  athleteColumns: EmergencyContactsAllowedColumns[],
  contactColumns: EmergencyContactFieldNames[],
  extraSettings: ExtraSettings[],
  reportType: 'emergency_contacts',
};

export type ReportLabelKeys =
  | 'emergency_contacts'
  | 'jersey_number'
  | 'fullname'
  | 'contactName'
  | 'relation'
  | 'phoneNumber'
  | 'email'
  | 'address';

const defaultEContactColumns = [
  'eContact:name',
  'eContact:contact_relation',
  'eContact:phone_numbers',
  'eContact:email',
  'eContact:address',
];

const defaultColumns = ['jersey_number', 'fullname', ...defaultEContactColumns];

const getContactColumns = (
  visibleColumns: Array<any>
): Array<EmergencyContactFieldNames> => {
  const emergencyContactFieldNames: Array<EmergencyContactFieldNames> = [];
  if (visibleColumns.includes('eContact:name')) {
    emergencyContactFieldNames.push('firstname', 'lastname');
  }
  if (visibleColumns.includes('eContact:contact_relation')) {
    emergencyContactFieldNames.push('contact_relation');
  }
  if (visibleColumns.includes('eContact:phone_numbers')) {
    emergencyContactFieldNames.push('phone_numbers');
  }
  if (visibleColumns.includes('eContact:email')) {
    emergencyContactFieldNames.push('email');
  }
  if (visibleColumns.includes('eContact:address')) {
    emergencyContactFieldNames.push(
      'address_1',
      'address_2',
      'address_3',
      'city',
      'state_county',
      'zip_postal_code',
      'country'
    );
  }
  return emergencyContactFieldNames;
};

function AthleteEmergencyContactsReport(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();
  const [reportData, setReportData] = useState<ReportData>({
    athletes: [],
    athleteColumns: [],
    contactColumns: [],
    extraSettings: [],
    reportType: 'emergency_contacts',
  });

  const reportLabels: { [ReportLabelKeys]: string } = {
    emergency_contacts: props.t('Emergency Contacts'),
    jersey_number: '#',
    fullname: props.t('Name'),
    contactName: props.t('Contact name'),
    relation: props.t('Relation'),
    phoneNumber: props.t('Phone Number'),
    email: props.t('Email'),
    address: props.t('Address'),
  };

  const defaultSettings: Array<CheckboxListItem> = [
    {
      value: 'download_csv',
      label: props.t('Download CSV'),
    },
  ];

  const processData = (
    data: EmergencyContactsReport,
    athleteColumns: Array<EmergencyContactsAllowedColumns>,
    contactColumns: Array<EmergencyContactFieldNames>,
    visibleSettings: Array<any>,
    onError: Function,
    onSuccess: Function
  ) => {
    const stateObject: ReportData = {
      athletes: sortEmergencyContactAthletes(data.athletes, props.sortKeys),
      athleteColumns,
      contactColumns,
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

          const athleteColumns: Array<EmergencyContactsAllowedColumns> =
            visibleColumns.filter(
              (col) => !defaultEContactColumns.includes(col)
            );
          const contactColumns = getContactColumns(visibleColumns);
          const visibleSettings = state.extraSettings || [];

          exportDemographicReport(
            props.reportSettingsKey,
            state.population,
            [
              ...athleteColumns,
              'id',
              'firstname',
              'lastname',
              'emergency_contacts',
            ], // include kitman id for unique key and firstname and lastname for use as sorting keys
            [...contactColumns, 'id']
          )
            .then((data) => {
              if (data.report_type === 'emergency_contacts') {
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
                  athleteColumns,
                  contactColumns,
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
              value: 'eContact:name', // if on we request firstname and lastname
              label: props.t('Contact name'),
            },
            {
              value: 'eContact:contact_relation',
              label: props.t('Relation'),
            },
            {
              value: 'eContact:phone_numbers',
              label: props.t('Phone Number'),
            },
            {
              value: 'eContact:email',
              label: props.t('Email'),
            },
            {
              value: 'eContact:address', // If on we request each individual address field
              label: props.t('Address'),
            },
          ].filter((option) => !props.hideOptions.includes(option.value))}
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
          <PrintAthleteEmergencyContactsReport
            organisationLogo={organisation.logo_full_path}
            organisationName={organisation.name}
            athletes={reportData.athletes}
            athleteColumns={reportData.athleteColumns}
            contactColumns={reportData.contactColumns}
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

export const AthleteEmergencyContactsReportTranslated: ComponentType<Props> =
  withNamespaces()(AthleteEmergencyContactsReport);
export default AthleteEmergencyContactsReport;
