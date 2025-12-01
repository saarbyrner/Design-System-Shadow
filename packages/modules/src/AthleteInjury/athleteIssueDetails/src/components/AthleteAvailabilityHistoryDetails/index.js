// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type DetailedEvent = {
  id: number,
  date: string,
  description: string,
  injury_status_id: number,
  cause_unavailability: boolean,
};

type Props = {
  events: Array<DetailedEvent>,
  eventsDuration: Array<number>,
  unavailabilityDuration: number,
  totalDuration: number,
  isIssueClosed: boolean,
};

const AthleteAvailabilityHistoryDetails = (props: I18nProps<Props>) => {
  const renderEventDuration = (event) => (
    <span className="athleteAvailabilityHistoryDetails__duration">
      {props.t('{{issueStatusEventDuration}} days', {
        issueStatusEventDuration: props.eventsDuration[event.id],
      })}
    </span>
  );

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
      });
    }

    return date.format('D MMM YYYY');
  };

  const buildEventDetailsRows = () =>
    props.events.map((event, index) => {
      const isLastRow = props.events.length === index + 1;
      const shouldHideEventDuration = isLastRow && props.isIssueClosed;
      return (
        <div
          className="athleteAvailabilityHistoryDetails__row"
          key={`${event.injury_status_id}_${event.date}`}
        >
          <span className="athleteAvailabilityHistoryDetails__index">
            {index + 1}
          </span>
          <span className="athleteAvailabilityHistoryDetails__date">
            {formatDate(moment(event.date, DateFormatter.dateTransferFormat))}
          </span>
          <span className="athleteAvailabilityHistoryDetails__status">
            {event.description}
          </span>
          {!shouldHideEventDuration ? renderEventDuration(event) : null}
        </div>
      );
    });

  return (
    <div className="athleteAvailabilityHistoryDetails">
      {!window.featureFlags['issue-collapsable-reorder'] && (
        <h5 className="athleteIssueDetails__sectionTitle">
          {props.t('Availability History')}
        </h5>
      )}
      <div className="athleteAvailabilityHistoryDetails__table">
        <div className="athleteAvailabilityHistoryDetails__labelContainer">
          <span />
          <span className="athleteAvailabilityHistoryDetails__date">
            {props.t('Date')}
          </span>
          <span className="athleteAvailabilityHistoryDetails__status">
            {props.t('Status')}
          </span>
          <span className="athleteAvailabilityHistoryDetails__duration">
            {props.t('Duration')}
          </span>
        </div>
        {buildEventDetailsRows()}
      </div>
      <div className="athleteAvailabilityHistoryDetails__total">
        <span className="athleteAvailabilityHistoryDetails__totalLabel athleteAvailabilityHistoryDetails__totalLabel--first">
          {props.t('Total Unavailability')}
        </span>
        <span className="athleteAvailabilityHistoryDetails__totalValue athleteAvailabilityHistoryDetails__totalValue--first">
          {props.t('{{totalUnavailability}} days', {
            totalUnavailability: props.unavailabilityDuration,
          })}
        </span>
        <span className="athleteAvailabilityHistoryDetails__totalLabel">
          {props.t('Total Duration')}
        </span>
        <span className="athleteAvailabilityHistoryDetails__totalValue">
          {props.t('{{totalDuration}} days', {
            totalDuration: props.totalDuration,
          })}
        </span>
      </div>
    </div>
  );
};

export const AthleteAvailabilityHistoryDetailsTranslated = withNamespaces()(
  AthleteAvailabilityHistoryDetails
);
export default AthleteAvailabilityHistoryDetails;
