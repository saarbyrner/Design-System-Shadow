// @flow
/* eslint-disable react/sort-comp, max-statements */
import { Component } from 'react';
import $ from 'jquery';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TrackEvent } from '@kitman/common/src/utils';
import {
  AppStatus,
  DatePicker,
  Dropdown,
  FormValidator,
  InputNumeric,
  MultiSelectDropdown,
  TextButton,
  TimePicker,
} from '@kitman/components';
import { AdvancedEventOptionsTranslated as AdvancedEventOptions } from '@kitman/modules/src/AdvancedEventOptions';
import isValidTemperature from '@kitman/modules/src/AdvancedEventOptions/utils';
import type {
  CheckboxItem,
  MultiSelectDropdownItems,
} from '@kitman/components/src/types';
import { gameDaysOptions } from '@kitman/common/src/utils/workload';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import {
  type TrainingSession,
  type TrainingSessionFormData,
} from '../../types';
import { transformTrainingSessionRequest } from '../../utils';

export type Props = {
  formMode: 'EDIT' | 'CREATE',
  trainingSession: TrainingSession,
  trainingSessionFormData: TrainingSessionFormData,
  calledOutsideReact: boolean,
  onSaveSuccess: Function,
};

type State = {
  sessionTypeId: string,
  workloadType: string,
  duration: string,
  date: string,
  time: ?Object,
  defaultTime: ?Object,
  localTimezone: string,
  gameDays: Array<string>,
  requestError: boolean,
  loading: boolean,
  surfaceType: string,
  surfaceQuality: string,
  weather: string,
  temperature: string,
};

class TrainingSessionForm extends Component<I18nProps<Props>, State> {
  gameDaysOptions: MultiSelectDropdownItems;

  constructor(props: I18nProps<Props>) {
    super(props);

    const localTimezone =
      this.props.trainingSession.localTimezone ||
      document.getElementsByTagName('body')[0].dataset.timezone;

    this.state = {
      sessionTypeId: this.props.trainingSession.sessionTypeId || '',
      workloadType: this.props.trainingSession.workloadType || '',
      duration: this.props.trainingSession.duration || '',
      date: this.props.trainingSession.date
        ? moment.tz(this.props.trainingSession.date, localTimezone)
        : '',
      time: this.props.trainingSession.date
        ? moment.tz(this.props.trainingSession.date, localTimezone)
        : null,
      defaultTime: this.props.trainingSession.date
        ? null
        : moment
            .tz(localTimezone)
            .set({ hour: 12, minute: 0, second: 0, millisecond: 0 }),
      localTimezone,
      gameDays: this.props.trainingSession.gameDays || [],
      loading: false,
      requestError: false,
      surfaceType: this.props.trainingSession.surfaceType || '',
      surfaceQuality: this.props.trainingSession.surfaceQuality || '',
      weather: this.props.trainingSession.weather || '',
      temperature: this.props.trainingSession.temperature || '',
    };

    this.gameDaysOptions = gameDaysOptions();

    this.handleSessionTypeIdChange = this.handleSessionTypeIdChange.bind(this);
    this.handleWorkloadTypeChange = this.handleWorkloadTypeChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleSessionDateChange = this.handleSessionDateChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.saveSuccess = this.saveSuccess.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    this.getDisabledGameDays = this.getDisabledGameDays.bind(this);
    this.handleSurfaceTypeChange = this.handleSurfaceTypeChange.bind(this);
    this.handleSurfaceQualityChange =
      this.handleSurfaceQualityChange.bind(this);
    this.handleWeatherChange = this.handleWeatherChange.bind(this);
    this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
  }

  handleSessionTypeIdChange = (value: string) => {
    this.setState({ sessionTypeId: value });
  };

  handleWorkloadTypeChange = (value: string) => {
    this.setState({ workloadType: value });
  };

  handleDurationChange = (value: string) => {
    this.setState({ duration: value });
  };

  handleSessionDateChange = (value: Date) => {
    const date = moment(value).format('YYYY-MM-DD');
    this.setState({ date });
  };

  handleTimeChange = (value: string) => {
    this.setState({ time: value });
  };

  handleTimezoneChange = (value: string) => {
    this.setState({ localTimezone: value });
  };

  handleSurfaceTypeChange = (value: string) => {
    this.setState({ surfaceType: value });
  };

  handleSurfaceQualityChange = (value: string) => {
    this.setState({ surfaceQuality: value });
  };

  handleWeatherChange = (value: string) => {
    this.setState({ weather: value });
  };

  handleTemperatureChange = (value: string) => {
    this.setState({ temperature: value });
  };

  handleDaysChange = (checkbox: CheckboxItem) => {
    const gameDays = checkbox.checked
      ? [...this.state.gameDays, checkbox.id]
      : this.state.gameDays.filter((gameDay) => gameDay !== checkbox.id);

    this.setState({ gameDays });
  };

  handleSaveClick = () => {
    if (this.props.formMode === 'CREATE') {
      if (window.location.pathname.includes('workloads/squad')) {
        TrackEvent('workload', 'click', 'add fixture');
      }
      if (window.location.pathname.includes('fixtures')) {
        TrackEvent('fixtures list', 'click', 'add fixture');
      }
    }

    this.setState({ loading: true });

    const requestData = transformTrainingSessionRequest(this.trainingSession());

    const requestMethod = this.props.formMode === 'EDIT' ? 'PATCH' : 'POST';

    const baseUrl = '/planning_hub/events';

    const requestUrl =
      this.props.formMode === 'EDIT' && this.props.trainingSession.id
        ? `${baseUrl}/${this.props.trainingSession.id}`
        : baseUrl;

    $.ajax({
      method: requestMethod,
      url: requestUrl,
      contentType: 'application/json',
      data: JSON.stringify(requestData),
    })
      .done((response) => {
        this.saveSuccess(response);
      })
      .fail(() => {
        this.setState({ loading: false, requestError: true });
      });
  };

  saveSuccess = (data: Object) => {
    this.props.onSaveSuccess(data.event);
    if (this.props.formMode === 'CREATE') {
      window.location.href = `/planning_hub/events/${data.event.id}`;
    }
  };

  trainingSession(): TrainingSession {
    const trainingSession = {
      eventType: 'TRAINING_SESSION',
      sessionTypeId: this.state.sessionTypeId,
      workloadType: this.state.workloadType,
      duration: this.state.duration,
      date: this.state.date,
      gameDays: this.state.gameDays,
      surfaceType: this.state.surfaceType,
      surfaceQuality: this.state.surfaceQuality,
      weather: this.state.weather,
      temperature: this.state.temperature,
    };

    if (this.props.formMode === 'EDIT') {
      // $FlowFixMe
      trainingSession.id = this.props.trainingSession.id;
    }

    /*
     * Only extract the hour and minute from state.time
     * this avoids any possible issue with the time
     * moment having a different day to state.date
     */
    const dateWithTime = moment
      .tz(this.state.date, this.state.localTimezone)
      .set({
        hour: this.state.time ? this.state.time.get('hour') : '',
        minute: this.state.time ? this.state.time.get('minute') : '',
      });

    const date = dateWithTime.format(DateFormatter.dateTransferFormat);

    return {
      ...trainingSession,
      localTimezone: this.state.localTimezone,
      date,
    };
  }

  getDisabledGameDays = (): Array<string> => {
    /*
     * If one game day option is selected
     * disable all the options of the same sign
     * except the one selected
     */
    if (this.state.gameDays.length === 1) {
      if (this.state.gameDays[0].includes('-')) {
        return this.gameDaysOptions
          .map((gameDaysOption) => gameDaysOption.id)
          .filter(
            (gameDay) =>
              gameDay !== this.state.gameDays[0] && gameDay.includes('-')
          );
      }

      if (this.state.gameDays[0].includes('+')) {
        return this.gameDaysOptions
          .map((gameDaysOption) => gameDaysOption.id)
          .filter(
            (gameDay) =>
              gameDay !== this.state.gameDays[0] && gameDay.includes('+')
          );
      }
    }

    /*
     * If two game day options are selected
     * disable all the options except the selected ones
     */
    if (this.state.gameDays.length >= 2) {
      return this.gameDaysOptions
        .map((gameDaysOption) => gameDaysOption.id)
        .filter((gameDay) => !this.state.gameDays.includes(gameDay));
    }

    return [];
  };

  optionalFields() {
    let optionalFields = [
      'advanced_option_surface_type',
      'duration',
      'surfaceType',
      'surfaceQuality',
      'weather',
    ];
    const isTemperatureFilled = !!this.state.temperature;

    if (!isTemperatureFilled) {
      optionalFields = [...optionalFields, 'temperature'];
    }

    return optionalFields;
  }

  render() {
    return (
      <FormValidator
        successAction={() => {
          this.handleSaveClick();
        }}
        inputNamesToIgnore={this.optionalFields()}
        customValidation={(input) => {
          if (input.attr('name') === 'temperature') {
            return isValidTemperature(
              input.val(),
              this.props.trainingSessionFormData.temperatureUnit
            );
          }
          return true;
        }}
      >
        <div className="trainingSessionModalForm">
          <div className="row">
            <div className="col-md-5 trainingSessionModalForm__workloadTypeGroup">
              <Dropdown
                name="workloadType"
                label={this.props.t('Workload')}
                items={this.props.trainingSessionFormData.workloadTypes}
                onChange={this.handleWorkloadTypeChange}
                value={this.state.workloadType.toString()}
              />
            </div>
          </div>

          <div className="trainingSessionModalForm__formSeparator" />

          <div className="row">
            <div className="col-md-5 trainingSessionModalForm__sessionTypeGroup">
              <Dropdown
                name="sessionType"
                label={this.props.t('Session Type')}
                items={this.props.trainingSessionFormData.sessionTypes}
                onChange={this.handleSessionTypeIdChange}
                value={this.state.sessionTypeId.toString()}
                searchable
              />
            </div>
          </div>

          <br />

          <div className="row">
            <div className="col-md-3">
              <DatePicker
                name="date"
                label={this.props.t('Date')}
                onDateChange={this.handleSessionDateChange}
                value={this.state.date || null}
                disabled={this.props.formMode === 'EDIT'}
              />
            </div>
            <div className="col-md-3">
              <TimePicker
                value={this.state.time}
                onChange={this.handleTimeChange}
                disabled={this.props.formMode === 'EDIT'}
                defaultOpenValue={this.state.defaultTime}
              />
            </div>

            <div className="col-md-3">
              <Dropdown
                name="timezone"
                label={this.props.t('Timezone')}
                items={moment.tz.names().map((tzName) => ({
                  id: tzName,
                  title: tzName,
                }))}
                onChange={this.handleTimezoneChange}
                value={this.state.localTimezone}
                disabled={this.props.formMode === 'EDIT'}
                searchable
              />
            </div>
          </div>

          <br />

          <div className="row">
            <div className="col-md-3">
              <InputNumeric
                name="duration"
                label={this.props.t('Duration')}
                descriptor={this.props.t('mins')}
                value={this.state.duration ?? undefined}
                onChange={this.handleDurationChange}
                t={this.props.t}
                optional={false}
              />
            </div>

            <div className="col-md-3">
              <MultiSelectDropdown
                label={this.props.t('#sport_specific__Game_Day_+/-')}
                listItems={this.gameDaysOptions}
                onItemSelect={(checkbox) => {
                  this.handleDaysChange(checkbox);
                }}
                selectedItems={this.state.gameDays}
                disabledItems={this.getDisabledGameDays()}
                isOptional
              />
            </div>
          </div>

          <br />

          {window.featureFlags['mls-emr-advanced-options'] && (
            <AdvancedEventOptions
              formData={this.props.trainingSessionFormData}
              surfaceType={this.state.surfaceType}
              surfaceQuality={this.state.surfaceQuality}
              weather={this.state.weather}
              temperature={this.state.temperature}
              handleSurfaceTypeChange={this.handleSurfaceTypeChange}
              handleSurfaceQualityChange={this.handleSurfaceQualityChange}
              handleWeatherChange={this.handleWeatherChange}
              handleTemperatureChange={this.handleTemperatureChange}
            />
          )}

          <hr className="trainingSessionModal__hr--full" />

          <div className="row">
            <div className="col-md-12">
              <div className="trainingSessionModalForm__actionsWrapper">
                <TextButton
                  isSubmit
                  type="primary"
                  text={
                    this.props.formMode === 'CREATE'
                      ? this.props.t('Create Session')
                      : this.props.t('Save')
                  }
                  isDisabled={this.state.loading}
                  className="trainingSessionModalForm__createButton"
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.loading && (
          <AppStatus
            status="loading"
            message={`${this.props.t('Saving')}...`}
          />
        )}
        {this.state.requestError && <AppStatus status="error" />}
      </FormValidator>
    );
  }
}

export const TrainingSessionFormTranslated =
  withNamespaces()(TrainingSessionForm);
export default TrainingSessionForm;
