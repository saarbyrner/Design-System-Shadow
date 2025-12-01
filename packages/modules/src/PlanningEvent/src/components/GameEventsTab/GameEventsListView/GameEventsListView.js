// @flow
import { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import _unionBy from 'lodash/unionBy';
import _pullAllBy from 'lodash/pullAllBy';
import _omit from 'lodash/omit';
import { isEqual } from 'lodash';
import type {
  Game,
  Athlete,
  AthleteEventStorage,
} from '@kitman/common/src/types/Event';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';

import type { GridSorting } from '@kitman/components/src/types';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import {
  addEventPeriod,
  updateEventPeriod,
  getEventPeriods,
  deleteEventPeriod,
  updateEventPeriodOrder,
  duplicateEventPeriod,
} from '@kitman/modules/src/PlanningEvent/src/services/eventPeriods';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';
import {
  getGameActivities,
  gameActivitiesPeriodBulkSave,
} from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type {
  GameActivity,
  GameActivityStorage,
  GamePeriod,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import type { ParticipationLevel } from '@kitman/modules/src/PlanningEvent/types';
import type { PitchViewInitialState } from '@kitman/common/src/types/PitchView';
import type { GameActivityForm } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  clearPeriodActivities,
  getCurrentLocalPeriods,
} from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import {
  findPeriodFormationCompleteActivity,
  getMostRecentFormation,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { setApiAthleteEvents } from '@kitman/modules/src/PlanningEvent/src/redux/slices/athleteEventsSlice';
import { setFormationCoordinates } from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';

import { GameEventListViewSummaryHeaderTranslated as GameEventListViewSummaryHeader } from './GameEventListViewSummaryHeader/GameEventListViewSummaryHeader';
import { GameEventListViewHeaderTranslated as GameEventListViewHeader } from './GameEventListViewHeader/GameEventListViewHeader';
import { GameEventListViewSummaryGridTranslated as GameEventListViewSummaryGrid } from './GameEventListViewSummaryGrid/GameEventListViewSummaryGrid';
import { GameEventListViewGridTranslated as GameEventListViewGrid } from './GameEventListViewGrid/GameEventListViewGrid';
import { PeriodsSidePanelTranslated as PeriodsSidePanel } from './PeriodsSidePanel/PeriodsSidePanel';
import {
  transformGameActivitiesDataFromServer,
  sortAthletes,
  orderAthletesByStartPosition,
  getLineUpFormationCoordinates,
} from '../utils';
import PlanningTab from '../../PlanningTabLayout';
import { AddPeriodPanelTranslated as AddPeriodPanel } from './AddPeriodPanel/AddPeriodPanel';
import { getPeriodDurations } from '../Helpers';
import styles from '../styles';
import { handleListChangingFormationPitchAssignments } from './shared/listViewUtils';

const MemoizedGameActivitiesSummaryGrid = memo(GameEventListViewSummaryGrid);
const MemoizedGamePeriodActivitiesGrid = memo(GameEventListViewGrid);

type Props = {
  canEditEvent: boolean,
  event: Game,
  isDmrLocked?: boolean,
  pageRequestStatus: string,
  formations: Array<Formation>,
  positionGroups: Array<PositionGroup>,
  selectedPeriod: GamePeriod,
  setSelectedPeriod: (?GamePeriod) => void,
  periodToUpdate: GamePeriod,
  setPeriodToUpdate: (?GamePeriod) => void,
  participationLevels: Array<ParticipationLevel>,
  isPitchViewEnabled: boolean,
  preventGameEvents: boolean,
  isCustomPeriods: boolean,
  isMidGamePlayerPositionChangeDisabled: boolean,
  isLastPeriodSelected: boolean,
  getInitialData: () => void,
  handleDeletePeriod: (GamePeriod, boolean) => void,
  dispatchMandatoryFieldsToast: () => void,
  setPageRequestStatus: (string) => void,
  setEventPeriods: (Array<GamePeriod>) => void,
  setApiGameActivities: (Array<GameActivity>) => void,
  setLocalGameActivities: (Array<GameActivity>) => void,
};

export const INITIAL_ATHLETE_FILTER = {
  athlete_name: '',
  positions: [],
  squads: [],
  availabilities: [],
  participation_levels: [],
};

const GameEventsListView = (props: Props) => {
  const dispatch = useDispatch();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { localEventPeriods: eventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );
  const currentEventPeriods = getCurrentLocalPeriods(eventPeriods);

  const { apiAthleteEvents: athleteEvents } = useSelector<AthleteEventStorage>(
    (state) => state.planningEvent.athleteEvents
  );

  const { formationCoordinates, field } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [gridSorting, setGridSorting] = useState<GridSorting>({
    column: null,
    order: null,
  });
  const [isPeriodGridOpen, setIsPeriodGridOpen] = useState(false);
  const [isSummaryPanelOpen, setIsSummaryPanelOpen] = useState(true);
  const [isPeriodsPanelOpen, setIsPeriodsPanelOpen] = useState(true);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [athletes, setAthletes] = useState<Array<Athlete>>([]);

  const openPeriodGrid = (period: GamePeriod) => {
    const periodDuration =
      typeof period.duration !== 'number'
        ? parseFloat(period.duration)
        : period.duration;
    const parsedPeriod = { ...period, duration: periodDuration };
    props.setSelectedPeriod(parsedPeriod);
    setIsSummaryPanelOpen(false);
    setIsPeriodGridOpen(true);
  };

  const openSummaryGrid = () => {
    props.setSelectedPeriod(null);
    setIsPeriodGridOpen(false);
    setIsSummaryPanelOpen(true);
  };

  const hasPeriodStarted = !!findPeriodFormationCompleteActivity(
    gameActivities,
    props.selectedPeriod
  );

  useEffect(() => {
    props.setSelectedPeriod(null);
  }, []);

  useEffect(() => {
    const athletesList = athleteEvents.map(
      (athleteEvent) => athleteEvent.athlete
    );
    const athletesSortedByStartPosition = orderAthletesByStartPosition(
      athletesList,
      gameActivities,
      props.positionGroups
    );

    setAthletes(athletesSortedByStartPosition);
  }, [props.positionGroups, athleteEvents]);

  useEffect(() => {
    // if the period is changed via the timelines
    if (props.selectedPeriod !== null) {
      setIsPeriodGridOpen(true);
      setIsSummaryPanelOpen(false);
    } else {
      setIsSummaryPanelOpen(true);
      setIsPeriodGridOpen(false);
    }
  }, [props.selectedPeriod]);

  useEffect(() => {
    // set to first period if no game activities and only one period
    if (
      !isPeriodGridOpen &&
      gameActivities.length === 0 &&
      currentEventPeriods.length === 1
    ) {
      openPeriodGrid(currentEventPeriods[0]);
    }
  }, [gameActivities, currentEventPeriods, isPeriodGridOpen]);

  useEffect(
    () =>
      setAthletes((prevAthletes) =>
        sortAthletes(gridSorting, [...prevAthletes])
      ),
    [gridSorting]
  );

  const updateGameActivities = useCallback(
    ({ updates, deletions }) => {
      // unionBy updates the activities
      const updatedGameActivities = _unionBy(updates, gameActivities, 'id');

      const mappedDeletions = gameActivities.filter((activity) => {
        return deletions.some((f) => {
          return f.id === activity.id;
        });
      });

      // pullAllBy removes deleted activities
      props.setApiGameActivities(
        _pullAllBy(updatedGameActivities, mappedDeletions, 'id')
      );
    },
    [gameActivities]
  );

  const updateGridOrder = useCallback(
    (newGridSorting) => setGridSorting(newGridSorting),
    []
  );

  const activitiesForPeriod = gameActivities.filter(
    (gameActivity) => gameActivity.game_period_id === props.selectedPeriod?.id
  );

  const deletePeriod = async (period: GamePeriod) => {
    if (props.isPitchViewEnabled) {
      await props.handleDeletePeriod(period, props.isCustomPeriods);
      openSummaryGrid();
    } else {
      props.setPageRequestStatus('LOADING');
      deleteEventPeriod(props.event.id, period.id).then(() => {
        const filteredPeriods = currentEventPeriods.filter(
          (p) => p.id !== period.id
        );
        props.setEventPeriods(filteredPeriods);
        openSummaryGrid();
        props.setPageRequestStatus('SUCCESS');
      });
    }
  };

  const duplicatePeriod = (period: GamePeriod) => {
    props.setPageRequestStatus('LOADING');
    duplicateEventPeriod(props.event.id, period.id).then((newperiod) => {
      Promise.all([
        getGameActivities({ eventId: props.event.id }),
        getEventPeriods({ eventId: props.event.id }),
      ]).then(
        ([fetchedGameActivities, fetchedEventPeriods]) => {
          props.setApiGameActivities(
            transformGameActivitiesDataFromServer(fetchedGameActivities)
          );
          props.setEventPeriods(fetchedEventPeriods);
          props.setPageRequestStatus('SUCCESS');

          const newPeriodDuration =
            typeof newperiod.duration !== 'number'
              ? parseFloat(newperiod.duration)
              : newperiod.duration;

          openPeriodGrid({ ...newperiod, duration: newPeriodDuration });
        },
        () => props.setPageRequestStatus('FAILURE')
      );
    });
  };

  const saveFormations = async (
    period: GamePeriod,
    formationChangeUpdates: Array<GameActivityForm>,
    formationChangeDeletions: Array<GameActivityForm>
  ) => {
    const invalidFields = formationChangeUpdates.filter(
      (formationChangeUpdate) =>
        !formationChangeUpdate.validation.minute.valid ||
        !formationChangeUpdate.validation.relation_id.valid
    );
    if (invalidFields.length > 0) {
      return;
    }
    let gameActivitiesToUpdate = formationChangeUpdates;
    let clearedActivities = [];

    if (props.isPitchViewEnabled) {
      if (!hasPeriodStarted) {
        clearedActivities = clearPeriodActivities({
          gameActivities,
          currentPeriod: period,
          isLastPeriodSelected: props.isLastPeriodSelected,
        }).filter((activity) => activity.delete);

        gameActivitiesToUpdate = [
          ...clearedActivities,
          ...gameActivitiesToUpdate,
        ];
      } else {
        gameActivitiesToUpdate =
          await handleListChangingFormationPitchAssignments({
            allGameActivities: gameActivities,
            selectedPeriod: props.selectedPeriod,
            athletes,
            formations: props.formations,
            formationCoordinates,
            formationGameActivities: gameActivitiesToUpdate,
          });
        gameActivitiesToUpdate = gameActivitiesToUpdate.flat();
      }
    }

    gameActivitiesPeriodBulkSave(
      props.event.id,
      period.id,
      [...formationChangeDeletions, ...gameActivitiesToUpdate].map(
        (gameActivity) => _omit(gameActivity, ['validation'])
      )
    ).then(async (updatedFormationChanges) => {
      props.setPeriodToUpdate(period);
      if (props.selectedPeriod?.id === period.id) {
        props.setSelectedPeriod(period);
      }
      setIsAddPeriodModalOpen(false);
      if (props.isPitchViewEnabled && hasPeriodStarted) {
        const upToDateActivities = transformGameActivitiesDataFromServer(
          await getGameActivities({ eventId: props.event.id })
        );

        const foundFormation = getMostRecentFormation(
          upToDateActivities,
          props.selectedPeriod
        );

        const updatedCoordinates = await getLineUpFormationCoordinates(
          field.id,
          +foundFormation?.relation?.id
        );
        dispatch(setFormationCoordinates(updatedCoordinates));
        props.setApiGameActivities(upToDateActivities);
      } else {
        updateGameActivities({
          updates: updatedFormationChanges,
          deletions: [...formationChangeDeletions, ...clearedActivities],
        });
      }
    });
  };

  const onPeriodAdd = (
    period: GamePeriod,
    formationChanges: Array<GameActivityForm>,
    formationChangeDeletions: Array<GameActivityForm>
  ) => {
    addEventPeriod(
      props.event.id,
      period.name,
      period.duration,
      period.additional_duration
    ).then((newperiod) => {
      currentEventPeriods.push(newperiod);

      saveFormations(newperiod, formationChanges, formationChangeDeletions);
    });
  };

  const onPeriodUpdate = (
    period: GamePeriod,
    formationChanges: Array<GameActivityForm>,
    formationChangeDeletions: Array<GameActivityForm>
  ) => {
    if (props.isPitchViewEnabled) {
      saveFormations(period, formationChanges, formationChangeDeletions);
    } else {
      updateEventPeriod(
        props.event.id,
        period.id,
        period.name,
        period.duration,
        period.additional_duration
      ).then(() => {
        props.setEventPeriods(
          eventPeriods.map((p) => (p.id === period.id ? period : p))
        );
        saveFormations(period, formationChanges, formationChangeDeletions);
      });
    }
  };

  const updateAthleteTabGridAttributes = (
    updatedRow: Object,
    athleteId: number
  ) => {
    let newRows;
    if (updatedRow) {
      const foundParticipationLevel = props.participationLevels.find(
        (level) => level.value === updatedRow.participation_level
      );
      newRows = athleteEvents.map((row) => {
        if (row.athlete.id === athleteId)
          return {
            ...row,
            participation_level: {
              id: foundParticipationLevel?.value,
              name: foundParticipationLevel?.label,
              canonical_participation_level:
                foundParticipationLevel?.canonical_participation_level,
              include_in_group_calculations:
                foundParticipationLevel?.include_in_group_calculations,
            },
          };
        return row;
      });
    } else {
      newRows = athleteEvents.filter((row) => row.id !== athleteId);
    }
    dispatch(setApiAthleteEvents(newRows));
  };

  const addPeriod = () => {
    props.setPeriodToUpdate(null);
    setIsAddPeriodModalOpen(true);
  };

  const editPeriod = (period: GamePeriod) => {
    props.setPeriodToUpdate(period);
    setIsAddPeriodModalOpen(true);
  };

  const updatePeriodOrder = (periods: Array<GamePeriod>) => {
    updateEventPeriodOrder(
      props.event.id,
      periods.map((period) => period.id)
    ).then(() => {
      props.setEventPeriods(periods);
    });
  };

  const getLastPeriodDuration = (): number => {
    const orderedPeriods = currentEventPeriods.sort(
      (a, b) => a.order - b.order
    );
    const lastPeriod = orderedPeriods[orderedPeriods.length - 1];
    return lastPeriod?.duration;
  };

  const canUpdatePeriod = (period: ?GamePeriod, type: string): boolean => {
    if (!period) {
      return false;
    }
    // if we only have 1 period disable deletion
    if (type === 'DELETE' && (!period || currentEventPeriods.length === 1)) {
      return false;
    }
    // check if any subsequent periods have game activities saved against them. if does, then disable deletion.
    const orderedPeriods = currentEventPeriods.sort(
      (a, b) => a.order - b.order
    );
    let isvalid = true;
    orderedPeriods.forEach((a) => {
      if (a.order > period.order) {
        if (
          gameActivities.filter((b) => b.game_period_id === a.id).length > 0
        ) {
          isvalid = false;
        }
      }
    });
    return isvalid;
  };

  const getTotalGameDuration = () =>
    currentEventPeriods.reduce((a, b) => a + (+b.duration || 0), 0);

  const showPeriodGrid = () => {
    return (
      isPeriodGridOpen && (
        <>
          <GameEventListViewHeader
            pitchViewEnabled={props.isPitchViewEnabled}
            event={props.event}
            period={props.selectedPeriod}
            hasPeriodStarted={hasPeriodStarted}
            isFirstPeriodSelected={isEqual(
              props.selectedPeriod,
              currentEventPeriods[0]
            )}
            isLastPeriodSelected={props.isLastPeriodSelected}
            activitiesForPeriod={activitiesForPeriod}
            athletes={athletes}
            canDelete={canUpdatePeriod(props.selectedPeriod, 'DELETE')}
            isPeriodPanelOpen={isPeriodsPanelOpen}
            onGameActivitiesUpdate={updateGameActivities}
            onOpenPeriodPanel={() => setIsPeriodsPanelOpen(!isPeriodsPanelOpen)}
            onDelete={deletePeriod}
            onEdit={editPeriod}
            isDmrLocked={props.isDmrLocked}
          />
          <MemoizedGamePeriodActivitiesGrid
            event={props.event}
            athletes={athletes}
            positionGroups={props.positionGroups}
            gameActivities={activitiesForPeriod}
            onGameActivitiesUpdate={updateGameActivities}
            canEditEvent={props.canEditEvent}
            gridSorting={gridSorting}
            onClickColumnSorting={updateGridOrder}
            period={props.selectedPeriod}
            periodDurations={getPeriodDurations(currentEventPeriods)}
            formationCoordinates={formationCoordinates}
            isPitchViewEnabled={props.isPitchViewEnabled}
            preventGameEvents={props.preventGameEvents}
            dispatchMandatoryFieldsToast={props.dispatchMandatoryFieldsToast}
            setGameActivities={props.setLocalGameActivities}
            hasPeriodStarted={hasPeriodStarted}
            isMidGamePlayerPositionChangeDisabled={
              props.isMidGamePlayerPositionChangeDisabled
            }
          />
        </>
      )
    );
  };

  const showSummaryGrid = () => {
    return (
      isSummaryPanelOpen && (
        <>
          <GameEventListViewSummaryHeader
            gameActivities={gameActivities}
            periods={currentEventPeriods}
            onOpenPeriodPanel={() => setIsPeriodsPanelOpen(!isPeriodsPanelOpen)}
            isPeriodPanelOpen={isPeriodsPanelOpen}
          />
          <MemoizedGameActivitiesSummaryGrid
            event={props.event}
            athletes={athletes}
            positionGroups={props.positionGroups}
            canEditEvent={props.canEditEvent}
            gridSorting={gridSorting}
            participationLevels={props.participationLevels}
            athleteFilter={INITIAL_ATHLETE_FILTER}
            onAttributesBulkUpdate={props.getInitialData}
            onClickColumnSorting={updateGridOrder}
            onAttributesUpdate={(updatedRow, athleteId) =>
              updateAthleteTabGridAttributes(updatedRow, athleteId)
            }
          />
        </>
      )
    );
  };

  if (props.pageRequestStatus === 'LOADING') return <DelayedLoadingFeedback />;
  if (props.pageRequestStatus === 'FAILURE')
    return <AppStatus status="error" />;

  return (
    <>
      <AddPeriodPanel
        isOpen={isAddPeriodModalOpen}
        closeModal={() => {
          props.setPeriodToUpdate(null);
          setIsAddPeriodModalOpen(false);
        }}
        onUpdate={(periodData, formationChanges, formationChangeDeletions) =>
          onPeriodUpdate(periodData, formationChanges, formationChangeDeletions)
        }
        onAdd={(periodData, formationChanges, formationChangeDeletions) =>
          onPeriodAdd(periodData, formationChanges, formationChangeDeletions)
        }
        formations={props.formations}
        period={props.periodToUpdate}
        nextPeriodNumber={currentEventPeriods.length + 1}
        formationChanges={gameActivities
          .filter(
            (gameActivity) =>
              gameActivity.kind === eventTypes.formation_change &&
              gameActivity.game_period_id === props.periodToUpdate?.id
          )
          .sort((a, b) => +a.absolute_minute - +b.absolute_minute)}
        gameActivities={activitiesForPeriod}
        disableDurationEdit={
          !canUpdatePeriod(props.periodToUpdate, 'EDIT_DURATION')
        }
        lastPeriodDuration={getLastPeriodDuration()}
        periodDuration={getPeriodDurations(currentEventPeriods).find(
          (a) => a.id === props.periodToUpdate?.id
        )}
        gameDuration={getTotalGameDuration()}
        pitchViewEnabled={props.isPitchViewEnabled}
        hasPeriodStarted={hasPeriodStarted}
      />

      <div css={styles.listViewContainer}>
        {isPeriodsPanelOpen && (
          <PeriodsSidePanel
            event={props.event}
            setIsPeriodsPanelOpen={setIsPeriodsPanelOpen}
            onSelectPeriod={(period) => {
              openPeriodGrid(period);
            }}
            onSelectSummary={() => openSummaryGrid()}
            periods={currentEventPeriods}
            onClickAddPeriod={() => addPeriod()}
            formationChanges={gameActivities
              .filter(
                (gameActivity) =>
                  gameActivity.kind === eventTypes.formation_change
              )
              .sort((a, b) => +a.absolute_minute - +b.absolute_minute)}
            onOrderChanged={(periods) => updatePeriodOrder(periods)}
            onDuplicate={(period) => duplicatePeriod(period)}
            selectedPeriod={props.selectedPeriod}
            pitchViewEnabled={props.isPitchViewEnabled}
          />
        )}
        <PlanningTab>
          <PlanningTab.TabContent>
            {/*
          We use React.memo in combination of useCallback as each render is very expensive.
          Without those optimisations, opening the side panels is slow and the panels animation is skipped.
          Please, use useCallback for all functions passed to this component in order to prevent unnecessary rerender.
        */}

            {showSummaryGrid()}
            {showPeriodGrid()}
          </PlanningTab.TabContent>
        </PlanningTab>
      </div>
    </>
  );
};

export const GameEventsListViewTranslated =
  withNamespaces()(GameEventsListView);

export default GameEventsListView;
