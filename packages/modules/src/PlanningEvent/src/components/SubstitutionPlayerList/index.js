// @flow
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type {
  GameActivity,
  GameActivityStorage,
  PitchViewFormatType,
} from '@kitman/common/src/types/GameEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventUser, Athlete } from '@kitman/common/src/types/Event';
import {
  eventTypes,
  pitchViewFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import {
  getRedCard,
  handleFootballMultiPlayerPitchEvent,
  handleFootballSinglePlayerEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import { setSelectedPitchPlayer } from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import type {
  PitchViewInitialState,
  Team,
  FormationCoordinates,
} from '@kitman/common/src/types/PitchView';

import PlayerAvatar from '../PlayerAvatar';
import styles from './styles';
import { orderPlayersByGroupAndPositionAndId } from '../GameEventsTab/utils';
import usePlayersByGroups from '../../hooks/usePlayersByGroups';

type Props = {
  pitchFormat: PitchViewFormatType,
  periodStartTime: number,
  team: Team,
  formationCoordinates: FormationCoordinates,
  onSetTeam: (Team) => void,
  staff: Array<EventUser>,
  onSetSelectedEvent?: (?GameActivity) => void,
};

const SubstitutionPlayerList = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { activeEventSelection, pitchActivities, selectedPitchPlayer } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const playersByGroups = usePlayersByGroups(props.team);

  const activeEventIsNotACardEvent = ![
    eventTypes.yellow,
    eventTypes.red,
  ].includes(activeEventSelection);

  const isEventSelectedNotASubEvent =
    props.pitchFormat === pitchViewFormats.gameEvents
      ? activeEventSelection !== eventTypes.sub
      : !activeEventSelection;

  const onEndEventAssignment = (events) => {
    if (selectedPitchPlayer) {
      dispatch(setSelectedPitchPlayer(null));
    }
    dispatch(setUnsavedGameActivities([...gameActivities, ...events]));
    // when a new event is created automatically select it instead
    props.onSetSelectedEvent?.({
      ...events[0],
      activityIndex: gameActivities.length,
    });
  };

  const handleSubstitutionEventCreation = (player: Athlete) => {
    const subEvents = handleFootballMultiPlayerPitchEvent({
      athleteId: +player?.id,
      eventType: eventTypes.sub,
      positionData: { id: null, position: { id: null } },
      pitchActivities,
      periodStartTime: props.periodStartTime,
      selectedPitchPlayer,
    });

    if (props.pitchFormat === pitchViewFormats.gameEvents) {
      const eventFormationId = !selectedPitchPlayer.player
        ? subEvents[0].game_activities[1]?.relation?.id
        : subEvents[0].game_activities[3]?.relation?.id;

      const foundFormationCoord = Object.keys(props.formationCoordinates).find(
        (key) => props.formationCoordinates[key].id === eventFormationId
      );

      if (foundFormationCoord)
        props.onSetTeam({
          inFieldPlayers: {
            ...props.team.inFieldPlayers,
            [foundFormationCoord]: player,
          },
          players: orderPlayersByGroupAndPositionAndId(
            [...props.team.players.filter((p) => p.id !== player.id)].concat(
              selectedPitchPlayer.player || []
            )
          ),
        });
    }
    return subEvents;
  };

  const handleSelectedSubAthlete = (player: Athlete) => {
    let newEvents = [];

    const isEventASinglePlayerEvent = [
      eventTypes.goal,
      eventTypes.red,
      eventTypes.yellow,
    ].includes(activeEventSelection);
    if (
      props.pitchFormat === pitchViewFormats.matchReport &&
      isEventASinglePlayerEvent
    ) {
      newEvents = handleFootballSinglePlayerEvent({
        gameActivities: pitchActivities,
        athleteId: +player.id,
        eventType: activeEventSelection,
      });
    }

    if (selectedPitchPlayer && eventTypes.sub === activeEventSelection) {
      newEvents = handleSubstitutionEventCreation(player);
    }

    onEndEventAssignment(newEvents);
  };

  const onAssignCardToStaff = (staffUser: EventUser) => {
    const newEvents = handleFootballSinglePlayerEvent({
      gameActivities: pitchActivities,
      athleteId: staffUser.user.id,
      eventType: activeEventSelection,
      periodStartTime: props.periodStartTime,
      userType: 'staff',
    });

    onEndEventAssignment(newEvents);
  };

  const renderSubsSection = () => {
    return (
      <div css={styles.subPlayers}>
        {playersByGroups.allPlayers.length === 0 ? (
          <p>{props.t('No substitutes available')}</p>
        ) : (
          playersByGroups.allPlayers.map((player: Athlete) => (
            <div key={player.id} className="subArea">
              <PlayerAvatar
                key={player.id}
                player={player}
                isDisabled={
                  isEventSelectedNotASubEvent ||
                  !!getRedCard(gameActivities, +player.id)
                }
                onPlayerClick={() => handleSelectedSubAthlete(player)}
                playerName={player?.shortname || ''}
              />
            </div>
          ))
        )}
      </div>
    );
  };

  const renderStaffSection = () => {
    return (
      <div data-testid="staff-section">
        <div css={styles.header}>
          <p css={styles.heading}>{props.t('Staff')}</p>
        </div>
        <div css={styles.subPlayers}>
          {props.staff.length === 0 ? (
            <p>{props.t('No staff available')}</p>
          ) : (
            props.staff.map((staffUser) => (
              <div key={staffUser.user.id} className="subArea">
                <PlayerAvatar
                  key={staffUser.user.id}
                  player={staffUser.user}
                  isDisabled={
                    activeEventIsNotACardEvent ||
                    !!getRedCard(gameActivities, staffUser.user.id)
                  }
                  onPlayerClick={() => onAssignCardToStaff(staffUser)}
                  playerName={staffUser.user.fullname}
                  staffRole={staffUser.user.role}
                  isStaff
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div css={styles.wrapper}>
      <div css={styles.header}>
        <p css={styles.heading}>{props.t('Substitutions')}</p>
      </div>
      {renderSubsSection()}
      {renderStaffSection()}
    </div>
  );
};

export const SubstitutionPlayerListTranslated = withNamespaces()(
  SubstitutionPlayerList
);
export default SubstitutionPlayerList;
