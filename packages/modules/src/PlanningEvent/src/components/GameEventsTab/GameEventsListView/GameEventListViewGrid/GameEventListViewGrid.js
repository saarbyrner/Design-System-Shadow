// @flow
import { useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import { DataGrid, UserAvatar } from '@kitman/components';
import type { GridSorting } from '@kitman/components/src/types';
import type { Game, Athlete } from '@kitman/common/src/types/Event';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import {
  eventTypes,
  timeCellFormat,
} from '@kitman/common/src/consts/gameEventConsts';
import { setUnsavedAthletePlayTimes } from '@kitman/modules/src/PlanningEvent/src/redux/slices/athletePlayTimesSlice';
import type {
  GameActivity as GameActivityType,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { GamePeriodDuration } from '@kitman/modules/src/PlanningEvent/types';
import { gameActivitiesPeriodBulkSave } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type { GameActivityDeletion } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type {
  FormationCoordinates,
  PositionData,
} from '@kitman/common/src/types/PitchView';
import {
  findPeriodPositionChangeActivityForAthlete,
  createPlayerFormationViewChange,
  updatePlayerFormationViewChange,
  findPeriodPlayerPitchChangeActivityForAthlete,
  doesOwnGoalExistForEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import {
  updateAthletePlayTimeMinutes,
  getManualAthletePlayTimeForPeriod,
} from '@kitman/common/src/utils/planningEvent/athletePlayTimesUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { GameEventListViewCellTranslated as GameEventListViewCell } from '../GameEventListViewCell';
import { PeriodGoalAssistsCellTranslated as PeriodGoalAssistsCell } from './PeriodGoalAssists';
import { PeriodStartingPositionCellTranslated as PeriodStartingPositionCell } from './PeriodStartingPosition';
import { TotalTimeCellTranslated as TotalTimeCell } from '../TotalTimeCell';
import gridStyles from '../GridStyles';
import { getGameActivitiesForTotalTime } from '../../utils';

type Props = {
  event: Game,
  athletes: Array<Athlete>,
  positionGroups: Array<PositionGroup>,
  gameActivities: Array<GameActivityType>,
  canEditEvent: boolean,
  onGameActivitiesUpdate: Function,
  gridSorting: GridSorting,
  onClickColumnSorting: Function,
  period: GamePeriod,
  periodDurations: Array<GamePeriodDuration>,
  formationCoordinates: FormationCoordinates,
  isPitchViewEnabled: boolean,
  preventGameEvents: boolean,
  dispatchMandatoryFieldsToast: Function,
  setGameActivities: Function,
  hasPeriodStarted: boolean,
  isMidGamePlayerPositionChangeDisabled: boolean,
};

const GameEventListViewGrid = (props: I18nProps<Props>) => {
  const isManualPlayerMinutesEditingAllowed =
    window.featureFlags['set-overall-game-minutes'];
  const isOwnGoalFeatureEnabled = window.getFlag(
    'league-ops-game-events-own-goal'
  );

  const [selectedPositions, setSelectedPositions] = useState<Object[]>([]);

  const { localAthletePlayTimes } = useSelector(
    (state) => state.planningEvent.athletePlayTimes
  );

  const dispatch = useDispatch();

  const isSubOrPlayerSwapPresentInActivities = useMemo(
    () =>
      props.gameActivities.some(
        (activity) =>
          activity.kind === eventTypes.sub ||
          activity.kind === eventTypes.switch
      ),
    [props.gameActivities]
  );

  const handleUpdatingManualAthletePlayTimes = (
    manualTime: number,
    athleteId: number
  ) => {
    const updatedPlayTimes = updateAthletePlayTimeMinutes({
      athletePlayTimes: localAthletePlayTimes,
      currentPeriod: props.period,
      athleteId,
      manualTime,
    });

    dispatch(setUnsavedAthletePlayTimes(updatedPlayTimes));
  };

  const getGridColumns = () => {
    const athleteColumn = {
      id: 'athlete',
      content: props.t('Athlete'),
      isHeader: true,
    };
    const miscColumns = [
      {
        id: 'yellow_card',
        content: (
          <>
            <i css={gridStyles.headerIcon} className="icon-yellow-card" />
            {props.t('Yellow')}
          </>
        ),
        isHeader: true,
      },
      {
        id: 'red_card',
        content: (
          <>
            <i css={gridStyles.headerIcon} className="icon-red-card" />
            {props.t('Red')}
          </>
        ),
        isHeader: true,
      },
      {
        id: 'goal',
        content: (
          <>
            <i css={gridStyles.headerIcon} className="icon-ball" />
            {props.t('Goal')}
          </>
        ),
        isHeader: true,
      },
      {
        id: 'assist',
        content: (
          <>
            <i
              css={[gridStyles.headerIcon, gridStyles.assistIcon]}
              className="icon-boot"
            />
            {props.t('Assist')}
          </>
        ),
        isHeader: true,
      },
    ];

    if (props.isPitchViewEnabled) {
      if (isOwnGoalFeatureEnabled) {
        miscColumns.push({
          id: 'own_goal',
          content: (
            <>
              <i
                css={[gridStyles.headerIcon, gridStyles.ownGoalIcon]}
                className="icon-ball"
              />
              {props.t('Own goal')}
            </>
          ),
          isHeader: true,
        });
      }

      const startingPositionColumn = {
        id: 'starting_position',
        content: props.t('Starting position'),
        isHeader: true,
      };
      const substitutionsSwapsColumn = {
        id: eventTypes.sub,
        content: (
          <>
            <i css={gridStyles.headerIcon} className="icon-arrows-up-down" />
            {props.t('Positions/subs')}
          </>
        ),
        isHeader: true,
      };
      return props.hasPeriodStarted
        ? [
            athleteColumn,
            startingPositionColumn,
            substitutionsSwapsColumn,
            ...miscColumns,
            {
              id: 'total_time',
              content: props.t('Total minutes'),
              isHeader: true,
            },
          ]
        : [athleteColumn, startingPositionColumn, {}, {}, {}];
    }
    return [
      athleteColumn,
      {
        id: 'position_change',
        content: props.t('Positions'),
        isHeader: true,
      },
      {
        id: 'total_time',
        content: props.t('Total minutes'),
        isHeader: true,
      },
      ...miscColumns,
    ];
  };

  const gridColumns = getGridColumns();

  const determineIfEventEditable = (columnId: string, athleteId: number) => {
    let eventEditable = true;
    if (
      props.isPitchViewEnabled &&
      columnId !== 'position_change' &&
      columnId !== 'starting_position'
    ) {
      eventEditable =
        columnId === 'assist'
          ? false
          : !!findPeriodPositionChangeActivityForAthlete(
              props.gameActivities,
              athleteId,
              props.period
            );
    }

    return props.canEditEvent && eventEditable;
  };

  const getAthleteStartingPosition = (athleteId: number) => {
    const currentAthletesCurrentPosition = _find(
      props.gameActivities,
      (gameActivity) => {
        return (
          gameActivity.athlete_id === athleteId &&
          gameActivity.kind === 'formation_position_view_change'
        );
      }
    );

    if (currentAthletesCurrentPosition) {
      const newPosition = _find(
        props.formationCoordinates,
        (formationCoordinate) => {
          return (
            formationCoordinate.id ===
            currentAthletesCurrentPosition?.relation?.id
          );
        }
      );

      const gameActivityPosition = {
        athlete_id: athleteId,
        position: newPosition,
        position_id: newPosition?.id,
      };
      return gameActivityPosition;
    }

    return (
      _find(selectedPositions, (selectedPosition) => {
        return selectedPosition?.athlete_id === athleteId;
      }) || {
        athlete_id: athleteId,
        position: undefined,
        position_id: 'SUBSTITUTE',
      }
    );
  };

  const getAssignedPosition = (
    search: string,
    athleteId: number,
    positionId?
  ) => {
    let assignedPosition;

    // Athlete already has a position selected
    if (search === 'athlete_id' && athleteId) {
      assignedPosition = _find(props.gameActivities, (gameActivity) => {
        return (
          gameActivity.athlete_id === athleteId &&
          gameActivity.kind === 'formation_position_view_change' &&
          gameActivity.absolute_minute === props.period.absolute_duration_start
        );
      });
      // Position already assigned to another athlete
    } else if (search === 'athlete_id_position_id' && athleteId && positionId) {
      assignedPosition = _find(props.gameActivities, (gameActivity) => {
        return (
          gameActivity.athlete_id !== athleteId &&
          gameActivity.kind === 'formation_position_view_change' &&
          gameActivity?.relation?.id === positionId &&
          gameActivity.absolute_minute === props.period.absolute_duration_start
        );
      });
    }
    return assignedPosition;
  };

  const getAssignedPositionIndexByAthleteId = (athleteId) =>
    props.gameActivities.findIndex((gameActivity) => {
      return (
        gameActivity.athlete_id === athleteId &&
        gameActivity.kind === 'position_change' &&
        gameActivity.absolute_minute === props.period.absolute_duration_start
      );
    });

  const getAssignedPositionViewChangeIndexByAthleteId = (athleteId) =>
    props.gameActivities.findIndex((gameActivity) => {
      return (
        gameActivity.athlete_id === athleteId &&
        gameActivity.kind === 'formation_position_view_change' &&
        gameActivity.absolute_minute === props.period.absolute_duration_start
      );
    });

  async function updateGameActivitiesOnPositionChange(
    positionId: number | string,
    athleteId: number
  ) {
    let currentGameActivities = _cloneDeep(props.gameActivities);
    const playerPositionChangeDeletions = ([]: Array<GameActivityDeletion>);

    // Athlete already has a position selected
    const currentAthletesCurrentPosition = getAssignedPosition(
      'athlete_id',
      athleteId
    );

    if (positionId === 'SUBSTITUTE') {
      const currentAthletesCurrentPositionIndex =
        getAssignedPositionIndexByAthleteId(athleteId);
      const currentAthletesCurrentPositionViewChangeIndex =
        getAssignedPositionViewChangeIndexByAthleteId(athleteId);

      if (currentAthletesCurrentPositionIndex) {
        playerPositionChangeDeletions.push({
          id: currentGameActivities[currentAthletesCurrentPositionIndex].id,
          delete: true,
        });
        currentGameActivities.splice(currentAthletesCurrentPositionIndex, 1);
      }
      if (currentAthletesCurrentPositionViewChangeIndex) {
        playerPositionChangeDeletions.push({
          id: currentGameActivities[
            currentAthletesCurrentPositionViewChangeIndex
          ].id,
          delete: true,
        });
        currentGameActivities.splice(
          currentAthletesCurrentPositionViewChangeIndex,
          1
        );
      }
    } else {
      const newPosition = _find(
        props.formationCoordinates,
        (formationCoordinate) => {
          return formationCoordinate?.id === positionId;
        }
      );

      // Position already assigned to another athlete
      const newPositionAlreadyAssignedGameActivity = getAssignedPosition(
        'athlete_id_position_id',
        athleteId,
        newPosition.id
      );

      // Athlete already has a position selected & Position already assigned to another athlete
      if (
        currentAthletesCurrentPosition &&
        newPositionAlreadyAssignedGameActivity
      ) {
        // Get the id of the athlete already assigned to the position
        const alreadyAssignedAthleteId =
          newPositionAlreadyAssignedGameActivity?.athlete_id;

        // Find current athlete's game activities for position change
        const existingPositionChange =
          findPeriodPositionChangeActivityForAthlete(
            currentGameActivities,
            athleteId,
            props.period
          );
        const existingPlayerPitchChange =
          findPeriodPlayerPitchChangeActivityForAthlete(
            currentGameActivities,
            athleteId,
            props.period
          );

        // Find already assigned athlete's game activities for position change
        const newPositionAlreadyAssignedPlayerChange =
          findPeriodPositionChangeActivityForAthlete(
            currentGameActivities,
            alreadyAssignedAthleteId,
            props.period
          );
        const newPositionAlreadyAssignedPlayerPitchChange =
          findPeriodPlayerPitchChangeActivityForAthlete(
            currentGameActivities,
            alreadyAssignedAthleteId,
            props.period
          );

        // Reassign current athlete's game activities
        existingPositionChange.athlete_id = alreadyAssignedAthleteId;
        existingPlayerPitchChange.athlete_id = alreadyAssignedAthleteId;

        // Assign current athlete to new position game activities
        newPositionAlreadyAssignedPlayerChange.athlete_id = athleteId;
        newPositionAlreadyAssignedPlayerPitchChange.athlete_id = athleteId;

        // Athlete already has a position selected
      } else if (currentAthletesCurrentPosition) {
        // currentGameActivities.push(newPositionGameActivity);
        const existingPositionChange =
          findPeriodPositionChangeActivityForAthlete(
            currentGameActivities,
            athleteId,
            props.period
          );
        existingPositionChange.relation.id = newPosition.position.id;

        // findPeriodPlayerPitchChangeActivityForAthlete
        const existingPlayerPitchChange =
          findPeriodPlayerPitchChangeActivityForAthlete(
            currentGameActivities,
            athleteId,
            props.period
          );
        existingPlayerPitchChange.relation.id = positionId;

        // New position is already assigned to another athlete
      } else if (newPositionAlreadyAssignedGameActivity) {
        currentGameActivities = updatePlayerFormationViewChange({
          gameActivities: currentGameActivities,
          playerId: athleteId,
          prevPlayerId: newPositionAlreadyAssignedGameActivity.athlete_id,
          currentPeriodMinute: +props.period.absolute_duration_start,
        });
      } else {
        const newPositionData: PositionData = {
          id: newPosition.id,
          position: {
            id: newPosition.position.id,
            abbreviation: newPosition.position.abbreviation,
          },
        };
        const playerAssignedActivities = createPlayerFormationViewChange({
          playerId: +athleteId,
          positionInfo: newPositionData,
          periodMin: +props.period.absolute_duration_start,
        });

        currentGameActivities = [
          ...currentGameActivities,
          ...playerAssignedActivities,
        ];
      }
    }

    // $FlowIgnore Passing currentGameActivities: Array<GameActivity> in update, missing athlete_id for <GameActivityForm>
    await gameActivitiesPeriodBulkSave(props.event.id, props.period.id, [
      ...playerPositionChangeDeletions,
      ...currentGameActivities,
    ]).then((updatedGameActivities) => {
      props.setGameActivities(updatedGameActivities);
      props.onGameActivitiesUpdate({
        updates: updatedGameActivities,
        deletions: playerPositionChangeDeletions,
      });
    });
  }

  const handleUpdateAthleteStartingPosition = async (
    positionId: number | string,
    athleteId: number
  ) => {
    const currentSelectedPositions = [...selectedPositions];

    // Check if the position is already selected
    const positionSelectedIndex = currentSelectedPositions.findIndex(
      (selectedPosition) => {
        return selectedPosition.position_id === positionId;
      }
    );

    // Check if the athlete already has a position selected
    const athleteCurrentPositionSelectedIndex =
      currentSelectedPositions.findIndex((selectedPosition) => {
        return selectedPosition.athlete_id === athleteId;
      });

    if (positionId === 'SUBSTITUTE') {
      if (athleteCurrentPositionSelectedIndex > -1) {
        // SUBSTITUTE selected and Athlete already has a position selected
        currentSelectedPositions[athleteCurrentPositionSelectedIndex] = {
          position_id: 'SUBSTITUTE',
          athlete_id: athleteId,
          position: undefined,
        };
      } else {
        // SUBSTITUTE selected and Athlete does not already have a position selected
        currentSelectedPositions.push({
          position_id: 'SUBSTITUTE',
          athlete_id: athleteId,
          position: undefined,
        });
      }
    } else if (positionSelectedIndex === -1) {
      if (athleteCurrentPositionSelectedIndex === -1) {
        // Position not already selected and athlete does not have a position selected
        const newPosition = _find(
          props.formationCoordinates,
          (formationCoordinate) => {
            return formationCoordinate?.id === positionId;
          }
        );
        currentSelectedPositions.push({
          position_id: positionId,
          athlete_id: athleteId,
          position: newPosition,
        });
      } else {
        // Athlete already has a position selected
        currentSelectedPositions[athleteCurrentPositionSelectedIndex] = {
          position_id: positionId,
          athlete_id: athleteId,
          position: _find(props.formationCoordinates, (formationCoordinate) => {
            return formationCoordinate?.id === positionId;
          }),
        };
      }
    } else {
      // Position has already been selected for another athlete
      // Get the athlete_id of the athlete already in that position
      const positionCurrentAthlete =
        currentSelectedPositions[positionSelectedIndex].athlete_id;
      currentSelectedPositions[positionSelectedIndex].athlete_id = athleteId;

      // Need to update the GameEventListViewCell to re-assign / un-assign the existing athlete's selection
      if (athleteCurrentPositionSelectedIndex > -1) {
        currentSelectedPositions[
          athleteCurrentPositionSelectedIndex
        ].athlete_id = positionCurrentAthlete;
      }
    }

    setSelectedPositions(currentSelectedPositions);
    await updateGameActivitiesOnPositionChange(positionId, athleteId);
  };

  const getCellGameActivities = (athlete, columnId) => {
    if (props.isPitchViewEnabled && columnId === eventTypes.sub) {
      return props.gameActivities.filter(
        (gameActivity) =>
          gameActivity.athlete_id === athlete.id &&
          (gameActivity.kind === columnId ||
            gameActivity.kind === eventTypes.switch)
      );
    }

    if (props.isPitchViewEnabled && isOwnGoalFeatureEnabled) {
      // Exclude goals that have a linked own goal from the standard goal column
      if (columnId === eventTypes.goal) {
        return props.gameActivities.filter(
          (gameActivity) =>
            gameActivity.athlete_id === athlete.id &&
            gameActivity.kind === eventTypes.goal &&
            !doesOwnGoalExistForEvent(props.gameActivities, gameActivity)
        );
      }
      // Display only goals that have a linked own goal in the own goal column
      if (columnId === eventTypes.own_goal) {
        return props.gameActivities.filter(
          (gameActivity) =>
            gameActivity.athlete_id === athlete.id &&
            gameActivity.kind === eventTypes.goal &&
            doesOwnGoalExistForEvent(props.gameActivities, gameActivity)
        );
      }
    }

    return props.gameActivities.filter(
      (gameActivity) =>
        gameActivity.athlete_id === athlete.id && gameActivity.kind === columnId
    );
  };

  const getDefaultGameEventListViewCell = (athlete, columnId) => {
    let isColumnCellDisabled = false;
    if (
      isManualPlayerMinutesEditingAllowed &&
      props.isPitchViewEnabled &&
      [eventTypes.sub, eventTypes.switch].includes(columnId)
    ) {
      isColumnCellDisabled = props.isMidGamePlayerPositionChangeDisabled;
    }

    return (
      <GameEventListViewCell
        athlete={athlete}
        athletes={props.athletes}
        event={props.event}
        positionGroups={props.positionGroups}
        gameActivityKind={columnId}
        gameActivities={props.gameActivities}
        cellGameActivities={getCellGameActivities(athlete, columnId)}
        onGameActivitiesUpdate={props.onGameActivitiesUpdate}
        canEditEvent={determineIfEventEditable(columnId, athlete.id)}
        period={props.period}
        periodDuration={props.periodDurations?.find(
          (a) => a.id === props.period?.id
        )}
        formationCoordinates={props.formationCoordinates}
        preventGameEvents={props.preventGameEvents}
        dispatchMandatoryFieldsToast={props.dispatchMandatoryFieldsToast}
        updateAthleteStartingPosition={handleUpdateAthleteStartingPosition}
        hasPeriodStarted={props.hasPeriodStarted}
        athleteStartingPosition={getAthleteStartingPosition(athlete.id)}
        isCellDisabled={isColumnCellDisabled}
      />
    );
  };

  const getCellContent = (columnId, athlete) => {
    const manualAthletePeriodPlayTimeInfo = getManualAthletePlayTimeForPeriod(
      athlete.id,
      localAthletePlayTimes,
      +props.period?.id
    );

    switch (columnId) {
      case 'athlete':
        return (
          <div css={gridStyles.athleteCell}>
            <UserAvatar
              url={athlete.avatar_url}
              firstname={athlete.fullname}
              displayInitialsAsFallback={false}
              size="EXTRA_SMALL"
              availability={athlete.availability}
            />
            <div css={gridStyles.athleteCellMeta}>
              <div css={gridStyles.athleteName}>{athlete.fullname}</div>
              <div css={gridStyles.athletePosition}>
                {athlete.position.name}
              </div>
            </div>
          </div>
        );
      case eventTypes.position_change:
      case eventTypes.sub:
      case eventTypes.yellow:
      case eventTypes.red:
      case eventTypes.goal:
      case eventTypes.own_goal:
        return getDefaultGameEventListViewCell(athlete, columnId);
      case 'starting_position':
        if (props.isPitchViewEnabled && props.hasPeriodStarted) {
          return (
            <PeriodStartingPositionCell
              gameActivities={props.gameActivities.filter(
                (gameActivity) =>
                  gameActivity.athlete_id === athlete.id &&
                  gameActivity.absolute_minute ===
                    props.period.absolute_duration_start &&
                  gameActivity.kind === 'formation_position_view_change'
              )}
              period={props.period}
            />
          );
        }
        return getDefaultGameEventListViewCell(athlete, columnId);
      case eventTypes.assist:
        if (props.isPitchViewEnabled) {
          return (
            <PeriodGoalAssistsCell
              gameActivities={props.gameActivities.filter(
                (gameActivity) =>
                  gameActivity.athlete_id === athlete.id &&
                  gameActivity.kind === 'assist'
              )}
              periodId={props.period?.id}
            />
          );
        }
        return getDefaultGameEventListViewCell(athlete, columnId);
      case eventTypes.total_time:
        return (
          <TotalTimeCell
            athleteId={athlete.id}
            type={timeCellFormat.period}
            currentPeriod={props.period}
            positionGroups={props.positionGroups}
            gameActivities={getGameActivitiesForTotalTime(
              athlete,
              props.gameActivities
            )}
            periodDurations={props.periodDurations?.filter(
              (a) => a.id === props.period?.id
            )}
            isTimeEditable={
              isManualPlayerMinutesEditingAllowed &&
              props.hasPeriodStarted &&
              !isSubOrPlayerSwapPresentInActivities
            }
            manualPlayerPeriodTimeInfo={
              isManualPlayerMinutesEditingAllowed
                ? manualAthletePeriodPlayTimeInfo
                : null
            }
            handleUpdatingManualAthletePlayTimeInfo={
              handleUpdatingManualAthletePlayTimes
            }
          />
        );
      default:
        return '';
    }
  };

  const getGridRows = () => {
    const gridRows = [];

    props.athletes.map((athlete) =>
      gridRows.push({
        id: athlete.id,
        cells: gridColumns.map((column) => ({
          id: column.id,
          content: getCellContent(column.id, athlete),
        })),
      })
    );

    return gridRows;
  };

  return (
    <div css={gridStyles.grid}>
      <DataGrid
        columns={gridColumns}
        rows={getGridRows()}
        sortableColumns={['athlete', 'position_change']}
        onClickColumnSorting={props.onClickColumnSorting}
        gridSorting={props.gridSorting}
        scrollOnBody
      />
    </div>
  );
};

export const GameEventListViewGridTranslated = withNamespaces()(
  GameEventListViewGrid
);

export default GameEventListViewGrid;
