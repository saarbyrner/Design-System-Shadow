// @flow
import { useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import structuredClone from 'core-js/stable/structured-clone';
import type { ComponentType, Element } from 'react';
import type { Option } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Select, TextButton } from '@kitman/components';
import type {
  GameActivity,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import type { EventAthlete } from '@kitman/common/src/types/Event';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import {
  eventTypes,
  SCORED_TYPE,
  MISSED_TYPE,
} from '@kitman/common/src/consts/gameEventConsts';
import {
  updatePenaltyScoreStatus,
  updatePenaltyAthleteAssigned,
  penaltyRetrievalCheck,
  deleteAndUpdatePenalties,
} from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportUtils';

import styles from './styles';

type Props = {
  isReadOnly: boolean,
  teamPenaltyType: string,
  penaltyNum: number,
  penaltyActivity: GameActivity,
  players: Array<EventAthlete>,
  allPenaltyActivities: TeamsPenalties,
  setPenaltyActivities: Function,
};

export type TranslatedProps = I18nProps<Props>;

const PenaltyShootout = (props: TranslatedProps) => {
  const modal = useGameEventsModal();

  const handlePenaltyValueChange = useCallback(
    (type, value) => {
      const currentPenaltyActivities = structuredClone(
        props.allPenaltyActivities
      );
      const currentTeamTypeActivities = [
        ...currentPenaltyActivities[props.teamPenaltyType],
      ];
      const currentPenaltyActivity =
        currentTeamTypeActivities[props.penaltyActivity.activityIndex];

      // If type is player only change the athlete_id
      if (type === 'player') {
        currentPenaltyActivities[props.teamPenaltyType] =
          updatePenaltyAthleteAssigned({
            scoreStatus: value,
            currentPenaltyActivity,
            currentTeamTypeActivities,
            activityIndex: +props.penaltyActivity.activityIndex,
          });
      } else {
        currentPenaltyActivities[props.teamPenaltyType] =
          updatePenaltyScoreStatus({
            scoreStatus: value,
            currentPenaltyActivity,
            currentTeamTypeActivities,
            activityIndex: +props.penaltyActivity.activityIndex,
          });
      }

      props.setPenaltyActivities(currentPenaltyActivities);
    },
    [
      props.allPenaltyActivities,
      props.setPenaltyActivities,
      props.penaltyActivity,
      props.teamPenaltyType,
    ]
  );

  const handleOnDeletePenalties = useCallback(() => {
    const penaltyMinute = props.penaltyActivity.absolute_minute;

    const homePenaltyIndex = props.allPenaltyActivities.homePenalties.findIndex(
      (penalty) => penaltyRetrievalCheck(penalty, penaltyMinute)
    );

    const awayPenaltyIndex = props.allPenaltyActivities.awayPenalties.findIndex(
      (penalty) => penaltyRetrievalCheck(penalty, penaltyMinute)
    );

    props.setPenaltyActivities(
      deleteAndUpdatePenalties({
        allPenaltyActivities: props.allPenaltyActivities,
        homeIndex: homePenaltyIndex,
        awayIndex: awayPenaltyIndex,
        penaltyMinute,
      })
    );
  }, [
    props.allPenaltyActivities,
    props.setPenaltyActivities,
    props.penaltyActivity,
  ]);

  const getPlayerSelectOptions = (
    teamPlayers: Array<EventAthlete>
  ): Array<Option> =>
    teamPlayers.map((player: EventAthlete) => ({
      label: player?.fullname,
      value: player?.id,
    }));

  const getSelectedPlayersJerseyNum = (athleteId?: ?number): string => {
    if (athleteId) {
      const foundPlayer = props.players.find(
        (player) => player.id === props.penaltyActivity.athlete_id
      );
      return `#${foundPlayer?.squad_number ? foundPlayer.squad_number : ''} `;
    }
    return '';
  };

  const renderScoredInputButton = (type: string): Element<'button'> => {
    const foundLinkedScoreActivity = props.allPenaltyActivities[
      props.teamPenaltyType
    ].find(
      (activity) => activity.game_activity_id === props.penaltyActivity.id
    );

    // Check to see if an existing nested or saved linked goal/no goal exists for the penalty.
    const checkIfActive = (eventType: string) => {
      const savedActiveTypePresent =
        foundLinkedScoreActivity &&
        foundLinkedScoreActivity.kind === eventType &&
        !foundLinkedScoreActivity.delete;

      const localActiveTypePresent =
        props.penaltyActivity.game_activities &&
        props.penaltyActivity.game_activities.length > 0 &&
        props.penaltyActivity.game_activities[0].kind === eventType;

      return savedActiveTypePresent || localActiveTypePresent;
    };

    const isActive = checkIfActive(
      type === SCORED_TYPE ? eventTypes.goal : eventTypes.no_goal
    );
    const buttonChangedValue = isActive ? null : type;

    return (
      <button
        data-testid={`${type}-button`}
        type="button"
        className={classNames('general-scored-button', {
          'success-active': isActive && type === SCORED_TYPE,
          'missed-active': isActive && type === MISSED_TYPE,
        })}
        onClick={() => handlePenaltyValueChange('scored', buttonChangedValue)}
        disabled={props.isReadOnly || !props.penaltyActivity.athlete_id}
      >
        {isActive ? (
          <i
            className={
              type === 'SCORED' ? 'icon-checked-checkmark' : 'icon-close'
            }
          />
        ) : null}
      </button>
    );
  };

  const renderDeletePenaltyModal = () => {
    modal.show({
      title: props.t(`Delete Penalty`),
      content: props.t(
        'Deleting this penalty will delete the corresponding oppositions team penalty also.'
      ),
      onConfirm: () => {
        handleOnDeletePenalties();
        modal.hide();
      },
    });
  };

  return (
    <>
      <div css={styles.penaltyShootoutRow}>
        <div css={styles.penaltyShootoutContainer}>
          <div css={styles.teamNameArea}>
            <Select
              label={props.t('Player {{playerNumber}}', {
                playerNumber: props.penaltyNum,
              })}
              value={props.penaltyActivity.athlete_id}
              options={getPlayerSelectOptions(props.players)}
              onChange={(value) => handlePenaltyValueChange('player', value)}
              isDisabled={props.isReadOnly}
              className="playerSelect"
            />
          </div>
          <div className="jerseyNum">
            {getSelectedPlayersJerseyNum(props.penaltyActivity?.athlete_id)}
          </div>
          <div css={styles.scoredInputs}>
            {renderScoredInputButton(SCORED_TYPE)}
          </div>
          <div css={styles.scoredInputs}>
            {renderScoredInputButton(MISSED_TYPE)}
          </div>
        </div>
        <div className="delete-penalty-container" css={styles.deleteIcon}>
          <TextButton
            onClick={() => renderDeletePenaltyModal()}
            className={classNames({
              'delete-icon-hidden': props.isReadOnly || props.penaltyNum === 1,
            })}
            iconBefore="icon-bin"
            type="subtle"
            kitmanDesignSystem
            isDisabled={props.isReadOnly || props.penaltyNum === 1}
          />
        </div>
      </div>
      {modal.renderModal()}
    </>
  );
};

export const PenaltyShootoutTranslated: ComponentType<Props> =
  withNamespaces()(PenaltyShootout);
export default PenaltyShootout;
