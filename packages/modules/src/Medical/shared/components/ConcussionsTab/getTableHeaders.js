// @flow
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TextLink } from '@kitman/components';
import moment from 'moment';
import type {
  ColumnCellDataType,
  ConcussionInjuryCellData,
  TestHistoryCellData,
} from '@kitman/modules/src/Medical/shared/types';
import UserAvatar from '@kitman/components/src/UserAvatar';
import i18n from '@kitman/common/src/utils/i18n';
import style from './style';

import { getPathologyName } from '../../utils';

type Props = {
  athleteId?: number,
};

const getConcussionTabTableHeaders = (props: Props) => {
  const formatDateForDisplay = (date: string) => {
    return DateFormatter.formatStandard({
      date: moment(date, DateFormatter.dateTransferFormat),
      displayLongDate: true,
    });
  };

  const dateFormatter = (columnCellData: ColumnCellDataType) => {
    const dateKey = columnCellData.column.key;
    const status = columnCellData.row.status;
    let cssName = '';
    const dateValue = formatDateForDisplay(columnCellData.row[dateKey] || '');

    if (dateKey === 'expiryDate' && status === 'Expired') {
      cssName = 'expiredDate';
    } else if (dateKey === 'expiryDate' && status === 'Expiring') {
      cssName = 'expiryingDate';
    }

    return <div css={style[`${cssName}`]}>{dateValue || '-'}</div>;
  };

  const baselineStatusFormatter = (columnCellData: ColumnCellDataType) => {
    const key = columnCellData.column.key;
    const status = props.athleteId
      ? columnCellData.row.status
      : columnCellData.row[key];

    if (!status) {
      return '-';
    }

    switch (status.key) {
      case 'expired': {
        let description = status.description;
        if (props.athleteId == null) {
          description += ` - ${formatDateForDisplay(status.expiryDate || '')}`;
        }
        return (
          <span css={[style.statusPill, style.expired]}>{description}</span>
        );
      }
      case 'expiring': {
        return (
          <span css={[style.statusPill, style.expiring]}>
            {status.description}
          </span>
        );
      }
      case 'outstanding': {
        return (
          <span css={[style.statusPill, style.outstanding]}>
            {status.description}
          </span>
        );
      }
      case 'complete': {
        let description = status.description;
        if (props.athleteId == null) {
          description += ` - ${formatDateForDisplay(
            status.completionDate || ''
          )}`;
        }
        return (
          <span css={[style.statusPill, style.greyBackground]}>
            {description}
          </span>
        );
      }
      default: {
        return (
          <span css={[style.statusPill, style.greyBackground]}>
            {status.description}
          </span>
        );
      }
    }
  };

  const injuryCellStatusFormatter = (
    columnCellData: ConcussionInjuryCellData
  ) => {
    const injuryStatus = columnCellData.row.status;
    let stylingName = '';
    if (injuryStatus.cause_unavailability) {
      stylingName = 'expired';
    } else if (injuryStatus.restore_availability) {
      stylingName = 'expiring';
    }

    if (columnCellData.row.closed) {
      stylingName = 'complete';
    }
    return (
      <span css={[style.statusPill, style[`${stylingName}`]]}>
        {injuryStatus.description}
      </span>
    );
  };

  const formTypeFormatter = (columnCellData: ColumnCellDataType) => {
    const athleteId = columnCellData.row.athlete
      ? columnCellData.row.athlete.id
      : props.athleteId;

    if (athleteId != null) {
      return (
        <TextLink
          text={
            columnCellData.row.formTypeFullName || columnCellData.row.formType
          }
          href={`/medical/athletes/${athleteId}/forms/${columnCellData.row.id}`}
        />
      );
    }
    return <>{columnCellData.row.formType}</>;
  };

  const formTypeBaselineFormatter = (columnCellData: ColumnCellDataType) => {
    const athleteId = columnCellData.row.athlete
      ? columnCellData.row.athlete.id
      : props.athleteId;
    const displayBaselineName = columnCellData.row.formType.split(' - ')[0];

    if (
      athleteId != null &&
      (!columnCellData.row.status ||
        columnCellData.row.status.key !== 'outstanding')
    ) {
      return (
        <TextLink
          text={displayBaselineName}
          href={`/medical/athletes/${athleteId}/forms/${columnCellData.row.id}`}
        />
      );
    }
    return <>{displayBaselineName}</>;
  };

  const injuryFormatter = (columnCellData: ConcussionInjuryCellData) => {
    const athleteId = columnCellData.row.athlete
      ? columnCellData.row.athlete.id
      : props.athleteId;

    let injuryName = columnCellData.row.issue;

    if (props.athleteId == null) {
      injuryName = `${formatDateForDisplay(
        columnCellData.row.occurrenceDate
      )} - ${injuryName}`;
    }

    if (athleteId != null) {
      return (
        <TextLink
          text={injuryName}
          href={`/medical/athletes/${athleteId}/injuries/${columnCellData.row.id}`}
        />
      );
    }
    return <>{columnCellData.row.issue}</>;
  };

  const timeLossFormatter = (columnCellData: ConcussionInjuryCellData) => {
    if (columnCellData.row.unavailableDuration == null) {
      return <>-</>;
    }
    return <>{`${columnCellData.row.unavailableDuration} ${i18n.t('days')}`}</>;
  };

  const linkConcussionInjury = (columnCellData: TestHistoryCellData) => {
    const athleteId = columnCellData.row.athlete
      ? columnCellData.row.athlete.id
      : props.athleteId;
    if (athleteId != null && columnCellData.row.linkedIssue) {
      const linkededInjury = columnCellData.row.linkedIssue;
      const linkedIssueName = `${formatDateForDisplay(
        linkededInjury.injury_occurrence.occurrence_date
      )} - ${getPathologyName(linkededInjury.injury)}`;

      return (
        <TextLink
          text={linkedIssueName}
          href={`/medical/athletes/${athleteId}/injuries/${columnCellData.row.linkedIssue.injury_occurrence.id}`}
        />
      );
    }
    return <>-</>;
  };

  const concussionResultFormatter = (columnCellData: TestHistoryCellData) => {
    return columnCellData.row.concussionDiagnosed ? (
      <>{columnCellData.row.concussionDiagnosed.description}</>
    ) : (
      <>-</>
    );
  };
  const athleteFormatter = (columnCellData: ColumnCellDataType) => {
    const athleteData = columnCellData.row.athlete;
    if (athleteData == null) {
      return '-';
    }
    return (
      <div css={props.athleteId ? style.athleteCell : style.athleteRosterCell}>
        <div css={style.imageContainer}>
          <UserAvatar
            url={athleteData.avatar_url}
            firstname={athleteData.firstname}
            lastname={athleteData.lastname}
            displayInitialsAsFallback={false}
            size="MEDIUM"
            availability={athleteData.availability}
            statusDotMargin={-1}
          />
        </div>
        <div css={style.detailsContainer}>
          <TextLink
            text={athleteData.fullname}
            href={`/medical/athletes/${athleteData.id}`}
          />

          <span css={style.position}>
            {typeof athleteData.position === 'object'
              ? athleteData.position.name
              : athleteData.position}
          </span>
        </div>
      </div>
    );
  };

  const concussionHeaders = [
    {
      key: 'occurrenceDate',
      name: i18n.t('Date of concussion'),
      formatter: dateFormatter,
    },
    {
      key: 'issue',
      name: i18n.t('Issue'),
      formatter: injuryFormatter,
    },
    {
      key: 'status',
      name: i18n.t('Status'),
      formatter: injuryCellStatusFormatter,
    },
    {
      key: 'resolutionDate',
      name: i18n.t('Resolution date'),
      formatter: dateFormatter,
    },
    {
      key: 'unavailableDuration',
      name: i18n.t('Time loss'),
      formatter: timeLossFormatter,
    },
  ];

  const concussionHeadersRoster = [
    {
      key: 'athlete',
      name: i18n.t('Athlete'),
      formatter: athleteFormatter,
    },
    {
      key: 'issue',
      name: i18n.t('Issue'),
      formatter: injuryFormatter,
    },
    {
      key: 'unavailableDuration',
      name: i18n.t('Time loss'),
      formatter: timeLossFormatter,
    },
  ];

  const baselineHeaders = [
    {
      key: 'formType',
      name: i18n.t('Test'),
      formatter: formTypeBaselineFormatter,
    },
    {
      key: 'status',
      name: i18n.t('Status'),
      formatter: baselineStatusFormatter,
    },
    {
      key: 'completionDate',
      name: i18n.t('Date Completed'),
      formatter: dateFormatter,
    },
    {
      key: 'expiryDate',
      name: i18n.t('Expiry Date'),
      formatter: dateFormatter,
    },
    {
      key: 'editorFullName',
      name: i18n.t('Examiner'),
    },
  ];

  const baselineHeadersRosterView = [
    {
      key: 'athlete',
      name: i18n.t('Athlete'),
      formatter: athleteFormatter,
    },
  ];

  const testHistoryHeaders = [
    {
      key: 'completionDate',
      name: i18n.t('Date'),
      formatter: dateFormatter,
    },
    {
      key: 'formType',
      name: i18n.t('Test type'),
      formatter: formTypeFormatter,
    },
    {
      key: 'editorFullName',
      name: i18n.t('Examiner'),
    },
    {
      key: 'result',
      name: i18n.t('Result'),
      formatter: concussionResultFormatter,
    },
    {
      key: 'linkedIssue',
      name: i18n.t('Linked issue'),
      formatter: linkConcussionInjury,
    },
  ];

  return {
    concussionHeaders,
    concussionHeadersRoster,
    baselineHeaders,
    baselineHeadersRosterView,
    testHistoryHeaders,
    baselineStatusFormatter,
  };
};

export default getConcussionTabTableHeaders;
