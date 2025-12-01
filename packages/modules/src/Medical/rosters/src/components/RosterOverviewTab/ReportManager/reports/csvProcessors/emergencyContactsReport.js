// @flow
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import { transforms } from 'json2csv';
import type { EmergencyContact } from '@kitman/services/src/services/exports/exportDemographicReport';
import type {
  ReportData,
  ReportLabelKeys,
} from '../AthleteEmergencyContactsReport';

const formatPhoneNumbers = (contact: EmergencyContact): string => {
  return contact.phone_numbers
    .map((phone) => phone.number_international)
    .join('\n');
};

const formatAddress = (contact: EmergencyContact): string => {
  const addressDetails = [
    contact.address_1,
    contact.address_2,
    contact.address_3,
    contact.city,
    contact.state_county,
    contact.zip_postal_code,
    contact.country,
  ];

  const noNulls = addressDetails.filter((detail) => detail != null);

  return noNulls.join(', ');
};

export const emergencyContactsReport = (
  fullReportTitle: string,
  exportData: ReportData,
  labels: { [ReportLabelKeys]: string },
  onError: Function,
  onSuccess: Function
) => {
  const underscoredTitle = fullReportTitle.replace(/\s/g, '_');

  const getFields = () => {
    const fields = [];

    if (exportData.athleteColumns.includes('jersey_number')) {
      fields.push({ label: labels.jersey_number, value: 'jersey_number' });
    }

    fields.push({
      label: labels.fullname,
      // TODO: Remove this NFL name order requirement. Want to use fullname in future to respect org order.
      value: (row) => `${row.lastname}, ${row.firstname}`,
    });

    if (exportData.contactColumns.includes('firstname')) {
      fields.push({
        label: labels.contactName,
        value: (row) =>
          row.emergency_contacts
            ? `${row.emergency_contacts.lastname}, ${row.emergency_contacts.firstname}`
            : null,
      });
    }
    if (exportData.contactColumns.includes('contact_relation')) {
      fields.push({
        label: labels.relation,
        value: 'emergency_contacts.contact_relation',
      });
    }

    if (exportData.contactColumns.includes('phone_numbers')) {
      fields.push({
        label: labels.phoneNumber,
        value: (row) => {
          const hasNumber = row.emergency_contacts?.phone_numbers?.length > 0;
          return hasNumber ? formatPhoneNumbers(row.emergency_contacts) : null;
        },
      });
    }

    if (exportData.contactColumns.includes('email')) {
      fields.push({
        label: labels.email,
        value: 'emergency_contacts.email',
      });
    }
    if (exportData.contactColumns.includes('address_1')) {
      fields.push({
        label: labels.address,
        value: (row) =>
          row.emergency_contacts ? formatAddress(row.emergency_contacts) : null,
      });
    }

    return fields;
  };

  downloadCSV(
    underscoredTitle,
    exportData.athletes,
    {
      transforms: transforms.unwind({
        paths: ['emergency_contacts'],
      }),
      fields: getFields(),
    },
    onError,
    onSuccess
  );
};

export default emergencyContactsReport;
