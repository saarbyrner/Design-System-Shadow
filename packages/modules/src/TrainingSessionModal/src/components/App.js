// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import ReactDOM from 'react-dom';
import {
  getWorkloadTypes,
  getSessionTypes,
  getEventConditions,
} from '@kitman/services';

import { AppStatus, LegacyModal as Modal } from '@kitman/components';

import type { TrainingSession as TrainingSessionEvent } from '@kitman/common/src/types/Event';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TrainingSession, TrainingSessionFormData } from '../types';

import {
  fromArrayToDropdownItems,
  transformTrainingSessionEvent,
} from '../utils';

import { TrainingSessionFormTranslated as TrainingSessionForm } from './TrainingSessionForm/index';

type Props = {
  isOpen?: boolean,
  calledOutsideReact: boolean,
  onSaveSuccess?: Function,
  closeModal?: Function,
  trainingSessionId?: number,
  event: TrainingSessionEvent,
  formMode: 'EDIT' | 'CREATE' | 'DUPLICATE',
};

type State = {
  trainingSession: TrainingSession,
  trainingSessionFormData: TrainingSessionFormData,
  requestError: boolean,
};

class App extends Component<I18nProps<Props>, State> {
  handleTrainingSesssionFormDataLoad: (data: Object) => void;

  fetchFormData: () => void;

  closeModal: () => void;

  escClose: () => void;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      trainingSession: {
        id: props.trainingSessionId || null,
        eventType: 'TRAINING_SESSION',
        date: '',
        sessionTypeId: '',
        workloadType: '',
        duration: '',
        localTimezone: '',
        gameDays: [],
        surfaceType: '',
        surfaceQuality: '',
        weather: '',
        temperature: '',
      },
      trainingSessionFormData: {
        loaded: false,
        sessionTypes: [],
        workloadTypes: [],
        surfaceTypes: [],
        surfaceQualities: [],
        weathers: [],
        temperatureUnit: 'F',
      },
      requestError: false,
    };

    this.handleTrainingSesssionFormDataLoad =
      this.handleTrainingSesssionFormDataLoad.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.escClose = this.escClose.bind(this);
    this.fetchFormData = this.fetchFormData.bind(this);
  }

  componentDidMount() {
    this.fetchFormData();
    document.addEventListener('keydown', this.escClose, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escClose, false);
  }

  escClose(event: any) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  closeModal() {
    if (this.props.calledOutsideReact) {
      ReactDOM.unmountComponentAtNode(
        document.getElementById('TrainingSessionModal')
      );
      document.removeEventListener('keydown', this.escClose, false);
    } else if (this.props.closeModal) {
      this.props.closeModal();
    }
  }

  fetchFormData() {
    if (this.state.trainingSessionFormData.loaded) return;

    Promise.all([
      getWorkloadTypes(),
      getSessionTypes(),
      getEventConditions(),
    ]).then(
      ([workloadTypes, sessionTypes, eventConditions]) =>
        this.handleTrainingSesssionFormDataLoad({
          workloadTypes,
          sessionTypes,
          eventConditions,
        }),
      () => this.setState({ requestError: true })
    );
  }

  handleTrainingSesssionFormDataLoad(data: Object) {
    this.setState({
      trainingSessionFormData: {
        loaded: true,
        sessionTypes: fromArrayToDropdownItems(data.sessionTypes),
        workloadTypes: fromArrayToDropdownItems(data.workloadTypes),
        surfaceTypes: data.eventConditions.surface_types,
        surfaceQualities: data.eventConditions.surface_qualities,
        weathers: data.eventConditions.weather_conditions,
        temperatureUnit: data.eventConditions.temperature_units,
      },
      trainingSession:
        this.props.formMode === 'EDIT'
          ? // $FlowFixMe Too many differences between the new Event type and legacy type. To fix when removing planning-session-planning
            transformTrainingSessionEvent(this.props.event)
          : this.state.trainingSession,
    });
  }

  trainingSessionForm() {
    return (
      <TrainingSessionForm
        formMode={this.props.formMode}
        trainingSession={this.state.trainingSession}
        trainingSessionFormData={this.state.trainingSessionFormData}
        calledOutsideReact={this.props.calledOutsideReact}
        onSaveSuccess={(updatedEvent) =>
          this.props.onSaveSuccess?.(updatedEvent)
        }
      />
    );
  }

  fetchTitle() {
    let action;
    switch (this.props.formMode) {
      case 'CREATE':
        action = this.props.t('New');
        break;
      case 'EDIT':
        action = this.props.t('Edit');
        break;
      // We currently only support 'CREATE' and 'EDIT' modes, but keeping this
      // for future support.
      default:
        action = this.props.formMode;
        action = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
        break;
    }

    return this.props.t(`{{action}} Session`, { action });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={
            !this.props.calledOutsideReact && this.props.isOpen !== undefined
              ? this.props.isOpen
              : true
          }
          close={this.closeModal}
          title={this.fetchTitle()}
          style={{ overflow: 'visible' }}
        >
          <div className="trainingSessionModal">
            <div className="trainingSessionModal__section">
              {this.state.trainingSessionFormData.loaded &&
                this.trainingSessionForm()}
            </div>
            {this.state.requestError && <AppStatus status="error" />}
          </div>
        </Modal>
      </div>
    );
  }
}

export const AppTranslated = withNamespaces()(App);
export default App;
