// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  Athlete,
  Availability,
  ExpandedAthlete,
  AvailabilityIssue,
} from '../../../types';

type Props = {
  athletes: Array<Athlete>,
  canViewIssues: boolean,
  canViewAbsence: boolean,
  expandedAthleteData: { string: ExpandedAthlete },
  injuryStatuses: InjuryStatuses,
};

const Body = (props: I18nProps<Props>) => {
  // Absences atm don't have statuses in the Injury Status System,
  // so we add it manually.
  const absenceStatus = {
    id: 0,
    description: props.t('Absence'),
    order: 0,
    color: '082E5A',
    cause_unavailability: true,
    restore_availability: false,
  };

  const statusMap = props.injuryStatuses.reduce((map, item) => {
    map[item.id] = item; // eslint-disable-line no-param-reassign
    return map;
  }, {});

  const availabilityPos = (
    availabilities: Array<string> | Array<Availability>,
    index: number
  ) => {
    const prevItem = availabilities[index - 1];
    const nextItem = availabilities[index + 1];
    if (
      (!prevItem && !nextItem) ||
      (prevItem === 'available' && nextItem === 'available')
    ) {
      return 'single';
    }
    if (!prevItem || prevItem === 'available') {
      return 'first';
    }
    if (!nextItem || nextItem === 'available') {
      return 'last';
    }
    return null;
  };

  const getTooltipTitle = (
    issueType: $PropertyType<AvailabilityIssue, 'type'>
  ) => {
    switch (issueType) {
      case 'injury':
      case 'illness':
        return props.t('Medical Issue');
      default:
        return props.t('Absence');
    }
  };

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const getOverviewTableRows = (
    events: $PropertyType<AvailabilityIssue, 'events'>,
    issueType: $PropertyType<AvailabilityIssue, 'type'>
  ) => {
    return (
      events.length > 0 &&
      events.map((event) => {
        const eventStatus =
          issueType !== 'absence'
            ? statusMap[event.injury_status_id]
            : { ...absenceStatus };

        return (
          <div
            className="availabilityReportTable__overviewTableRow"
            key={`status_${eventStatus.id}`}
          >
            <span className="availabilityReportTable__overviewCell availabilityReportTable__overviewCell--date">
              {formatDate(
                moment(event.event_date, DateFormatter.dateTransferFormat)
              )}
            </span>
            <span className="availabilityReportTable__overviewCell availabilityReportTable__overviewCell--description">
              <span
                className="availabilityReportTable__overviewCellColour"
                style={{
                  background: `#${eventStatus.color}`,
                }}
              />
              {eventStatus.description}
            </span>
            <span className="availabilityReportTable__overviewCell">
              {props.t('{{eventDuration}} days', {
                eventDuration: event.duration,
              })}
            </span>
          </div>
        );
      })
    );
  };

  const calculateTotalUnavailability = (
    events: $PropertyType<AvailabilityIssue, 'events'>,
    issueType: $PropertyType<AvailabilityIssue, 'type'>
  ) => {
    let count = 0;
    // total unavailability for one issue: sum of the duration of events
    // that cause unavailability
    events.forEach((event) => {
      const status =
        issueType !== 'absence'
          ? statusMap[event.injury_status_id]
          : { ...absenceStatus };
      if (status.cause_unavailability && !status.restore_availability) {
        count += event.duration;
      }
    });
    return count;
  };

  const renderIssueCellContent = (
    availability: string,
    issue: AvailabilityIssue,
    color: string
  ) => {
    if (availability !== 'available') {
      const getIssueTitle = () => {
        // need to check permissions separately to correctly return title
        // with different permission settings
        if (!props.canViewIssues && issue.type !== 'absence') {
          return null;
        }
        if (!props.canViewAbsence && issue.type === 'absence') {
          return null;
        }
        return <p>{issue.title}</p>;
      };

      return (
        <Tippy
          placement="bottom"
          content={
            <div className="availabilityReportTable__overviewTooltip">
              <h4>{getTooltipTitle(issue.type)}</h4>
              {getIssueTitle()}
              <div className="availabilityReportTable__overviewTable">
                <div className="availabilityReportTable__overviewTableHeader">
                  <span className="availabilityReportTable__overviewTableHeaderCell--date">
                    {props.t('Date')}
                  </span>
                  <span className="availabilityReportTable__overviewTableHeaderCell--status">
                    {props.t('Status')}
                  </span>
                  <span>{props.t('Duration')}</span>
                </div>
                {getOverviewTableRows(issue.events, issue.type)}
              </div>
              <div className="availabilityReportTable__overviewTotals">
                <div className="availabilityReportTable__overviewTotalsRow">
                  <span className="availabilityReportTable__overviewTotalsCell">
                    {props.t('Total Unavailability')}
                  </span>
                  <span className="availabilityReportTable__overviewTotalsCell">
                    {props.t('{{dayCount}} days', {
                      dayCount: calculateTotalUnavailability(
                        issue.events,
                        issue.type
                      ),
                    })}
                  </span>
                </div>
                <div className="availabilityReportTable__overviewTotalsRow">
                  <span className="availabilityReportTable__overviewTotalsCell">
                    {props.t('Total Duration')}
                  </span>
                  <span className="availabilityReportTable__overviewTotalsCell">
                    {issue.duration}
                  </span>
                </div>
              </div>
            </div>
          }
          theme="neutral-tooltip"
          maxWidth="none"
        >
          <span
            style={{
              backgroundColor: issue.type === 'absence' ? '#082E5A' : color,
            }}
          >
            &nbsp;
          </span>
        </Tippy>
      );
    }

    return null;
  };

  const renderIssueCells = (issue: AvailabilityIssue) => {
    return (
      issue.availabilities.length > 0 &&
      issue.availabilities.map((availability, index) => {
        let splitStatus = null;
        let statusId = null;
        if (availability !== 'available') {
          splitStatus = availability.split('_');
          statusId = splitStatus[splitStatus.length - 1];
        }

        const position = availabilityPos(issue.availabilities, index);
        return (
          <div
            className={classNames(
              'availabilityReportTable__availabilityBarsCell',
              {
                'availabilityReportTable__availabilityBarsCell--first':
                  position === 'first',
                'availabilityReportTable__availabilityBarsCell--last':
                  position === 'last',
                'availabilityReportTable__availabilityBarsCell--single':
                  position === 'single',
              }
            )}
            key={`issueBar_${index}`} // eslint-disable-line react/no-array-index-key
          >
            {renderIssueCellContent(
              availability,
              issue,
              `#${
                statusId != null && statusMap[statusId]
                  ? statusMap[statusId].color
                  : ''
              }`
            )}
          </div>
        );
      })
    );
  };

  const renderExpandedRows = (expandedAthleteData: ExpandedAthlete) => {
    const allIssues = [];
    if (expandedAthleteData.absences.length > 0) {
      expandedAthleteData.absences.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    if (expandedAthleteData.injuries.length > 0) {
      expandedAthleteData.injuries.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    if (expandedAthleteData.illnesses.length > 0) {
      expandedAthleteData.illnesses.forEach((issue) => {
        allIssues.push(issue);
      });
    }
    return (
      allIssues.length > 0 &&
      allIssues.map((issue) => (
        <div className="availabilityReportTable__row" key={issue.id}>
          {renderIssueCells(issue)}
        </div>
      ))
    );
  };

  const renderBarCells = (athlete: Athlete) => {
    return athlete.availabilities.length > 0
      ? athlete.availabilities.map((availability, index) => (
          <div
            className={classNames(
              'availabilityReportTable__availabilityBarsCell',
              {
                'availabilityReportTable__availabilityBarsCell--unavailable':
                  availability === 'unavailable',
                'availabilityReportTable__availabilityBarsCell--medicalAttention':
                  availability === 'medical_attention',
                'availabilityReportTable__availabilityBarsCell--available':
                  availability === 'available',
                'availabilityReportTable__availabilityBarsCell--first':
                  availabilityPos(athlete.availabilities, index) === 'first',
                'availabilityReportTable__availabilityBarsCell--last':
                  availabilityPos(athlete.availabilities, index) === 'last',
                'availabilityReportTable__availabilityBarsCell--single':
                  availabilityPos(athlete.availabilities, index) === 'single',
              }
            )}
            key={`bar_${index}`} // eslint-disable-line react/no-array-index-key
          >
            <span>&nbsp;</span>
          </div>
        ))
      : null;
  };

  const renderBodyRows = () => {
    return props.athletes.map((athlete) => (
      <div
        key={athlete.id}
        className={classNames('availabilityReportTable__rowWrapper', {
          'availabilityReportTable__rowWrapper--expanded':
            Object.keys(props.expandedAthleteData).indexOf(athlete.id) !== -1,
        })}
      >
        <div className="availabilityReportTable__row">
          {renderBarCells(athlete)}
        </div>
        {Object.keys(props.expandedAthleteData).indexOf(athlete.id) !== -1 && (
          <div className="availabilityReportTable__bodyRowExpansion">
            {renderExpandedRows(props.expandedAthleteData[athlete.id])}
          </div>
        )}
      </div>
    ));
  };

  return <>{renderBodyRows()}</>;
};

export const BodyTranslated = withNamespaces()(Body);
export default Body;
