// @flow
/* eslint-disable react/sort-comp, max-statements */
import { Component } from 'react';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TrackEvent } from '@kitman/common/src/utils';
import {
  AppStatus,
  FormValidator,
  InputNumeric,
  TextButton,
} from '@kitman/components';
import isValidTemperature from '@kitman/modules/src/AdvancedEventOptions/utils';
import { type DropdownItem } from '@kitman/components/src/types';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import { transformGameRequest } from '../../utils';
import { type Game, type Fixture, type GameFormData } from '../../types';
import { FixtureFormTranslated as FixtureForm } from './components/FixtureForm';

export type Props = {
  formMode: 'EDIT' | 'CREATE',
  game: Game,
  gameFormData: GameFormData,
  calledOutsideReact: boolean,
  onSaveSuccess: Function,
  seasonMarkerRange: Array<string>,
};

type State = {
  viewType: 'GAME' | 'FIXTURE',
  markerId: string,
  fixture: Fixture,
  score: string,
  opponentScore: string,
  localTimezone: string,
  time: ?Object,
  defaultTime: ?Object,
  duration: string,
  loading: boolean,
  requestError: boolean,
  surfaceType: string,
  surfaceQuality: string,
  weather: string,
  temperature: string,
};

class GameForm extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    const fixture = this.props.game.fixture || {};

    const localTimezone =
      this.props.game.localTimezone ||
      document.getElementsByTagName('body')[0].dataset.timezone;

    this.state = {
      viewType: 'FIXTURE',
      markerId: this.props.game.markerId || 'new',
      duration: this.props.game.duration,
      fixture: {
        id: this.props.game.markerId || null,
        date: fixture.date ? moment.tz(fixture.date, localTimezone) : '',
        venueTypeId: fixture.venueTypeId || '',
        venueTypeName: fixture.venueTypeName || '',
        teamId: fixture.teamId || '',
        teamName: fixture.teamName || '',
        organisationTeamId: fixture.organisationTeamId || '',
        organisationTeamName: fixture.organisationTeamName || '',
        competitionId: fixture.competitionId || '',
        competitionName: fixture.competitionName || '',
        roundNumber: fixture.roundNumber || '',
        turnaroundPrefix: fixture.turnaroundPrefix || '',
        createTurnaroundMarker: fixture.createTurnaroundMarker !== false,
      },

      score: this.props.game.score ?? '',
      opponentScore: this.props.game.opponentScore ?? '',
      localTimezone,
      time: fixture.date ? moment.tz(fixture.date, localTimezone) : null,
      defaultTime: fixture.date
        ? null
        : moment
            .tz(localTimezone)
            .set({ hour: 12, minute: 0, second: 0, millisecond: 0 }),
      loading: false,
      requestError: false,
      surfaceType: this.props.game.surfaceType || '',
      surfaceQuality: this.props.game.surfaceQuality || '',
      weather: this.props.game.weather || '',
      temperature: this.props.game.temperature || '',
    };

    this.handleMarkerIdChange = this.handleMarkerIdChange.bind(this);
    this.handleFixtureChange = this.handleFixtureChange.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
    this.handleOpponentScoreChange = this.handleOpponentScoreChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.optionalFields = this.optionalFields.bind(this);
    this.handleSurfaceTypeChange = this.handleSurfaceTypeChange.bind(this);
    this.handleSurfaceQualityChange =
      this.handleSurfaceQualityChange.bind(this);
    this.handleWeatherChange = this.handleWeatherChange.bind(this);
    this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
  }

  resetForm(markerId: string) {
    this.setState({
      viewType: 'FIXTURE',
      markerId,
      fixture: {
        date: '',
        venueTypeId: '',
        venueTypeName: '',
        teamId: '',
        teamName: '',
        organisationTeamId: '',
        organisationTeamName: '',
        competitionId: '',
        competitionName: '',
        roundNumber: '',
        turnaroundPrefix: '',
        createTurnaroundMarker: true,
      },
      score: '',
      opponentScore: '',
      localTimezone: '',
      duration: '',
      surfaceType: '',
      surfaceQuality: '',
      weather: '',
      temperature: '',
    });
  }

  handleMarkerIdChange = (markerId: string) => {
    if (!markerId || markerId === 'new') {
      this.resetForm(markerId);
    } else {
      const selectedFixture = this.props.gameFormData.fixtures.find(
        (fixture) => fixture.id === markerId
      );

      if (!selectedFixture || !selectedFixture.fixture) return;

      this.setState({
        viewType: 'GAME',
        markerId,
        duration: selectedFixture.duration,
        fixture: {
          id: selectedFixture.id,
          ...selectedFixture.fixture,
        },
        score: '',
        opponentScore: '',
      });
    }
  };

  handleFixtureChange = (attributes: any) => {
    this.setState({
      fixture: Object.assign({}, this.state.fixture, attributes),
    });
  };

  handleTimeChange = (time: string) => {
    this.setState({
      time,
    });
  };

  handleTimezoneChange = (localTimezone: string) => {
    this.setState({
      localTimezone,
    });
  };

  handleDurationChange = (duration: string) => {
    this.setState({
      duration,
    });
  };

  handleScoreChange = (score: string) => {
    this.setState({ score });
  };

  handleOpponentScoreChange = (opponentScore: string) => {
    this.setState({ opponentScore });
  };

  handleSurfaceTypeChange = (surfaceType: string) => {
    this.setState({ surfaceType });
  };

  handleSurfaceQualityChange = (surfaceQuality: string) => {
    this.setState({ surfaceQuality });
  };

  handleWeatherChange = (weather: string) => {
    this.setState({ weather });
  };

  handleTemperatureChange = (temperature: string) => {
    this.setState({ temperature });
  };

  handleSaveClick() {
    if (this.props.formMode === 'CREATE') {
      TrackEvent('workload', 'click', 'add training session');
    }

    this.setState({ loading: true });

    const requestData = transformGameRequest(this.buildGame());

    const requestMethod = this.props.formMode === 'EDIT' ? 'PATCH' : 'POST';
    const baseUrl = '/planning_hub/events';

    const requestUrl =
      this.props.formMode === 'EDIT' && this.props.game.id
        ? `${baseUrl}/${this.props.game.id}`
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
  }

  saveSuccess(data: any) {
    this.props.onSaveSuccess(data.event);

    if (this.props.formMode === 'CREATE') {
      window.location.href = `/planning_hub/events/${data.event.id}`;
    }
  }

  buildGame(): Game {
    /*
     * Only extract the hour and minute from state.time
     * this avoids any possible issue with the time
     * moment having a different day to state.fixture.date
     */
    const dateWithTime = moment.tz(
      this.state.fixture.date,
      this.state.localTimezone
    );

    // Avoid attempting to set the time if not present in state as date may already have a time we wish to maintain
    if (this.state.time) {
      dateWithTime.set({
        hour: this.state.time.get('hour'),
        // $FlowFixMe we already checked state.time exists
        minute: this.state.time.get('minute'),
      });
    }

    const date = dateWithTime.format(DateFormatter.dateTransferFormat);

    return {
      eventType: 'GAME',
      markerId: this.state.markerId,
      fixture: {
        ...this.state.fixture,
        date,
      },
      score: this.state.score,
      opponentScore: this.state.opponentScore,
      localTimezone: this.state.localTimezone,
      duration: this.state.duration,
      surfaceType: this.state.surfaceType,
      surfaceQuality: this.state.surfaceQuality,
      weather: this.state.weather,
      temperature: this.state.temperature,
      isActive: this.props.game.isActive,
    };
  }

  getNameOnList(list: Array<DropdownItem>, id: string) {
    const item = list.find((listItem) => listItem.id === id.toString());
    return item ? item.title : null;
  }

  fixtureForm() {
    return (
      <div className="gameModalForm__fixtureFormWrapper">
        <FixtureForm
          fixture={this.state.fixture}
          gameFormData={this.props.gameFormData}
          seasonMarkerRange={this.props.seasonMarkerRange}
          localTimezone={this.state.localTimezone}
          time={this.state.time}
          defaultTime={this.state.defaultTime}
          score={this.state.score}
          opponentScore={this.state.opponentScore}
          duration={this.state.duration}
          surfaceType={this.state.surfaceType}
          surfaceQuality={this.state.surfaceQuality}
          weather={this.state.weather}
          temperature={this.state.temperature}
          isGameActive={this.props.game.isActive}
          handleScoreChange={this.handleScoreChange}
          handleOpponentScoreChange={this.handleOpponentScoreChange}
          handleTimeChange={this.handleTimeChange}
          onChange={this.handleFixtureChange}
          handleTimezoneChange={this.handleTimezoneChange}
          handleDurationChange={this.handleDurationChange}
          handleSurfaceTypeChange={this.handleSurfaceTypeChange}
          handleSurfaceQualityChange={this.handleSurfaceQualityChange}
          handleWeatherChange={this.handleWeatherChange}
          handleTemperatureChange={this.handleTemperatureChange}
        />
      </div>
    );
  }

  gameForm() {
    return (
      <div className="gameModalForm__gameFormWrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="gameModalForm__label">{this.props.t('Result')}</div>
          </div>

          <div className="col-md-12">
            <div className="gameModalForm__scoreWrapper">
              <InputNumeric
                name="score"
                descriptor={this.state.fixture.organisationTeamName}
                descriptorSide="left"
                value={this.state.score}
                onChange={this.handleScoreChange}
                optional={false}
                t={this.props.t}
              />
            </div>

            <div className="gameModalForm__scoreSeparator">-</div>

            <div className="gameModalForm__scoreWrapper">
              <InputNumeric
                name="opponentScore"
                descriptor={this.state.fixture.teamName}
                value={this.state.opponentScore}
                onChange={this.handleOpponentScoreChange}
                optional={false}
                t={this.props.t}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-4">
            <InputNumeric
              label={this.props.t('Duration')}
              name="duration"
              value={this.state.duration}
              onChange={(duration) => this.handleDurationChange(duration)}
              descriptor={this.props.t('mins')}
            />
          </div>
        </div>
      </div>
    );
  }

  form() {
    return (
      <div className="gameModalForm__formWrapper">
        {this.state.viewType === 'FIXTURE' && this.fixtureForm()}

        {this.state.viewType === 'GAME' && this.gameForm()}
      </div>
    );
  }

  optionalFields = () => {
    let optionalFields = [
      'advanced_option_surface_type',
      'turnaround_prefix_optional',
      'roundNumber',
      'createTurnaroundMarker',
      'surfaceType',
      'surfaceQuality',
      'weather',
    ];

    const isFixtureDateNullOrInFuture =
      !this.state.fixture.date ||
      moment(this.state.fixture.date).isAfter(moment().endOf('day'));

    const isTemperatureFilled = !!this.state.temperature;

    if (isFixtureDateNullOrInFuture) {
      optionalFields = [
        ...optionalFields,
        'duration',
        'score',
        'opponentScore',
      ];
    }

    if (!isTemperatureFilled) {
      optionalFields = [...optionalFields, 'temperature'];
    }

    return optionalFields;
  };

  render() {
    return (
      <div className="gameModalForm">
        <FormValidator
          successAction={() => {
            this.handleSaveClick();
          }}
          inputNamesToIgnore={this.optionalFields()}
          customValidation={(input) => {
            if (input.attr('name') === 'temperature') {
              return isValidTemperature(
                input.val(),
                this.props.gameFormData.temperatureUnit
              );
            }
            return true;
          }}
        >
          {this.form()}

          <hr className="gameModal__hr--full" />

          <div className="row">
            <div className="col-md-12">
              <div className="gameModalForm__actionsWrapper">
                <TextButton
                  type="primary"
                  text={
                    this.props.formMode === 'CREATE'
                      ? this.props.t('Create Game')
                      : this.props.t('Save')
                  }
                  isDisabled={this.state.loading}
                  isSubmit
                  className="gameModalForm__createButton"
                />
              </div>
            </div>
          </div>
        </FormValidator>
        {this.state.loading && (
          <AppStatus
            status="loading"
            message={`${this.props.t('Saving')}...`}
          />
        )}
        {this.state.requestError && <AppStatus status="error" />}
      </div>
    );
  }
}

export const GameFormTranslated = withNamespaces()(GameForm);
export default GameForm;
