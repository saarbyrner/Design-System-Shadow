// @flow
/* eslint-disable max-nested-callbacks */
import { useState, useEffect, useMemo, useCallback } from 'react';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import getDevelopmentGoalCompletionTypes, {
  type DevelopmentGoalCompletionType,
} from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import updateEventDevelopmentGoalsCompletionStatus, {
  type EventDevelopmentGoalsCompletionStatus,
} from '@kitman/modules/src/PlanningHub/src/services/updateEventDevelopmentGoalsCompletionStatus';
import getEventDevelopmentGoals, {
  type EventDevelopmentGoal,
  type EventDevelopmentGoalItem,
  type EventDevelopmentGoalFiltersPayload,
} from '@kitman/modules/src/PlanningHub/src/services/getEventDevelopmentGoals';
import { type Event } from '@kitman/common/src/types/Event';

import type { RequestStatus } from '../../../types';
import { INITIAL_EVENT_DEVELOPMENT_GOALS, INITIAL_FILTER } from './utils';
import type { FilterItem } from './DevelopmentGoalsFilters';
import { DevelopmentGoalsHeaderTranslated as DevelopmentGoalsHeader } from './DevelopmentGoalsHeader';
import AthleteDevelopmentGoals from './AthleteDevelopmentGoals';

export type CompletionStatus = {
  id: string,
  checked: boolean,
};

type Props = {
  event: Event,
  reloadData: boolean,
  areCoachingPrinciplesEnabled: boolean,
  developmentGoalTerminology: ?string,
};

const DevelopmentGoalsTab = (props: Props) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('LOADING');
  const [completionRequestStatus, setCompletionRequestStatus] =
    useState<RequestStatus>('LOADING');
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const [initialEventDevelopmentGoals, setInitialEventDevelopmentGoals] =
    useState<Array<EventDevelopmentGoal>>(INITIAL_EVENT_DEVELOPMENT_GOALS);
  const [eventDevelopmentGoals, setEventDevelopmentGoals] = useState<
    Array<EventDevelopmentGoal>
  >(INITIAL_EVENT_DEVELOPMENT_GOALS);
  const [developmentGoalCompletionTypes, setDevelopmentGoalCompletionTypes] =
    useState<Array<DevelopmentGoalCompletionType>>([]);
  const [filter, setFilter] =
    useState<EventDevelopmentGoalFiltersPayload>(INITIAL_FILTER);

  const eventDevelopmentGoalsItems: Array<EventDevelopmentGoalItem> = useMemo(
    () =>
      eventDevelopmentGoals.flatMap(
        (eventDevelopmentGoal) => eventDevelopmentGoal.event_development_goals
      ),
    [eventDevelopmentGoals]
  );

  const getEventDevelopmentGoalsItemsByAthlete = useCallback(
    (athleteEventId: number) =>
      eventDevelopmentGoals
        .filter(
          (eventDevelopmentGoal) =>
            eventDevelopmentGoal.athlete_event.id === athleteEventId
        )
        .flatMap(
          (eventDevelopmentGoal) => eventDevelopmentGoal.event_development_goals
        ),
    [eventDevelopmentGoals]
  );

  const withUnarchiveCompletionType: boolean = useMemo(
    () =>
      !developmentGoalCompletionTypes.every(
        (developmentGoalCompletionType) =>
          developmentGoalCompletionType.archived
      ),
    [developmentGoalCompletionTypes]
  );

  const withEventDevelopmentGoals = eventDevelopmentGoals.length > 0;

  const withCompletionTypes =
    developmentGoalCompletionTypes.length > 0 && withUnarchiveCompletionType;

  const fetchEventDevelopmentGoalsWithCompletionTypes = () => {
    setRequestStatus('LOADING');
    setCompletionRequestStatus('LOADING');

    Promise.all([
      getEventDevelopmentGoals(props.event.id, filter),
      getDevelopmentGoalCompletionTypes(),
    ]).then(
      ([
        fetchedEventDevelopmentGoals,
        fetchedEventDevelopmentGoalCompletionTypes,
      ]) => {
        setIsInitialDataLoaded(true);
        setRequestStatus('SUCCESS');
        setCompletionRequestStatus('SUCCESS');
        setInitialEventDevelopmentGoals(fetchedEventDevelopmentGoals);
        setEventDevelopmentGoals(fetchedEventDevelopmentGoals);
        setDevelopmentGoalCompletionTypes(
          fetchedEventDevelopmentGoalCompletionTypes
        );
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const fetchEventDevelopmentGoals = () => {
    setRequestStatus('LOADING');

    getEventDevelopmentGoals(props.event.id, filter).then(
      (fetchedEventDevelopmentGoals) => {
        setRequestStatus('SUCCESS');
        setEventDevelopmentGoals(fetchedEventDevelopmentGoals);
      },
      () => setRequestStatus('FAILURE')
    );
  };

  useEffect(() => {
    if (isInitialDataLoaded && !props.reloadData) {
      return;
    }

    fetchEventDevelopmentGoalsWithCompletionTypes();
  }, [props.reloadData]);

  useEffect(() => {
    if (!isInitialDataLoaded) {
      return;
    }

    fetchEventDevelopmentGoals();
  }, [filter]);

  const onUpdateEventDevelopmentGoalsCompletionStatus = (
    completionStatusParams: Array<EventDevelopmentGoalsCompletionStatus>
  ) => {
    setCompletionRequestStatus('LOADING');

    updateEventDevelopmentGoalsCompletionStatus(
      props.event.id,
      completionStatusParams
    ).then((fetchedEventDevelopmentGoalsCompletionStatus) => {
      const fetchedDevelopmentGoalIds =
        fetchedEventDevelopmentGoalsCompletionStatus.map(
          (fetchedEventDevelopmentGoal) =>
            fetchedEventDevelopmentGoal.development_goal_id
        );

      setEventDevelopmentGoals((prevEventDevelopmentGoals) =>
        prevEventDevelopmentGoals.map((prevEventDevelopmentGoal) => ({
          ...prevEventDevelopmentGoal,
          event_development_goals:
            prevEventDevelopmentGoal.event_development_goals.map(
              (eventDevelopmentGoalItem) => {
                const isChecked =
                  fetchedDevelopmentGoalIds.length > 0 &&
                  fetchedDevelopmentGoalIds.includes(
                    eventDevelopmentGoalItem.development_goal.id
                  );
                const completionTypeId =
                  fetchedEventDevelopmentGoalsCompletionStatus.find(
                    (fetchedEventDevelopmentGoal) =>
                      fetchedEventDevelopmentGoal.development_goal_id ===
                      eventDevelopmentGoalItem.development_goal.id
                  )?.development_goal_completion_type_id || null;

                return {
                  ...eventDevelopmentGoalItem,
                  checked: isChecked,
                  development_goal_completion_type_id: completionTypeId,
                };
              }
            ),
        }))
      );

      setCompletionRequestStatus('SUCCESS');
    });
  };

  const selectGoal = (
    developmentGoalId: number,
    completionTypeId: ?number | string
  ) => {
    const completionStatusParams = [
      {
        development_goal_id: developmentGoalId,
        development_goal_completion_type_id: completionTypeId,
      },
    ];

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatusParams);
  };

  const unselectGoal = (developmentGoalId: number) => {
    const completionStatusParams = [
      {
        development_goal_id: developmentGoalId,
        delete: true,
      },
    ];

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatusParams);
  };

  const selectAthleteGoals = (
    athleteEventId: number,
    completionTypeId: ?number | string
  ) => {
    const eventDevelopmentGoalsItemsByAthlete =
      getEventDevelopmentGoalsItemsByAthlete(athleteEventId);
    const completionStatusParams = eventDevelopmentGoalsItemsByAthlete.map(
      (eventDevelopmentGoalsItemByAthlete) => ({
        development_goal_id:
          eventDevelopmentGoalsItemByAthlete.development_goal.id,
        development_goal_completion_type_id: completionTypeId,
      })
    );

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatusParams);
  };

  const unselectAthleteGoals = (athleteEventId: number) => {
    const eventDevelopmentGoalsItemsByAthlete =
      getEventDevelopmentGoalsItemsByAthlete(athleteEventId);
    const completionStatusParams = eventDevelopmentGoalsItemsByAthlete.map(
      (eventDevelopmentGoalsItemByAthlete) => ({
        development_goal_id:
          eventDevelopmentGoalsItemByAthlete.development_goal.id,
        delete: true,
      })
    );

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatusParams);
  };

  const selectAllGoals = (completionTypeId: ?number | string) => {
    const completionStatuses = eventDevelopmentGoalsItems.map(
      (eventDevelopmentGoalsItemByAthlete) => ({
        development_goal_id:
          eventDevelopmentGoalsItemByAthlete.development_goal.id,
        development_goal_completion_type_id: completionTypeId,
      })
    );

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatuses);
  };

  const clearAllGoals = () => {
    const completionStatuses = eventDevelopmentGoalsItems.map(
      (eventDevelopmentGoalsItemByAthlete) => ({
        development_goal_id:
          eventDevelopmentGoalsItemByAthlete.development_goal.id,
        delete: true,
      })
    );

    onUpdateEventDevelopmentGoalsCompletionStatus(completionStatuses);
  };

  const filterByItem = (
    filterItem: FilterItem,
    filterItemIds: Array<number>
  ) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [`${filterItem}_ids`]: filterItemIds,
    }));
  };

  const filterBySearch = (searchChars: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      search: searchChars,
    }));
  };

  if (!isInitialDataLoaded && requestStatus === 'LOADING') {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div
      className="developmentGoalsTab"
      data-testid="DevelopmentGoalsTab|developmentGoalsTab"
    >
      <DevelopmentGoalsHeader
        isLoading={requestStatus === 'LOADING'}
        shouldDisplayFilters={initialEventDevelopmentGoals.length > 0}
        shouldDisplayActions={withEventDevelopmentGoals}
        eventDevelopmentGoals={initialEventDevelopmentGoals}
        developmentGoalCompletionTypes={developmentGoalCompletionTypes}
        withCompletionTypes={withCompletionTypes}
        developmentGoalTerminology={props.developmentGoalTerminology}
        areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
        onFilterByItem={filterByItem}
        onFilterBySearch={filterBySearch}
        onSelectAllGoals={selectAllGoals}
        onClearAllGoals={clearAllGoals}
      />
      {withEventDevelopmentGoals &&
        eventDevelopmentGoals.map((eventDevelopmentGoal) => (
          <AthleteDevelopmentGoals
            // $FlowIgnore[incompatible-type] the type is correct here.
            event={props.event}
            key={eventDevelopmentGoal.athlete_event.id}
            isLoading={completionRequestStatus === 'LOADING'}
            athleteEventId={eventDevelopmentGoal.athlete_event.id}
            athleteSettings={{
              avatarUrl: eventDevelopmentGoal.athlete_event.athlete.avatar_url,
              name: eventDevelopmentGoal.athlete_event.athlete.fullname,
              position:
                eventDevelopmentGoal.athlete_event.athlete.position.name,
            }}
            eventDevelopmentGoalItems={
              eventDevelopmentGoal.event_development_goals
            }
            withCompletionTypes={withCompletionTypes}
            withUnarchiveCompletionType={withUnarchiveCompletionType}
            developmentGoalCompletionTypes={developmentGoalCompletionTypes}
            onSelectGoal={selectGoal}
            onUnselectGoal={unselectGoal}
            onSelectAthleteGoals={selectAthleteGoals}
            onUnselectAthleteGoals={unselectAthleteGoals}
            areCoachingPrinciplesEnabled={props.areCoachingPrinciplesEnabled}
          />
        ))}
    </div>
  );
};
export default DevelopmentGoalsTab;
