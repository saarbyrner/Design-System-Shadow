// @flow
import moment from 'moment-timezone';
import i18n from '@kitman/common/src/utils/i18n';
import type { SessionExerciseCopyData } from '@kitman/services/src/services/rehab/copyRehabSessionExercises';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

export type LinkType =
  | 'rehabCopy'
  | 'maintenanceCopy'
  | 'maintenanceLinkedToInjury';

const getLinkValue = (
  mode: LinkType,
  selectedAthleteId: number,
  firstDate: ?string,
  sessionExercise: SessionExerciseCopyData
) => {
  let linkValue = `/medical/athletes/${selectedAthleteId}`;
  if (sessionExercise.issue_type) {
    let injuryType = 'illnesses';
    switch (sessionExercise.issue_type) {
      case 'Injury': {
        injuryType = 'injuries';
        break;
      }
      case 'ChronicInjury': {
        injuryType = 'chronic_issues';
        break;
      }
      default:
        break;
    }
    linkValue += `/${injuryType}/${sessionExercise.issue_id || ''}`;
  }

  const hashKey = mode === 'maintenanceCopy' ? '#maintenance' : '#rehab';
  if (firstDate) {
    linkValue += `?display_date=${moment(firstDate).format(
      'YYYY-MM-DD'
    )}${hashKey}`;
  } else {
    linkValue += hashKey;
  }
  return linkValue;
};

const getLinkDetails = (
  athleteName: string,
  injuryName: ?string,
  sessionExercise: SessionExerciseCopyData,
  mode: LinkType,
  currentAthleteId: number
) => {
  let linkText = '';

  const selectedAthleteId = sessionExercise.athlete_id;
  if (selectedAthleteId !== currentAthleteId) {
    linkText = `${athleteName} - `;
  }

  let injuryOrModeDisplayName;
  if (injuryName) {
    // remove date just get name from injury display name
    const splitInjuryName = injuryName.split(' - ');
    if (splitInjuryName.length) {
      injuryOrModeDisplayName = splitInjuryName[1];
    }
  } else if (mode === 'maintenanceCopy') {
    injuryOrModeDisplayName = i18n.t('Maintenance');
  }

  let firstDate;
  let formatDate;

  if (sessionExercise.destination_session_dates?.length) {
    firstDate = sessionExercise.destination_session_dates[0];

    formatDate = DateFormatter.formatStandard({
      date: moment(firstDate, DateFormatter.dateTransferFormat),
    });

    if (injuryOrModeDisplayName) {
      linkText += `${injuryOrModeDisplayName} - ${formatDate}`;
    } else {
      linkText += formatDate;
    }
  } else if (injuryOrModeDisplayName) {
    linkText += `${injuryOrModeDisplayName}`;
  }

  const getLinkTitle = (): string => {
    switch (mode) {
      case 'maintenanceLinkedToInjury':
        return i18n.t('Rehabs linked Successfully');
      case 'rehabCopy':
        return i18n.t('Rehabs added Successfully');
      case 'maintenanceCopy':
        return i18n.t('Maintenance added Successfully');
      default:
        return '';
    }
  };

  const linkTitle = getLinkTitle();

  const linkValue = getLinkValue(
    mode,
    selectedAthleteId,
    firstDate,
    sessionExercise
  );
  return { linkTitle, linkText, linkValue };
};

export default getLinkDetails;
