// @flow

import type { Node } from 'react';

import { Component } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Warning from '../shared/Warning';

import type {
  Event,
  EventData,
  EventList,
  SourceData,
  ThirdPartyEvent,
} from '../../types';

type Props = {
  event: Event,
  events: EventList,
  onEventDataChange: Function,
  sourceData: SourceData,
  onBackward: Function,
  onForward: Function,
  orgTimezone: string,
};

type State = {
  expandedEventIdentifier: string,
};

class EventSelection extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      expandedEventIdentifier: '',
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
  }

  handleEventSelection = (e: Object) => {
    const eventData = this.props.events.data.find(
      (eventDataItem) =>
        (eventDataItem.event: any).uniqueIdentifier === e.target.value
    );

    if (!eventData) return;

    this.props.onEventDataChange({
      event: eventData.event,
      athletes: eventData.athletes,
      nonSetupAthletesIdentifiers: eventData.nonSetupAthletesIdentifiers,
    });
  };

  isSelected(eventData: Object) {
    if (!this.props.sourceData.eventData) return false;

    const event: ThirdPartyEvent = (this.props.sourceData.eventData.event: any);

    return event.uniqueIdentifier === eventData.event.uniqueIdentifier;
  }

  isExpanded(event: ThirdPartyEvent) {
    return event.uniqueIdentifier === this.state.expandedEventIdentifier;
  }

  isEventSelectable(eventData: Object) {
    return eventData.athletes.length > 0;
  }

  eventsRows(): Node {
    let previousEventDay = null;

    return this.props.events.data.map((eventData, index) => {
      const event: ThirdPartyEvent = (eventData.event: any);

      let dateHeader = null;
      const eventDateInOrgTimezone = moment.tz(
        event.datetime,
        this.props.orgTimezone
      );

      const eventDate = window.featureFlags['standard-date-formatting']
        ? DateFormatter.formatStandard({ date: eventDateInOrgTimezone })
        : eventDateInOrgTimezone.format('ddd, D MMM YYYY');

      if (eventDate !== previousEventDay) {
        dateHeader = (
          <tr
            className={classNames('eventSelection__tableDateHeader', {
              'eventSelection__tableDateHeader--first': index === 0,
            })}
          >
            <th>{eventDate}</th>
          </tr>
        );
      }

      previousEventDay = eventDate;

      return (
        <tbody key={event.uniqueIdentifier}>
          {dateHeader}
          <tr>
            <td>
              <input
                type="radio"
                id={`event-${event.uniqueIdentifier}`}
                value={event.uniqueIdentifier}
                checked={this.isSelected(eventData)}
                onChange={this.handleEventSelection}
                disabled={!this.isEventSelectable(eventData)}
              />
            </td>
            <td htmlFor={`event-${event.uniqueIdentifier}`}>{event.type}</td>
            <td>
              {event.duration
                ? `${Math.round(event.duration)} ${this.props.t('min')}`
                : '--'}
            </td>
            <td>
              {window.featureFlags['standard-date-formatting']
                ? DateFormatter.formatJustTime(moment(event.datetime))
                : moment(event.datetime).format('LT')}
            </td>
            <td className="text-center">
              <span
                className={this.athleteQuantityClassName(
                  eventData.athletes.length
                )}
              >
                {this.athletesQuantityContent(eventData)}
              </span>
            </td>
            <td>
              {eventData.athletes.length ? (
                <span
                  onClick={this.toggleExpand(event)}
                  className={this.expandIconClass(event)}
                />
              ) : null}
            </td>
          </tr>
          {this.expandedRow(eventData)}
        </tbody>
      );
    });
  }

  toggleExpand(event: ThirdPartyEvent) {
    return () =>
      this.setState({
        expandedEventIdentifier: this.isExpanded(event)
          ? ''
          : event.uniqueIdentifier,
      });
  }

  expandIconClass(event: ThirdPartyEvent) {
    const iconClass = this.isExpanded(event) ? 'icon-up' : 'icon-down';
    return `${iconClass} eventSelection__expandIcon`;
  }

  expandedRow(eventData: EventData) {
    if (!eventData.event || !this.isExpanded(eventData.event)) {
      return null;
    }

    return (
      <tr className="eventSelection__tableRow--expanded">
        <td colSpan="6">
          <div className="eventSelection__athleteNamesTitle">
            {this.props.t('Participants')}
          </div>
          {this.athleteNamesContent(eventData)}
        </td>
      </tr>
    );
  }

  athleteNamesContent(eventData: EventData) {
    const athleteNames = eventData.athletes
      .map((athlete) => athlete.fullname)
      .sort();
    const athleteNameItems = athleteNames.map((athleteName) => (
      <div key={athleteName} className="eventSelection__athleteName">
        {athleteName}
      </div>
    ));

    return (
      <div className="eventSelection__athleteNames">{athleteNameItems}</div>
    );
  }

  athleteQuantityClassName(quantity: number) {
    return quantity === 0
      ? 'eventSelection__athletesQuantity eventSelection__athletesQuantity--zero'
      : 'eventSelection__athletesQuantity';
  }

  missingAthletesWarning() {
    if (this.anyEventWithEmptyAthletes()) {
      return (
        <Warning
          title={this.props.t(
            '#sport_specific__No_athletes_found_for_this_session'
          )}
          description={this.props.t(
            'Please check that your athlete identifiers are correct within the manage athlete area'
          )}
        />
      );
    }

    return null;
  }

  anyEventWithEmptyAthletes() {
    return this.props.events.data.some(
      (eventData) => eventData.athletes.length === 0
    );
  }

  athletesQuantityContent(eventData: EventData) {
    return `${eventData.athletes.length} / ${
      eventData.nonSetupAthletesIdentifiers.length + eventData.athletes.length
    }`;
  }

  integrationName() {
    if (!this.props.sourceData.integrationData) {
      return null;
    }

    return this.props.sourceData.integrationData.name;
  }

  eventsTable() {
    return (
      <table className="table km-table">
        <thead>
          <tr>
            <th>{this.props.t('Import')}</th>
            <th>
              {this.props.t('{{integration}} name', {
                integration: this.integrationName(),
              })}
            </th>
            <th>{this.props.t('Duration')}</th>
            <th>{this.props.t('Session Time')}</th>
            <th className="text-center">{this.props.t('Participants')}</th>
            <th />
          </tr>
        </thead>
        {this.eventsRows()}
      </table>
    );
  }

  canProgress() {
    return this.props.sourceData.eventData !== null;
  }

  render() {
    return (
      <div className="eventSelection">
        <p className="eventSelection__instructions">
          {this.props.t('Please select the session you wish to import')}
        </p>
        <div className="eventSelection__eventsContentWrapper">
          {this.eventsTable()}

          {this.missingAthletesWarning()}
        </div>

        <hr className="importWorkflow__hr--full" />

        <div className="row">
          <div className="col-md-6">
            <TextButton
              type="secondary"
              text={this.props.t('Previous')}
              onClick={this.props.onBackward}
              isDisabled={!this.props.events.loaded}
              iconBefore="icon-next-left"
            />
          </div>

          <div className="col-md-6 text-right">
            <TextButton
              type="primary"
              text={this.props.t('Next')}
              onClick={this.props.onForward}
              isDisabled={!this.canProgress()}
              iconAfter="icon-next-right"
            />
          </div>
        </div>
      </div>
    );
  }
}

export const EventSelectionTranslated = withNamespaces()(EventSelection);
export default EventSelection;
