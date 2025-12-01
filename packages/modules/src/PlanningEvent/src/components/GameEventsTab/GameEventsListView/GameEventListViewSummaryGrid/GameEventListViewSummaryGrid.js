// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DataGrid, Select, ToggleSwitch, UserAvatar } from '@kitman/components';
import type { GridSorting } from '@kitman/components/src/types';
import type {
  Athlete,
  AthleteEventStorage,
  Game,
} from '@kitman/common/src/types/Event';
import {
  timeCellFormat,
  eventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import { getGameActivitiesForTotalTime } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import type {
  AthletePlayTime,
  GameActivityStorage,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import updateAttributes from '@kitman/modules/src/PlanningEvent/src/services/updateAttributes';
import type {
  ParticipationLevel,
  AthleteFilter,
} from '@kitman/modules/src/PlanningEvent/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { BulkEditTooltipTranslated as BulkEditTooltip } from '@kitman/modules/src/PlanningEvent/src/components/GridComponents/BulkEditTooltip';
import { getOwnGoals } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';

import { GameEventListViewCellTranslated as GameEventListViewCell } from '../GameEventListViewCell';
import { TotalTimeCellTranslated as TotalTimeCell } from '../TotalTimeCell';
import gridStyles from '../GridStyles';
import { getPeriodDurations } from '../../Helpers';

type Props = {
  event: Game,
  athletes: Array<Athlete>,
  gridSorting: GridSorting,
  canEditEvent: boolean,
  participationLevels: Array<ParticipationLevel>,
  positionGroups: Array<PositionGroup>,
  athleteFilter: AthleteFilter,
  onClickColumnSorting: ({ column: string | number, order: string }) => void,
  onAttributesBulkUpdate: () => void,
  onAttributesUpdate: (Object, ?number) => void,
};

const GameEventListViewSummaryGrid = (props: I18nProps<Props>) => {
  const isManualPlayerMinutesEditingAllowed =
    window.featureFlags['set-overall-game-minutes'];
  const isOwnGoalFeatureEnabled = window.getFlag(
    'league-ops-game-events-own-goal'
  );

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const { localEventPeriods: eventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const { apiAthleteEvents: athleteEvents } = useSelector<AthleteEventStorage>(
    (state) => state.planningEvent.athleteEvents
  );

  const periodDurations = getPeriodDurations(eventPeriods);

  const { localAthletePlayTimes } = useSelector(
    (state) => state.planningEvent.athletePlayTimes
  );

  const [disabledRows, setDisabledRows] = useState([]);

  const updateAttribute = (attributes, athlete) => {
    const isSingleRowEdit = Boolean(athlete);

    // Disable the rows that we are going to be updated
    setDisabledRows((prevDisabledRows) =>
      isSingleRowEdit
        ? [...prevDisabledRows, athlete?.id]
        : props.athletes.map((ath) => ath.id)
    );

    updateAttributes({
      eventId: props.event.id,
      attributes,
      athleteId: isSingleRowEdit ? athlete?.id : null,
      tab: 'athletes_tab',
      filters: props.athleteFilter,
    }).then(
      // Update succeed
      (athletesGrid) => {
        // re-enable the rows
        setDisabledRows((prevDisabledRows) =>
          isSingleRowEdit
            ? prevDisabledRows.filter((rowId) => rowId !== athlete?.id)
            : []
        );

        // Update the grid data
        if (isSingleRowEdit) {
          props.onAttributesUpdate(
            athletesGrid.rows?.find((row) => row.athlete.id === athlete?.id),
            athlete?.id
          );
        } else {
          props.onAttributesBulkUpdate();
        }
      },
      // Update fails
      () => {}
    );
  };

  const isParticipationNone = (participationId) => {
    return (
      props.participationLevels?.find(({ value }) => value === participationId)
        ?.canonical_participation_level === 'none'
    );
  };

  const getGridColumns = () => {
    const gridColumns = [
      {
        id: 'athlete',
        content: props.t('Athlete'),
        isHeader: true,
        key: null,
      },
      {
        id: 'total_time',
        content: props.t('Total minutes'),
        isHeader: true,
        key: null,
      },
      {
        id: 'participation_level',
        content: props.canEditEvent ? (
          <BulkEditTooltip
            type="SELECT"
            options={props.participationLevels}
            columnName={props.t('Participation')}
            onApply={(value) =>
              updateAttribute({
                participation_level: value,
              })
            }
          />
        ) : (
          props.t('Participation')
        ),
        isHeader: true,
        key: null,
      },

      {
        id: 'include_in_group_calculations',
        content: (
          <div className="planningEventGridTab__headerCell--include_in_group_calculations">
            {props.canEditEvent ? (
              <BulkEditTooltip
                type="TOGGLE"
                columnName={props.t('Group calculations')}
                onApply={(value) =>
                  updateAttribute({ include_in_group_calculations: value })
                }
              />
            ) : (
              props.t('Group calculations')
            )}
          </div>
        ),
        isHeader: true,
        key: null,
      },
      {
        id: 'yellow_card',
        content: (
          <>
            <i css={gridStyles.headerIcon} className="icon-yellow-card" />
            {props.t('Yellow')}
          </>
        ),
        isHeader: true,
        key: null,
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
        key: null,
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
        key: null,
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
        key: null,
      },
    ];

    if (isOwnGoalFeatureEnabled) {
      gridColumns.push({
        id: 'own_goal',
        content: (
          <>
            <i
              css={[gridStyles.headerIcon, gridStyles.ownGoalIcon]}
              className="icon-ball"
            />
            {props.t('Own Goal')}
          </>
        ),
        isHeader: true,
        key: null,
      });
    }

    [...eventPeriods].reverse().forEach((period) => {
      gridColumns.splice(1, 0, {
        id: `period_${period.id}`,
        content: period.name,
        isHeader: true,
        key: period.id,
      });
    });

    return gridColumns;
  };

  const getAthleteParticipationLevel = (athleteId) => {
    // the callback doesn't return a participation_level object after update but does return it as an integer, so need to do a check which is available
    const participationLevelId =
      athleteEvents.find(
        (athleteEvent) => athleteId === athleteEvent.athlete.id
      )?.participation_level.id ||
      athleteEvents.find(
        (athleteEvent) => athleteId === athleteEvent.athlete.id
      )?.participation_level;
    return participationLevelId;
  };

  const getIncludeInGroupCalculations = (athleteId) => {
    const includeInGroupCalculations = athleteEvents.find(
      (athleteEvent) => athleteId === athleteEvent.athlete.id
    )?.include_in_group_calculations;
    return includeInGroupCalculations;
  };

  const renderAthleteCell = (athlete: Athlete) => (
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
        <div css={gridStyles.athletePosition}>{athlete.position.name}</div>
      </div>
    </div>
  );

  const renderParticipationLevelCell = (athlete: Athlete) => (
    <Select
      options={props.participationLevels}
      onChange={(value) =>
        updateAttribute(
          {
            participation_level: value,
          },
          athlete
        )
      }
      value={getAthleteParticipationLevel(athlete.id)}
      placeholder={props.t('Participation')}
      isDisabled={disabledRows.includes(athlete.id)}
      appendToBody
    />
  );

  const renderInGroupCalculationsCell = (athlete: Athlete) => (
    <ToggleSwitch
      isSwitchedOn={getIncludeInGroupCalculations(athlete.id)}
      toggle={() =>
        updateAttribute(
          {
            include_in_group_calculations: !getIncludeInGroupCalculations(
              athlete.id
            ),
          },
          athlete
        )
      }
      isDisabled={
        isParticipationNone(getAthleteParticipationLevel(athlete.id)) ||
        disabledRows.includes(athlete.id)
      }
    />
  );

  const renderTotalTimeCell = (
    athlete: Athlete,
    manualAthleteSummaryPlayTimeInfo: ?Array<AthletePlayTime>
  ) => (
    <TotalTimeCell
      athleteId={athlete.id}
      type={timeCellFormat.summary}
      positionGroups={props.positionGroups}
      gameActivities={getGameActivitiesForTotalTime(athlete, gameActivities)}
      periodDurations={periodDurations}
      athleteName={athlete.fullname}
      manualPlayerSummaryTimeInfo={
        isManualPlayerMinutesEditingAllowed
          ? manualAthleteSummaryPlayTimeInfo
          : null
      }
    />
  );

  const renderGameEventsListViewCell = (athlete: Athlete, key: ?number) => (
    <GameEventListViewCell
      athlete={athlete}
      event={props.event}
      positionGroups={props.positionGroups}
      gameActivityKind={eventTypes.position_change}
      gameActivities={gameActivities}
      cellGameActivities={gameActivities.filter(
        (gameActivity) =>
          gameActivity.athlete_id === athlete.id &&
          gameActivity.kind === eventTypes.position_change &&
          gameActivity.game_period_id === key
      )}
      canEditEvent={false}
      hideGameActivityMinute
    />
  );

  const getCellContent = (columnId: string, athlete: Athlete, key: ?number) => {
    const manualAthleteSummaryPlayTimeInfo = localAthletePlayTimes.filter(
      (playTimes) => playTimes.athlete_id === athlete?.id
    );

    switch (columnId) {
      case 'athlete':
        return renderAthleteCell(athlete);
      case 'participation_level':
        if (!props.canEditEvent) {
          return props.participationLevels.find(
            (participation) =>
              getAthleteParticipationLevel(athlete) === participation.value
          )?.label;
        }
        return renderParticipationLevelCell(athlete);
      case 'include_in_group_calculations': {
        if (!props.canEditEvent) {
          return getIncludeInGroupCalculations(athlete.id)
            ? props.t('Yes')
            : props.t('No');
        }
        return renderInGroupCalculationsCell(athlete);
      }
      case eventTypes.yellow:
      case eventTypes.red:
      case eventTypes.assist:
        return gameActivities.filter(
          (gameActivity) =>
            gameActivity.athlete_id === athlete.id &&
            gameActivity.kind === columnId
        ).length;
      case eventTypes.goal:
      case eventTypes.own_goal: {
        const ownGoalActivities = isOwnGoalFeatureEnabled
          ? getOwnGoals(gameActivities, athlete.id).length
          : 0;

        if (columnId === eventTypes.goal) {
          const goalActivities = gameActivities.filter(
            (gameActivity) =>
              gameActivity.athlete_id === athlete.id &&
              gameActivity.kind === eventTypes.goal
          ).length;

          return goalActivities - ownGoalActivities;
        }
        return ownGoalActivities;
      }
      case 'total_time':
        return renderTotalTimeCell(athlete, manualAthleteSummaryPlayTimeInfo);
      default:
        return renderGameEventsListViewCell(athlete, key);
    }
  };

  const getGridRows = () => {
    const gridRows = [];
    const gridCols = getGridColumns();

    props.athletes.map((athlete) =>
      gridRows.push({
        id: athlete.id,
        cells: gridCols.map((column) => ({
          id: column.id,
          content: getCellContent(column.id, athlete, column.key),
        })),
      })
    );

    return gridRows;
  };

  return (
    <div css={gridStyles.grid}>
      <DataGrid
        columns={getGridColumns()}
        rows={getGridRows()}
        sortableColumns={['athlete']}
        onClickColumnSorting={props.onClickColumnSorting}
        gridSorting={props.gridSorting}
        scrollOnBody
      />
    </div>
  );
};

export const GameEventListViewSummaryGridTranslated = withNamespaces()(
  GameEventListViewSummaryGrid
);

export default GameEventListViewSummaryGrid;
