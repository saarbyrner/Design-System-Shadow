// @flow
import { Component } from 'react';
import $ from 'jquery';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  athleteId: string,
  occurrenceDate: string,
  activityType: string,
  gameId: ?string,
  trainingSessionId: ?string,
};
type State = {
  activityName: string,
};

class ActivityName extends Component<I18nProps<Props>, State> {
  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      activityName: '',
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: `/athletes/${this.props.athleteId}/injuries/game_and_training_options`,
      data: { date: this.props.occurrenceDate },
      success: (data) => {
        if (this.props.activityType === 'game') {
          this.getGameName(data.games);
        } else {
          this.getTraininSessionName(data.training_sessions);
        }
      },
    });
  }

  getGameName(games: Array<Object>) {
    games.forEach((game) => {
      if (game.value === this.props.gameId) {
        this.setState({
          activityName: game.name,
        });
      } else if (this.props.gameId === null) {
        this.setState({
          activityName: this.props.t('Unlisted Games'),
        });
      }
    });
  }

  getTraininSessionName(trainingSessions: Array<Object>) {
    trainingSessions.forEach((trainingSession) => {
      if (trainingSession.value === this.props.trainingSessionId) {
        this.setState({
          activityName: trainingSession.name,
        });
      } else if (this.props.trainingSessionId === null) {
        this.setState({
          activityName: this.props.t('Unlisted Training Session'),
        });
      }
    });
  }

  render() {
    return <span>{this.state.activityName}</span>;
  }
}

export const ActivityNameTranslated = withNamespaces()(ActivityName);
export default ActivityName;
