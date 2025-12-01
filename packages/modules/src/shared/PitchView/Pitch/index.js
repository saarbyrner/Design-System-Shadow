// @flow
import { useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import { omit } from 'lodash';
import { css } from '@emotion/react';
import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GameActivityStorage,
  PitchViewFormatType,
} from '@kitman/common/src/types/GameEvent';
import useResponsivePitchView, {
  PITCH_VIEW_MAX_WIDTH,
} from '@kitman/modules/src/PlanningEvent/src/hooks/useResponsivePitchView';
import InFieldPosition from '@kitman/modules/src/PlanningEvent/src/components/InFieldPosition';
import type {
  Coordinate,
  PitchViewInitialState,
  Team,
  Field,
  OnPlayerPitchClickProps,
  FormationCoordinates,
} from '@kitman/common/src/types/PitchView';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  handleFootballSinglePlayerEvent,
  handleFootballMultiPlayerPitchEvent,
  getCaptainForTeamActivity,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { orderPlayersByGroupAndPositionAndId } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import {
  setField,
  setSelectedPitchPlayer,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';

import styles from './style';
import sportsSettings from '../sportsSettings';

type Props = {
  sport: string,
  pitchFormat: PitchViewFormatType,
  selectedFormationCoordinates: FormationCoordinates,
  periodStartTime: number,
  selectedSquadOrganisationId?: number,
  setSelectedEvent?: (?GameActivity) => void,
  hasPeriodStarted: boolean,
  isImportedGame: boolean,
  handleUpdateScoreline?: () => void,
  team: Team,
  isDmrLocked?: boolean,
  setTeam?: (Team) => void,
};

const Pitch = (props: Props) => {
  const dispatch = useDispatch();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const foundCaptainActivity = getCaptainForTeamActivity(gameActivities);

  const { field, activeEventSelection, pitchActivities, selectedPitchPlayer } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const updateField = (updatedField: Field) => dispatch(setField(updatedField));

  const selectedSportSettings = sportsSettings[props.sport];
  const columns = useMemo(
    () => [...Array(field.columns).keys()],
    [field.columns]
  );
  const rows = useMemo(() => [...Array(field.rows).keys()], [field.rows]);
  const pitchRef = useRef(null);
  useResponsivePitchView({
    initialWidth: selectedSportSettings.pitchWidth,
    initialHeight: selectedSportSettings.pitchHeight,
    columns: field.columns,
    rows: field.rows,
    pitchId: 'pitch',
    pitchRef,
    setField: (updatedField: $Shape<Field>) => {
      updateField({ ...field, ...updatedField });
    },
  });

  const handleRemovePlayer = (player: Athlete, positionData: Coordinate) => {
    let currentActivities = structuredClone(gameActivities);
    const foundPositionChangeIndex = currentActivities.findIndex(
      (activity) =>
        activity.kind === eventTypes.position_change &&
        activity.athlete_id === player.id &&
        activity.absolute_minute === props.periodStartTime &&
        !activity.delete
    );

    if (currentActivities[foundPositionChangeIndex]?.id) {
      currentActivities[foundPositionChangeIndex] = {
        ...currentActivities[foundPositionChangeIndex],
        delete: true,
      };
      const foundFormationPositionViewChangeIndex = currentActivities.findIndex(
        (activity) =>
          activity.kind === eventTypes.formation_position_view_change &&
          activity.athlete_id === player.id &&
          activity.absolute_minute === props.periodStartTime
      );
      currentActivities[foundFormationPositionViewChangeIndex] = {
        ...currentActivities[foundFormationPositionViewChangeIndex],
        delete: true,
      };
    } else {
      currentActivities = currentActivities.filter(
        (activity) =>
          !(
            activity.athlete_id === player.id &&
            activity.absolute_minute === props.periodStartTime &&
            !activity.delete
          )
      );
    }

    dispatch(setUnsavedGameActivities(currentActivities));
    dispatch(setSelectedPitchPlayer(null));
    props.setTeam?.({
      inFieldPlayers: omit(
        props.team.inFieldPlayers,
        `${+positionData?.x}_${+positionData.y}`
      ),
      players: orderPlayersByGroupAndPositionAndId([
        ...props.team.players,
        player,
      ]),
    });
  };

  const handleSelectedPlayerForEvent = ({
    player,
    eventType,
    positionData,
  }: OnPlayerPitchClickProps) => {
    let newEvents = [];
    const playerId = +player.id;

    if (
      [eventTypes.goal, eventTypes.red, eventTypes.yellow].includes(
        activeEventSelection
      )
    )
      newEvents = handleFootballSinglePlayerEvent({
        gameActivities: pitchActivities,
        athleteId: playerId,
        eventType,
        organisationId: props.selectedSquadOrganisationId,
        periodStartTime: props.periodStartTime,
      });

    if (eventTypes.switch === activeEventSelection && positionData) {
      newEvents = handleFootballMultiPlayerPitchEvent({
        athleteId: playerId,
        eventType,
        positionData,
        pitchActivities,
        periodStartTime: props.periodStartTime,
        selectedPitchPlayer,
      });

      // For Reference the index of game activities refers to the formation_position_view changes hence 2 and 3, while
      // 0 and 1 are the position_change events created from the handleFootballMultiPlayerEvent util.
      const FIRST_FORMATION_POSITION_VIEW_CHANGE_INDEX = 2;
      const SECOND_FORMATION_POSITION_VIEW_CHANGE_INDEX = 3;

      const foundFirstFormationCoord = Object.keys(
        props.selectedFormationCoordinates
      ).find(
        (key) =>
          props.selectedFormationCoordinates[key].id ===
          newEvents[0].game_activities?.[
            FIRST_FORMATION_POSITION_VIEW_CHANGE_INDEX
          ].relation?.id
      );
      const foundSecondFormationCoord = Object.keys(
        props.selectedFormationCoordinates
      ).find(
        (key) =>
          props.selectedFormationCoordinates[key].id ===
          newEvents[0].game_activities?.[
            SECOND_FORMATION_POSITION_VIEW_CHANGE_INDEX
          ].relation?.id
      );

      if (foundFirstFormationCoord && foundSecondFormationCoord)
        props.setTeam?.({
          inFieldPlayers: {
            ...props.team.inFieldPlayers,
            [foundFirstFormationCoord]: selectedPitchPlayer?.player,
            [foundSecondFormationCoord]: player,
          },
          players: props.team.players,
        });
    }

    dispatch(setSelectedPitchPlayer(null));
    dispatch(setUnsavedGameActivities([...gameActivities, ...newEvents]));
    // when a new event is created automatically select it instead
    props.setSelectedEvent?.({
      ...newEvents[0],
      activityIndex: gameActivities.length,
    });

    if (activeEventSelection === eventTypes.goal) {
      props.handleUpdateScoreline?.();
    }
  };

  return (
    <div
      id="pitch"
      ref={pitchRef}
      data-testid="Pitch"
      css={[
        styles.pitchWrapper,
        css`
          max-width: ${PITCH_VIEW_MAX_WIDTH}px;
          height: ${field.height}px;
        `,
      ]}
    >
      {props.selectedFormationCoordinates &&
        props.team.inFieldPlayers &&
        rows.map((rowX) => {
          return (
            <div key={rowX} css={styles.inFieldPositionsWrapper}>
              {columns.map((columnY) => {
                const id = `${rowX}_${columnY}`;

                const data = props.selectedFormationCoordinates?.[id];
                const player = props.team.inFieldPlayers?.[id];

                const isCaptain =
                  foundCaptainActivity?.athlete_id === player?.id;

                return (
                  <InFieldPosition
                    pitchFormat={props.pitchFormat}
                    key={id}
                    cellId={id}
                    positionData={data}
                    player={player}
                    onPlayerClick={handleSelectedPlayerForEvent}
                    hasPeriodStarted={props.hasPeriodStarted}
                    handleRemovePosition={handleRemovePlayer}
                    isImportedGame={props.isImportedGame}
                    isDmrLocked={props.isDmrLocked}
                    isCaptain={isCaptain}
                  />
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Pitch;
