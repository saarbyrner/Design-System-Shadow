// @flow
import React from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextButton } from '@kitman/components';
import type {
  GameActivity,
  TeamsPlayers,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import type { Game, EventAthlete } from '@kitman/common/src/types/Event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import styles from './styles';
import { PenaltyShootoutTranslated as PenaltyShootout } from './PenaltyShootout';
import { getPenaltyShootoutActivities } from '../../utils/matchReportUtils';

type Props = {
  isReadOnly: boolean,
  gameEvent: Game,
  players: TeamsPlayers,
  penaltyActivities: TeamsPenalties,
  setPenaltyActivities: Function,
};

export type TranslatedProps = I18nProps<Props>;

const MatchReportPenaltyShootoutList = (props: TranslatedProps) => {
  const orgTeamName = props.gameEvent.squad?.name
    ? `${props.gameEvent.squad?.owner_name} ${props.gameEvent?.squad?.name}`
    : props.gameEvent?.organisation_team?.name;

  const opponentTeamName = props.gameEvent.opponent_squad?.name
    ? `${props.gameEvent.opponent_squad?.owner_name} ${props.gameEvent?.opponent_squad?.name}`
    : props.gameEvent?.opponent_team?.name ?? ''; // opponent_team and opponent_squad are mutually exclusive,
  // but one must exist, therefore ?? '' is just for Flow

  const addPenaltyToEachTeam = () => {
    const newPenalty = {
      kind: eventTypes.penalty_shootout,
      athlete_id: null,
      absolute_minute:
        getPenaltyShootoutActivities(props.penaltyActivities.homePenalties)
          .length + 1,
      minute:
        getPenaltyShootoutActivities(props.penaltyActivities.homePenalties)
          .length + 1,
    };

    props.setPenaltyActivities({
      homePenalties: [...props.penaltyActivities.homePenalties, newPenalty],
      awayPenalties: [...props.penaltyActivities.awayPenalties, newPenalty],
    });
  };

  const renderPenaltyShootoutHeader = () => (
    <div css={styles.penaltyShootoutHeader}>
      <span className="shootoutListTitle">{props.t('Penalty Shoot-out')}</span>
      <TextButton
        onClick={addPenaltyToEachTeam}
        text={props.t('Add Penalty')}
        type="primary"
        kitmanDesignSystem
        isDisabled={props.isReadOnly}
      />
    </div>
  );

  const renderTeamShootoutList = ({
    teamPenaltyType,
    teamName,
    teamPenaltyActivities,
    teamPlayers,
  }: {
    teamPenaltyType: string,
    teamName: string,
    teamPenaltyActivities: Array<GameActivity>,
    teamPlayers: Array<EventAthlete>,
  }) => {
    const penaltiesWithActivityIndex = teamPenaltyActivities.map(
      (penalty, index) => ({
        ...penalty,
        activityIndex: index,
      })
    );
    return (
      <div css={styles.teamShootoutListContainer}>
        <div css={styles.teamShootoutHeader}>
          <span className="teamName">{teamName}</span>
          <span className="jerseyNum">{props.t('Jersey')}</span>
          <span className="scoredInputs">{props.t('Scored')}</span>
          <span className="scoredInputs">{props.t('Missed')}</span>
        </div>
        <hr css={styles.penaltyListBorder} />
        {getPenaltyShootoutActivities(penaltiesWithActivityIndex).map(
          (penaltyActivity, index) => (
            <React.Fragment key={penaltyActivity.absolute_minute}>
              <PenaltyShootout
                isReadOnly={props.isReadOnly}
                teamPenaltyType={teamPenaltyType}
                penaltyActivity={penaltyActivity}
                penaltyNum={index + 1}
                players={teamPlayers}
                allPenaltyActivities={props.penaltyActivities}
                setPenaltyActivities={props.setPenaltyActivities}
              />
              <hr css={styles.penaltyListBorder} />
            </React.Fragment>
          )
        )}
      </div>
    );
  };

  return (
    <div css={styles.penaltyShootoutListWrapper}>
      {renderPenaltyShootoutHeader()}
      {renderTeamShootoutList({
        teamPenaltyType: 'homePenalties',
        teamName: orgTeamName,
        teamPenaltyActivities: props.penaltyActivities.homePenalties,
        teamPlayers: props.players.homePlayers,
      })}
      {renderTeamShootoutList({
        teamPenaltyType: 'awayPenalties',
        teamName: opponentTeamName,
        teamPenaltyActivities: props.penaltyActivities.awayPenalties,
        teamPlayers: props.players.awayPlayers,
      })}
    </div>
  );
};

export const MatchReportPenaltyShootoutListTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportPenaltyShootoutList);
export default MatchReportPenaltyShootoutList;
