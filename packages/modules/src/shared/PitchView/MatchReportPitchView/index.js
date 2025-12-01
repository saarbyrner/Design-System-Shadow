// @flow
import { DndContext } from '@dnd-kit/core';
import { useEffect } from 'react';
import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  Coordinate,
  PitchViewInitialState,
  Team,
  PlayerWithPosition,
} from '@kitman/common/src/types/PitchView';
import type {
  GameActivityStorage,
  GamePeriodStorage,
  PitchViewFormatType,
} from '@kitman/common/src/types/GameEvent';
import {
  eventTypes,
  sportFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import { handleFootballMultiPlayerPitchEvent } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { SubstitutionPlayerListTranslated as SubstitutionPlayerList } from '@kitman/modules/src/PlanningEvent/src/components/SubstitutionPlayerList';
import { getClearedTeam } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import {
  setActiveEventSelection,
  setTeams,
  setSelectedPitchPlayer,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';

import { autoSetStartOfPeriodAssignmentsToPitch } from '../pitchViewUtils';
import styles from '../styles';
import Pitch from '../Pitch';

type Props = {
  sport?: string,
  selectedTeamType: string,
  selectedSquadOrganisationId: number,
  pitchFormat: PitchViewFormatType,
  handleUpdateScoreline: () => void,
};

const MatchReportPitchView = (props: Props) => {
  const { sport = sportFormats.soccer, selectedSquadOrganisationId } = props;

  const dispatch = useDispatch();

  // Pitch View Redux State Setup
  const {
    pitchActivities: matchReportActivities,
    activeEventSelection,
    teams,
    field,
    selectedPitchPlayer,
  } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );
  const {
    formationCoordinates: selectedFormationCoordinates,
    staff: selectedStaff,
    positions: selectedTeamPositions,
  } = teams[props.selectedTeamType];

  const selectedPitchTeam = {
    inFieldPlayers: teams[props.selectedTeamType].inFieldPlayers,
    players: teams[props.selectedTeamType].players,
  };

  const { localGameActivities } = useSelector<GameActivityStorage>(
    (state) => state.planningEvent.gameActivities
  );
  const gameActivitiesWithSelectedTeamPositions = [
    ...localGameActivities,
    ...selectedTeamPositions,
  ];

  const { apiEventPeriods: eventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );
  const currentPeriod = eventPeriods[0];

  const isPlayerInField =
    Object.keys(selectedPitchTeam.inFieldPlayers).length > 0;

  const updateTeam = (updatedTeam: Team) =>
    dispatch(
      setTeams({
        ...teams,
        [props.selectedTeamType]: {
          ...teams[props.selectedTeamType],
          ...updatedTeam,
        },
      })
    );

  const updateSelectedPitchPlayer = (value: ?PlayerWithPosition) =>
    dispatch(setSelectedPitchPlayer(value));

  // Pitch View UseEffects
  useEffect(() => {
    if (selectedPitchPlayer) updateSelectedPitchPlayer(null);
  }, [activeEventSelection, props.selectedTeamType]);

  // resets the team of infield players if the period changes
  useEffect(() => {
    if (isPlayerInField || props.selectedTeamType) {
      updateTeam(getClearedTeam(selectedPitchTeam));
    }
  }, [props.pitchFormat, currentPeriod, props.selectedTeamType]);

  const handleAutoPitchAssignments = () => {
    const currentTeam = autoSetStartOfPeriodAssignmentsToPitch({
      gameActivities: gameActivitiesWithSelectedTeamPositions,
      currentPeriod,
      team: selectedPitchTeam,
      formationCoordinates: selectedFormationCoordinates,
    });

    // sets the team in one final rerender when all finished
    if (!isEqual(selectedPitchTeam, currentTeam)) {
      updateTeam(currentTeam);
    }
  };

  useEffect(() => {
    // use effect for handling the automatic setup of the field with prior activities
    if (!isPlayerInField) {
      handleAutoPitchAssignments();
    }
  }, [selectedPitchTeam.inFieldPlayers]);

  const handleOnDropMultiPositionPitchChanges = (
    positionInfo: Coordinate,
    player: Athlete,
    prevPlayer: Athlete
  ) => {
    const substituteEvents = handleFootballMultiPlayerPitchEvent({
      athleteId: +player.id,
      eventType: eventTypes.sub,
      positionData: { id: null, position: { id: null } },
      pitchActivities: matchReportActivities,
      periodStartTime: +currentPeriod.absolute_duration_start,
      selectedPitchPlayer: { player: prevPlayer, positionData: positionInfo },
    });

    dispatch(setActiveEventSelection(''));
    dispatch(
      setUnsavedGameActivities([...localGameActivities, ...substituteEvents])
    );
  };

  const onDropPlayer = ({
    positionId, // coordinates of the position x_y,
    player,
    prevPlayer,
  }: {
    positionId: string,
    player: Athlete,
    prevPlayer: Athlete,
  }) => {
    const positionInfo = selectedFormationCoordinates[positionId];
    handleOnDropMultiPositionPitchChanges(positionInfo, player, prevPlayer);
  };

  const onDragEnd = (e) => {
    if (e.over?.id && activeEventSelection === eventTypes.sub) {
      onDropPlayer({
        positionId: e.over.id,
        player: e.active.data.current,
        prevPlayer: e?.over?.data?.current,
      });
    }
  };

  const renderPitch = () => (
    <Pitch
      sport={sport}
      pitchFormat={props.pitchFormat}
      selectedFormationCoordinates={selectedFormationCoordinates}
      selectedSquadOrganisationId={selectedSquadOrganisationId}
      team={selectedPitchTeam}
      periodStartTime={+currentPeriod?.absolute_duration_start}
      handleUpdateScoreline={props.handleUpdateScoreline}
      hasPeriodStarted
      isImportedGame
    />
  );

  const renderSubsList = () => (
    <SubstitutionPlayerList
      pitchFormat={props.pitchFormat}
      periodStartTime={currentPeriod?.absolute_duration_start}
      team={selectedPitchTeam}
      staff={selectedStaff}
      formationCoordinates={selectedFormationCoordinates}
      onSetTeam={updateTeam}
    />
  );

  const renderMatchReportPitch = () => (
    <DndContext onDragEnd={onDragEnd}>
      <div css={styles.pitchViewWrapper}>
        <div css={styles.pitchWrapper}>
          <div>
            <div data-testid="pitch-container" className="pitch">
              {!!field?.id && renderPitch()}
            </div>
            <div css={styles.substitutionPlayerList}>{renderSubsList()}</div>
          </div>
        </div>
      </div>
    </DndContext>
  );

  return renderMatchReportPitch();
};

export default MatchReportPitchView;
