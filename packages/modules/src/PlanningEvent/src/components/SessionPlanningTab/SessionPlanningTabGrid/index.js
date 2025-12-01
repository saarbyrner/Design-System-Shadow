// @flow
import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import classNames from 'classnames';
import type { EventActivity } from '@kitman/common/src/types/Event';
import type {
  Principle,
  PrincipleId,
} from '@kitman/common/src/types/Principles';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { LineLoader, TextButton, TextTag } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import getStyles from './style';
import Activity from './Activity';
import SortableActivity from './SortableActivity';

export type SessionPlanningTabGridProps = {
  isLoading: boolean,
  isDrillPanelOpen: boolean,
  isActivityPresent: boolean,
  updatedActivityId: number | null,
  areCoachingPrinciplesEnabled: boolean,
  eventId: number,
  eventSessionActivities: Array<EventActivity>,
  draggedPrinciple: Principle | null,
  activityTypes: Array<ActivityType> | null,

  onClickAddActivityDrill: (activity: EventActivity) => void,
  onDeleteActivityDrill: (activityId: number) => void,
  onEditActivityDrill: (activity: EventActivity) => void,
  showPrinciplesPanel: (activityId: number) => void,
  onDropPrinciple: (activityId: number, principleId: PrincipleId) => void,
  onDeletePrinciple: (activityId: number, principleId: PrincipleId) => void,
  onClickDeleteActivity: (activityId: number) => void,
  onUpdateActivityDuration: (activityId: number, duration: string) => void,
  onUpdateActivityType: (activityId: number, activityTypeId: number) => void,
  onReOrderSessionActivities: (
    eventId: number,
    prevEventSessionActivities: Array<EventActivity>,
    nextEventSessionActivities: Array<EventActivity>
  ) => void,
  onClickAthleteParticipation: () => void,
};

const SessionPlanningTabGrid = (
  props: I18nProps<SessionPlanningTabGridProps>
) => {
  const isDraggingPrinciple = !!props.draggedPrinciple;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const activities = props.eventSessionActivities;
  const [activeDraggingItemId, setActiveDraggingItemId] = useState(null);
  const activeActivityIndex = useMemo(() => {
    return activities.findIndex((i) => i.id === activeDraggingItemId);
  }, [activities, activeDraggingItemId]);
  const activeActivity = activities[activeActivityIndex];
  const sortEnabled = activities.length >= 2;

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!wrapperRef.current || !isDraggingPrinciple) {
      return;
    }

    wrapperRef.current.scrollLeft = 0;
  }, [isDraggingPrinciple]);

  const style = getStyles(isDraggingPrinciple);

  const onDropPrinciple = useCallback(
    (activityId: number) => {
      if (!props.draggedPrinciple) {
        return;
      }

      props.onDropPrinciple(activityId, props.draggedPrinciple.id);
    },
    [props]
  );

  const showPrinciplesPanel = useCallback(
    (activityId: number) => {
      TrackEvent('Session Planning', 'Add', 'Principle');
      props.showPrinciplesPanel(activityId);
    },
    [props]
  );

  const onDeletePrinciple = useCallback(
    (activityId: number, principleId: PrincipleId) => {
      TrackEvent('Session Planning', 'Remove', 'Principle');
      props.onDeletePrinciple(activityId, principleId);
    },
    [props]
  );

  const onClickDeleteActivity = useCallback(
    (activityId: number) => {
      TrackEvent('Session Planning', 'Delete', 'Activity');
      props.onClickDeleteActivity(activityId);
    },
    [props]
  );

  const onUpdateActivityDuration = useCallback(
    (activityId: number, value: string) => {
      TrackEvent('Session Planning', 'Add', 'Minutes');
      props.onUpdateActivityDuration(activityId, value);
    },
    [props]
  );

  const onDragStart = useCallback((event) => {
    setActiveDraggingItemId(event.active.id);
  }, []);

  const onDragEnd = useCallback(
    (e) => {
      const activeItemId = e.active.id;
      const overItemId = e.over.id;
      if (overItemId && activeItemId !== overItemId) {
        const activeItemIndex = activities.findIndex(
          (i) => i.id === activeItemId
        );
        const activeOverIndex = activities.findIndex(
          (i) => i.id === overItemId
        );
        const updatedActivities = arrayMove(
          activities,
          activeItemIndex,
          activeOverIndex
        );

        props.onReOrderSessionActivities(
          props.eventId,
          activities,
          updatedActivities
        );
        setActiveDraggingItemId(null);
      }
    },
    [activities, props]
  );

  const onDragCancel = useCallback(() => setActiveDraggingItemId(null), []);

  const renderDisplayedDrills = useCallback(
    (activity: EventActivity) => {
      return !activity.event_activity_drill ? (
        <TextButton
          iconBefore="icon-add"
          type="secondary"
          onClick={() => props.onClickAddActivityDrill(activity)}
          isDisabled={props.isDrillPanelOpen}
          kitmanDesignSystem
          testId={`add-activity-drill-button-${activity.id}`}
        />
      ) : (
        <div css={style.drillCell}>
          {activity.event_activity_drill.diagram && (
            <img
              /* $FlowFixMe filename must exist */
              alt={activity.event_activity_drill.diagram?.filename}
              /* $FlowFixMe url must exist */
              src={activity.event_activity_drill.diagram?.url}
            />
          )}
          <TextTag
            content={activity.event_activity_drill.name}
            closeable
            onClose={() => props.onDeleteActivityDrill(activity.id)}
            clickable
            onTagClick={() => props.onEditActivityDrill(activity)}
            displayEllipsisWidth={200}
            isDisabled={props.isDrillPanelOpen}
          />
        </div>
      );
    },
    [props, style.drillCell]
  );

  const DragHandle = useMemo(() => {
    if (!sortEnabled) return null;
    return <div className="icon-drag-handle" css={style.dragHandle} />;
  }, [sortEnabled, style.dragHandle]);

  const commonActivityProps = {
    style,
    isLoading: props.isLoading,
    updatedActivityId: props.updatedActivityId,
    isDraggingPrinciple,
    activityTypes: props.activityTypes,
    areCoachingPrinciplesEnabled: props.areCoachingPrinciplesEnabled,
    isActivityPresent: props.isActivityPresent,
    DragHandle,
    className: 'sessionPlanningGrid__row',
    onDropPrinciple,
    onUpdateActivityType: props.onUpdateActivityType,
    showPrinciplesPanel,
    onDeletePrinciple,
    renderDisplayedDrills,
    onUpdateActivityDuration,
    onClickDeleteActivity,
    onClickAthleteParticipation: props.onClickAthleteParticipation,
  };

  return (
    <div ref={wrapperRef} className="sessionPlanningGrid" css={style.wrapper}>
      <div className="sessionPlanningGrid__gridHeader" css={style.header}>
        <div
          className={classNames(
            'sessionPlanningGrid__cell sessionPlanningGrid__header-cell sessionPlanningGrid__cell--activity',
            sortEnabled && 'sessionPlanningGrid__cell--activity-expanded'
          )}
          css={style.cell}
        >
          <span>{props.t('Activity')}</span>
        </div>

        {props.areCoachingPrinciplesEnabled && (
          <div
            className="sessionPlanningGrid__cell sessionPlanningGrid__cell--principle"
            css={style.cell}
          >
            <span>{props.t('Principle')}</span>
          </div>
        )}

        {window.getFlag('session-planning-tab-adding-drills-to-activites') && (
          <div
            className="sessionPlanningGrid__cell sessionPlanningGrid__cell--drills"
            css={style.cell}
          >
            <span>{props.t('Drills')}</span>
          </div>
        )}

        <div
          className="sessionPlanningGrid__cell sessionPlanningGrid__cell--duration"
          css={style.cell}
        >
          <span>{props.t('Minutes')}</span>
        </div>

        <div
          className="sessionPlanningGrid__cell sessionPlanningGrid__cell--athletes"
          css={style.cell}
        >
          <span>{props.t('Athlete')}</span>
        </div>

        <div
          className="sessionPlanningGrid__cell sessionPlanningGrid__cell--menu"
          css={style.cell}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        {activities.length > 0 ? (
          <SortableContext
            disabled={!sortEnabled}
            strategy={rectSortingStrategy}
            items={activities}
          >
            {props.eventSessionActivities.map((activity, index) => (
              <SortableActivity
                key={activity.id}
                index={index}
                activity={activity}
                itemCount={activities.length}
                sortEnabled={sortEnabled}
                {...commonActivityProps}
              />
            ))}
          </SortableContext>
        ) : (
          <div
            css={style.emptyTableText}
            className="sessionPlanningGrid__emptyTableText"
          >
            <p>{props.t('No activities added')}</p>
          </div>
        )}
        {props.isLoading && props.updatedActivityId === 0 && <LineLoader />}
        <DragOverlay>
          {sortEnabled && activeActivity ? (
            <Activity
              index={activeActivityIndex}
              activity={activeActivity}
              overlay
              {...commonActivityProps}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export const SessionPlanningTabGridTranslated = memo<
  $Diff<
    SessionPlanningTabGridProps,
    {
      t: *,
    }
  >
>(withNamespaces()(SessionPlanningTabGrid));
export default memo<I18nProps<SessionPlanningTabGridProps>>(
  SessionPlanningTabGrid
);
