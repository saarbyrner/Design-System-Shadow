// @flow
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  AthleteDemographicData,
  DemographicReportAllowedColumns,
} from '@kitman/services/src/services/exports/exportDemographicReport';
import type { ReportData } from '../AthleteDemographicReport';

const transformAthlete = (
  athlete: AthleteDemographicData,
  showSeverity: boolean
) => {
  const hasAllergies = athlete.allergies && athlete.allergies.length > 0;
  let updatedAllergies = null;
  if (hasAllergies) {
    updatedAllergies = athlete.allergies
      ?.map((allergy) => {
        if (showSeverity) {
          return `${allergy.display_name} [${allergy.severity}]`;
        }
        return allergy.display_name;
      })
      .join(', ');
  }

  const hasAlerts =
    athlete.athlete_medical_alerts && athlete.athlete_medical_alerts.length > 0;
  let updatedAlerts = null;
  if (hasAlerts) {
    updatedAlerts = athlete.athlete_medical_alerts
      ?.map((alert) => {
        if (showSeverity) {
          return `${alert.display_name} [${alert.severity}]`;
        }
        return alert.display_name;
      })
      .join(', ');
  }

  return {
    ...athlete,
    allergies: updatedAllergies,
    athlete_medical_alerts: updatedAlerts,
  };
};

export const demographicReport = (
  fullReportTitle: string,
  exportData: ReportData,
  labels: { [DemographicReportAllowedColumns]: string },
  onError: Function,
  onSuccess: Function
) => {
  const showSeverity = exportData.extraSettings.includes('show_severity');
  const underscoredTitle = fullReportTitle.replace(/\s/g, '_');
  downloadCSV(
    underscoredTitle,
    exportData.athletes,
    {
      transforms: (athlete) => transformAthlete(athlete, showSeverity),
      fields: exportData.columns.map((column) => {
        switch (column) {
          case 'fullname':
            return {
              label: labels[column],
              // TODO: Remove this NFL name order requirement. Want to use fullname in future to respect org order.
              value: (row) => `${row.lastname}, ${row.firstname}`,
            };
          case 'dob_short': {
            return {
              label: labels[column],
              value: (row) =>
                row.dob_short
                  ? DateFormatter.formatShort(moment(row.dob_short))
                  : null,
            };
          }
          default:
            return {
              label: labels[column],
              value: column,
            };
        }
      }),
    },
    onError,
    onSuccess
  );
};

export default demographicReport;
