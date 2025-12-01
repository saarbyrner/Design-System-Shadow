// @flow

import { Component } from 'react';
import $ from 'jquery';

import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { AppStatus, TextButton } from '@kitman/components';

import type {
  Event,
  IntegrationData,
  EventList,
  EventData,
} from '@kitman/modules/src/ImportWorkflow/src/types';
import { transformEventDataResponse } from '@kitman/modules/src/ImportWorkflow/src/utils';
import { EventDateTranslated as EventDate } from '@kitman/modules/src/ImportWorkflow/src/components/EventDate';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  event: Event,
  events: EventList,
  integrationData: IntegrationData,
  onEventsLoad: Function,
  onFail: Function,
  onForward: Function,
  orgTimezone: string,
};

type State = {
  loading: boolean,
  errorMessage: string,
};

class DateBasedIntegration extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      loading: false,
      errorMessage: '',
    };

    this.handleForwardClick = this.handleForwardClick.bind(this);
  }

  handleForwardClick = () => {
    if (
      this.props.events.data.length > 0 &&
      this.props.events.integrationId === this.props.integrationData.id &&
      this.props.events.date === this.props.event.date
    ) {
      this.forward();
    } else {
      this.loadEvents();
    }
  };

  forward() {
    if (!this.state.errorMessage && this.props.events.data.length > 0) {
      this.props.onForward();
    }
  }

  loadEvents() {
    this.setState({ loading: true, errorMessage: '' });

    $.ajax({
      method: 'POST',
      url: `/workloads/integrations/${this.props.integrationData.id}/fetch_data`,
      data: JSON.stringify({ date: this.props.event.date }),
      contentType: 'application/json',
      success: (data) => this.loadEventsHandler(data),
      error: () => this.loadEventsHandler({ success: false }),
    });

    this.props.onEventsLoad({
      loaded: false,
      date: this.props.event.date,
      data: [],
    });
  }

  loadEventsHandler(data: Object) {
    this.setState({ loading: false });

    if (data.success) {
      this.loadEventsSuccess(data);
    } else {
      this.props.onFail();
    }
  }

  loadEventsSuccess(data: Object) {
    this.props.onEventsLoad({
      loaded: true,
      integrationId: this.props.integrationData.id,
      date: this.props.event.date,
      data: this.parseLoadedEvents(data.events),
    });

    if (data.events.length > 0) {
      this.forward();
    } else {
      this.setState({
        errorMessage: this.noEventsMessage(),
      });
    }
  }

  noEventsMessage() {
    const dateInOrgTimezone = moment.tz(
      this.props.event.date,
      this.props.orgTimezone
    );
    const date = window.featureFlags['standard-date-formatting']
      ? DateFormatter.formatStandard({ date: dateInOrgTimezone })
      : dateInOrgTimezone.format('DD MMM YYYY');
    return this.props.t(
      'No data found for the selected integration for the date {{date}}. Please make sure the date is correct or select a different source',
      { date }
    );
  }

  parseLoadedEvents(events: Array<Object>): Array<EventData> {
    return events.map((eventData) => transformEventDataResponse(eventData));
  }

  errorMessageContent() {
    if (this.state.errorMessage) {
      return (
        <p className="importWorkflow__errorMessage">
          {this.state.errorMessage}
        </p>
      );
    }

    return null;
  }

  appStatus() {
    if (this.state.loading) {
      return (
        <AppStatus
          status="loading"
          message={this.props.t('Loading and processing data')}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <div>
        <div className="statsports__selectedDateWrapper">
          <div className="row">
            <div className="col-md-8">
              <div className="km-form-label">
                {this.props.t('Session date and time:')}
              </div>

              <EventDate
                date={this.props.event.date}
                localTimezone={this.props.event.localTimezone}
                orgTimezone={this.props.orgTimezone}
                format="DATETIME"
              />

              {this.errorMessageContent()}
            </div>
          </div>
        </div>

        <hr className="importWorkflow__hr--full" />

        <div className="row">
          <div className="offset-md-6  col-md-6 text-right">
            <TextButton
              id="next-step"
              type="primary"
              text={this.props.t('Next')}
              onClick={this.handleForwardClick}
              iconAfter="icon-next-right"
              isDisabled={this.state.loading}
            />
          </div>
        </div>

        {this.appStatus()}
      </div>
    );
  }
}

export const DateBasedIntegrationTranslated =
  withNamespaces()(DateBasedIntegration);
export default DateBasedIntegration;
