// @flow
import moment from 'moment';

import { AvailabilityLabel } from '@kitman/components';
import type { IssueStatusEventResponse } from '@kitman/common/src/types/Issues';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { IssueStatusOption } from '@kitman/modules/src/AthleteInjury/types/_common';
import type { Athlete } from '@kitman/modules/src/AthleteAvailabilityList/types';

type Props = {
  athlete: Athlete,
  absenceReasons: Array<{ id: number, reason: string, order: number }>,
  issueStatusOptions: Array<IssueStatusOption>,
  canViewIssues: boolean,
  canManageIssues: boolean,
  canViewAbsences: boolean,
};

const IssueList = (props: Props) => {
  const getIssueDescription = (event: IssueStatusEventResponse) =>
    props.issueStatusOptions[event.injury_status_id]
      ? props.issueStatusOptions[event.injury_status_id - 1].description
      : '';

  const getAvailabilityLabelType = (lastStatusId: number) => {
    switch (lastStatusId) {
      case 1:
        return 'unavailable';
      case 2:
        return 'injured';
      case 3:
        return 'available';
      default:
        return 'available';
    }
  };

  const renderAvailabilityLabel = (lastStatusId: number) =>
    lastStatusId === 1 ? (
      <AvailabilityLabel
        status={getAvailabilityLabelType(lastStatusId)}
        displayText={false}
      />
    ) : null;

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const getInjuries = () =>
    props.athlete.injuries.map((injury) => {
      const lastEventId = injury.events_order
        ? injury.events_order[injury.events_order?.length - 1]
        : null;
      const lastEvent: ?IssueStatusEventResponse = injury.events?.find(
        (event) => event.id === lastEventId
      );
      return lastEvent &&
        lastEvent.injury_status_id !== 3 &&
        (props.canManageIssues || props.canViewIssues) ? (
        <div className="availabilityIssueList__issue" key={injury.id}>
          {renderAvailabilityLabel(lastEvent.injury_status_id)}
          <div className="availabilityIssueList__issueNameContainer">
            {injury.title_or_pathology}
            <span className="availabilityIssueList__lastEventDate">
              (
              {formatDate(
                moment(lastEvent.event_date, DateFormatter.dateTransferFormat)
              )}
              )
            </span>
          </div>
          <span className="availabilityIssueList__issueStatus">
            {getIssueDescription(lastEvent)}
          </span>
        </div>
      ) : null;
    });

  const getIllnesses = () =>
    props.athlete.illnesses.map((illness) => {
      const lastEventId = illness.events_order
        ? illness.events_order[illness.events_order?.length - 1]
        : null;
      const lastEvent: ?IssueStatusEventResponse = illness.events?.find(
        (event) => event.id === lastEventId
      );
      return lastEvent &&
        lastEvent.injury_status_id !== 3 &&
        (props.canManageIssues || props.canViewIssues) ? (
        <div className="availabilityIssueList__issue" key={illness.id}>
          {renderAvailabilityLabel(lastEvent.injury_status_id)}
          <div className="availabilityIssueList__issueNameContainer">
            {illness.title_or_pathology}
            <span className="availabilityIssueList__lastEventDate">
              (
              {formatDate(
                moment(lastEvent.event_date, DateFormatter.dateTransferFormat)
              )}
              )
            </span>
          </div>
          <span className="availabilityIssueList__issueStatus">
            {getIssueDescription(lastEvent)}
          </span>
        </div>
      ) : null;
    });

  const getAbsences = () =>
    props.athlete.absences.map((absence) => {
      const absenceReason =
        props.absenceReasons.find(
          (reason) => reason.id === absence.reason?.id
        ) || {};
      return (
        <div className="availabilityIssueList__issue" key={absence.id}>
          <AvailabilityLabel status="unavailable" displayText={false} />
          <div className="availabilityIssueList__issueNameContainer">
            <span className="availabilityIssueList__absenceReason">
              {absenceReason.reason}
            </span>
          </div>
          <span className="availabilityIssueList__issueStatus">
            Causing Unavailability (
            {formatDate(moment(absence.from, DateFormatter.dateTransferFormat))}
            )
          </span>
        </div>
      );
    });

  return (
    <div className="availabilityIssueList">
      {props.canViewIssues ? getInjuries() : null}
      {props.canViewIssues ? getIllnesses() : null}
      {props.canViewAbsences ? getAbsences() : null}
    </div>
  );
};

export default IssueList;
