// @flow
import { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import ReactDOM from 'react-dom';

import { AppStatus, LegacyModal as Modal } from '@kitman/components';
import {
  getOrganisationTeams,
  getVenueTypes,
  getCompetitions,
  getTeams,
  getEventConditions,
  getSport,
} from '@kitman/services';
import { type DropdownItem } from '@kitman/components/src/types';
import { type Game as GameEvent } from '@kitman/common/src/types/Event';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import { type Game, type GameFormData } from '../types';
import { transformGameEvent } from '../utils';
import { GameFormTranslated as GameForm } from './GameForm/index';

type Props = {
  isOpen?: boolean,
  calledOutsideReact: boolean,
  onSaveSuccess?: Function,
  closeModal?: Function,
  gameId?: number,
  formMode: 'EDIT' | 'CREATE',
  event: GameEvent,
  seasonMarkerRange: Array<string>,
};
type State = {
  game: Game,
  gameFormData: GameFormData,
  requestError: boolean,
};

class App extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      game: {
        id: props.gameId || null,
        eventType: 'GAME',
        score: '',
        markerId: '',
        opponentScore: '',
        localTimezone: '',
        duration: '',
        isActive: false,
        fixture: {
          id: null,
          date: '',
          venueTypeId: '',
          venueTypeName: '',
          organisationTeamId: '',
          organisationTeamName: '',
          teamId: '',
          teamName: '',
          competitionId: '',
          competitionName: '',
          roundNumber: '',
          turnaroundPrefix: '',
          createTurnaroundMarker: true,
        },
        surfaceType: '',
        surfaceQuality: '',
        weather: '',
        temperature: '',
      },
      gameFormData: {
        loaded: false,
        fixtures: [],
        venueTypes: [],
        organisationTeams: [],
        teams: [],
        competitions: [],
        surfaceTypes: [],
        surfaceQualities: [],
        weathers: [],
        temperatureUnit: 'F',
      },
      requestError: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.escClose = this.escClose.bind(this);
    this.handleGameFormDataLoad = this.handleGameFormDataLoad.bind(this);
    this.fetchFormData = this.fetchFormData.bind(this);
  }

  componentDidMount() {
    this.fetchFormData();
    document.addEventListener('keydown', this.escClose, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escClose, false);
  }

  escClose = (event: any) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  closeModal = () => {
    if (this.props.calledOutsideReact) {
      ReactDOM.unmountComponentAtNode(document.getElementById('GameModal'));
      document.removeEventListener('keydown', this.escClose, false);
    } else if (this.props.closeModal) {
      this.props.closeModal();
    }
  };

  handleGameFormDataLoad = (data: Object) => {
    this.setState({
      gameFormData: {
        loaded: true,
        fixtures: [],
        venueTypes: this.prepareOptions(data.venue_types),
        organisationTeams: this.prepareOptions(data.organisation_teams),
        teams: this.prepareOptions(data.teams),
        competitions: this.prepareOptions(data.competitions),
        surfaceTypes: data.eventConditions.surface_types,
        surfaceQualities: data.eventConditions.surface_qualities,
        weathers: data.eventConditions.weather_conditions,
        temperatureUnit: data.eventConditions.temperature_units,
      },
      game:
        this.props.formMode === 'EDIT'
          ? // $FlowFixMe Too many differences between the new Event type and legacy type. To fix when removing planning-session-planning
            transformGameEvent(this.props.event)
          : { ...this.state.game, duration: data.duration },
    });
  };

  fetchFormData = () => {
    if (this.state.gameFormData.loaded) {
      return;
    }

    Promise.all([
      getOrganisationTeams(),
      getVenueTypes(),
      getCompetitions(),
      getTeams(),
      getEventConditions(),
      getSport(),
    ]).then(
      ([
        organisationTeams,
        venueTypes,
        competitions,
        teams,
        eventConditions,
        sport,
      ]) =>
        // $FlowFixMe Too many differences between the new Event type and legacy type. To fix when removing planning-session-planning
        this.handleGameFormDataLoad({
          organisation_teams: organisationTeams,
          venue_types: venueTypes,
          competitions,
          teams,
          eventConditions,
          duration: sport.duration,
        }),
      () => this.setState({ requestError: true })
    );
  };

  prepareOptions(
    array: Array<{ id: number, name: string }>
  ): Array<DropdownItem> {
    return array.map((item) => ({ id: item.id.toString(), title: item.name }));
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
          title={
            this.props.formMode === 'CREATE'
              ? this.props.t('New Game')
              : this.props.t('Edit Game')
          }
          style={{ overflow: 'visible' }}
        >
          <div className="gameModal">
            <div className="gameModal__section">
              {this.state.gameFormData.loaded && (
                <GameForm
                  seasonMarkerRange={this.props.seasonMarkerRange}
                  formMode={this.props.formMode}
                  game={this.state.game}
                  gameFormData={this.state.gameFormData}
                  calledOutsideReact={this.props.calledOutsideReact}
                  onSaveSuccess={
                    this.props.onSaveSuccess
                      ? this.props.onSaveSuccess
                      : () => {}
                  }
                />
              )}
            </div>
          </div>
          {this.state.requestError && <AppStatus status="error" />}
        </Modal>
      </div>
    );
  }
}

export const AppTranslated = withNamespaces()(App);
export default App;
