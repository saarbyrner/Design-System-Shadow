// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import objectToFormData from 'object-to-formdata';

import { AppStatus, LegacyModal as Modal } from '@kitman/components';
import { type ModalStatus } from '@kitman/common/src/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';
import { getImportTypeAndVendor } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';

import {
  type Event,
  type SourceFormData,
  type EventList,
  type SourceData,
  type EventData,
} from '../types';
import { transformSourceDataRequest } from '../utils';
import { SourceSelectionTranslated as SourceSelection } from './SourceSelection/index';
import { EventSelectionTranslated as EventSelection } from './EventSelection/index';
import { SummaryTranslated as Summary } from './Summary/index';

type Props = {
  event: Event,
  orgTimezone: string,
  closeModal?: Function,
  calledOutsideReact: boolean,
  trackEvent: (eventName: string, metaData: ?{}) => void,
};

type Status = 'OK' | 'ERROR' | 'LOADING' | 'SUCCESS';

type State = {
  event: Event,
  step: 'SOURCE_SELECTION' | 'EVENT_SELECTION' | 'SUMMARY',
  events: EventList,
  sourceData: SourceData,
  sourceFormData: SourceFormData,
  status: { value: Status, message: string, header: ?string },
};

class App extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      event: props.event,
      step: 'SOURCE_SELECTION',
      sourceFormData: {
        loaded: false,
        integrations: [],
        fileSources: {},
      },
      events: {
        loaded: false,
        date: '',
        data: [],
        integrationId: null,
      },
      sourceData: {
        type: 'FILE',
        fileData: { file: null, source: '' },
        isEventSelectionNeeded: false,
      },
      status: { value: 'OK', message: '', header: null },
    };

    this.handleSourceSelectionForward =
      this.handleSourceSelectionForward.bind(this);
    this.handleEventSelectionBackward =
      this.handleEventSelectionBackward.bind(this);
    this.handleEventSelectionForward =
      this.handleEventSelectionForward.bind(this);
    this.handleSummaryBackward = this.handleSummaryBackward.bind(this);
    this.submit = this.submit.bind(this);
    this.submitFailure = this.submitFailure.bind(this);
    this.handleEventDataChange = this.handleEventDataChange.bind(this);
    this.handleSourceFormDataLoad = this.handleSourceFormDataLoad.bind(this);
    this.handleEventsLoad = this.handleEventsLoad.bind(this);
    this.handleSourceDataChange = this.handleSourceDataChange.bind(this);
    this.updateAppStatus = this.updateAppStatus.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.escClose = this.escClose.bind(this);
    this.failHandler = this.failHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escClose, false);
  }

  handleSourceSelectionForward = () => {
    // it checks if it should skip event selection step
    if (this.state.sourceData.isEventSelectionNeeded) {
      this.setState({ step: 'EVENT_SELECTION' });
    } else {
      this.setState({ step: 'SUMMARY' });
    }
  };

  handleEventSelectionBackward = () => {
    this.setState({ step: 'SOURCE_SELECTION' });
  };

  handleEventSelectionForward = () => {
    this.setState({ step: 'SUMMARY' });
  };

  handleSummaryBackward = () => {
    // it checks if it should skip event selection step
    if (this.state.sourceData.isEventSelectionNeeded) {
      this.setState({ step: 'EVENT_SELECTION' });
    } else {
      this.setState({ step: 'SOURCE_SELECTION' });
    }
  };

  handleSourceDataChange = (sourceData: SourceData) => {
    this.setState({
      sourceData: Object.assign({}, sourceData, { eventData: null }),
    });
  };

  submit = () => {
    this.updateAppStatus('LOADING', `${this.props.t('Loading')}...`);

    this.props.trackEvent(
      `Calendar — ${getHumanReadableEventType(
        // $FlowIgnore[incompatible-call] the type is correct here.
        this.props.event
      )} details — Imported data — Import data`,
      getImportTypeAndVendor(this.state.sourceData)
    );
    $.ajax({
      method: 'POST',
      url: '/workloads/import_workflow/perform',
      data: this.submitFormData(),
      processData: false,
      contentType: false,
      success: (data) => this.submitSuccess(data),
      error: this.submitFailure,
    });
  };

  submitFailure = () => {
    this.updateAppStatus('ERROR', '');
  };

  handleEventDataChange = (eventData: EventData) => {
    this.setState({
      sourceData: Object.assign({}, this.state.sourceData, { eventData }),
    });
  };

  handleEventsLoad = (data: Object) => {
    this.setState({
      events: {
        loaded: data.loaded,
        integrationId: data.integrationId,
        date: data.date,
        data: data.data,
      },
      sourceData: Object.assign({}, this.state.sourceData, { eventData: null }),
    });
  };

  handleSourceFormDataLoad = (sourceFormData: SourceFormData) => {
    this.setState({ sourceFormData });
  };

  updateAppStatus = (status: Status, message: string, header: string = '') => {
    this.setState({ status: { value: status, message, header } });
  };

  escClose = (event: any) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  closeModal = () => {
    if (this.props.calledOutsideReact) {
      ReactDOM.unmountComponentAtNode(
        document.getElementById('importWorkflow')
      );
      document.removeEventListener('keydown', this.escClose, false);
    } else if (this.props.closeModal) {
      this.props.closeModal();
    }
  };

  failHandler = () => {
    this.updateAppStatus('ERROR', '');
  };

  title() {
    switch (this.state.step) {
      case 'SOURCE_SELECTION':
        return this.props.t('Import - Data Source');
      case 'EVENT_SELECTION':
        return this.props.t('Import - Session Selection');
      case 'SUMMARY':
        return this.props.t('Import - Review');
      default:
        return this.props.t('Import data');
    }
  }

  stepContent() {
    switch (this.state.step) {
      case 'SOURCE_SELECTION':
        return this.sourceSelection();
      case 'EVENT_SELECTION':
        return this.eventSelection();
      case 'SUMMARY':
        return this.summary();
      default:
        return null;
    }
  }

  sourceSelection() {
    return (
      <SourceSelection
        event={this.state.event}
        events={this.state.events}
        onEventsLoad={this.handleEventsLoad}
        onFail={this.failHandler}
        sourceFormData={this.state.sourceFormData}
        sourceData={this.state.sourceData}
        onSourceDataChange={this.handleSourceDataChange}
        onEventDataChange={this.handleEventDataChange}
        onSourceFormDataLoad={this.handleSourceFormDataLoad}
        onForward={this.handleSourceSelectionForward}
        orgTimezone={this.props.orgTimezone}
      />
    );
  }

  eventSelection() {
    return (
      <EventSelection
        event={this.state.event}
        events={this.state.events}
        sourceData={this.state.sourceData}
        onEventDataChange={this.handleEventDataChange}
        onBackward={this.handleEventSelectionBackward}
        onForward={this.handleEventSelectionForward}
        orgTimezone={this.props.orgTimezone}
      />
    );
  }

  summary() {
    if (!this.state.sourceData.eventData) return null;

    return (
      <Summary
        event={this.state.event}
        eventData={this.state.sourceData.eventData}
        sourceData={this.state.sourceData}
        sourceFormData={this.state.sourceFormData}
        onBackward={this.handleSummaryBackward}
        onForward={this.submit}
        orgTimezone={this.props.orgTimezone}
      />
    );
  }

  appStatus() {
    if (this.state.status.value === 'OK') return null;

    return (
      <AppStatus
        header={this.state.status.header}
        status={this.statusOfAppStatus()}
        close={this.closeModal}
        message={this.state.status.message}
      />
    );
  }

  importSourceSelectionFromTrainingSession(trainingSessionData: Object) {
    return trainingSessionData;
  }

  submitFormData() {
    return objectToFormData({
      event_attributes: {
        id: this.props.event.id,
        event_type: 'Event',
      },
      source_data: transformSourceDataRequest(
        this.state.sourceData,
        this.state.event
      ),
    });
  }

  submitSuccess(data: Object) {
    if (data.success) {
      const successMessage = this.props.t('Success');

      this.updateAppStatus(
        'SUCCESS',
        successMessage,
        this.props.t('Importing Data')
      );

      window.location.href = `/planning_hub/events/${this.props.event.id}#imported_data`;
      // We need to call location.reload because when the hash changes but not the rest of the url,
      // changing window.location.href doesn't load the page
      window.location.reload();
    } else {
      const errorMessage = `${this.props.t('Error')}: ${data.errors.join(
        ', '
      )}`;
      this.updateAppStatus('ERROR', errorMessage);
    }
  }

  statusOfAppStatus(): ModalStatus {
    switch (this.state.status.value) {
      case 'ERROR':
        return 'error';
      case 'LOADING':
        return 'loading';
      case 'SUCCESS':
        return 'success';
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <Modal
          isOpen
          close={this.closeModal}
          title={this.title()}
          style={{ overflow: 'visible' }}
        >
          <div className="importWorkflow">
            <div className="importWorkflow__section">{this.stepContent()}</div>
          </div>

          {this.appStatus()}
        </Modal>
      </div>
    );
  }
}

const AppWithHooks = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  return <App {...props} trackEvent={trackEvent} />;
};

export const AppTranslated = withNamespaces()(AppWithHooks);
export default AppWithHooks;
