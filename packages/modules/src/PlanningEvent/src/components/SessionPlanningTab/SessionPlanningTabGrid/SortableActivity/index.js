// @flow
import { useMemo, memo, cloneElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { EventActivity } from '@kitman/common/src/types/Event';
import type { PrincipleId } from '@kitman/common/src/types/Principles';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import Activity from '../Activity';

type SortableActivityProps = {
  className?: string,
  updatedActivityId: number | null,
  index: number,
  itemCount?: number,
  isLoading?: boolean,
  isActivityPresent?: boolean,
  overlay?: boolean,
  areCoachingPrinciplesEnabled?: boolean,
  isDraggingPrinciple?: boolean,
  sortEnabled: boolean,
  DragHandle?: any,
  listeners?: Object,
  style?: Object,
  activity: EventActivity,
  activityTypes: Array<ActivityType> | null,
  setActivatorNodeRef?: (HTMLElement | null) => void,
  showPrinciplesPanel: (activityId: number) => void,
  onDropPrinciple: (activityId: number) => void,
  onDeletePrinciple: (activityId: number, principleId: PrincipleId) => void,
  onClickDeleteActivity: (activityId: number) => void,
  onUpdateActivityDuration: (activityId: number, duration: string) => void,
  onUpdateActivityType: (activityId: number, activityTypeId: number) => void,
  renderDisplayedDrills: (activity: EventActivity) => any,
  onClickAthleteParticipation: () => void,
};

const SortableActivity = ({
  activity,
  overlay,
  itemCount,
  isDraggingPrinciple,
  index,
  isLoading,
  updatedActivityId,
  activityTypes,
  areCoachingPrinciplesEnabled,
  isActivityPresent,
  style,
  sortEnabled,
  DragHandle,
  className,
  renderDisplayedDrills,
  onDropPrinciple,
  onUpdateActivityType,
  showPrinciplesPanel,
  onDeletePrinciple,
  onUpdateActivityDuration,
  onClickDeleteActivity,
  onClickAthleteParticipation,
}: SortableActivityProps) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({ id: activity.id, disabled: !sortEnabled });

  const dragHandle = useMemo(() => {
    if (!sortEnabled || !DragHandle) return null;

    return cloneElement(DragHandle, {
      ref: setActivatorNodeRef,
      ...listeners,
    });
  }, [DragHandle, listeners, setActivatorNodeRef, sortEnabled]);

  const styles = useMemo(
    () => ({
      transition,
      transform: CSS.Transform.toString(transform),
    }),
    [transform, transition]
  );

  return (
    <div ref={setNodeRef} style={styles} {...attributes}>
      <Activity
        className={className}
        isDragging={isDragging}
        activity={activity}
        overlay={overlay}
        itemCount={itemCount}
        isDraggingPrinciple={isDraggingPrinciple}
        index={index}
        renderDisplayedDrills={renderDisplayedDrills}
        onDropPrinciple={onDropPrinciple}
        isLoading={isLoading}
        updatedActivityId={updatedActivityId}
        activityTypes={activityTypes}
        onUpdateActivityType={onUpdateActivityType}
        areCoachingPrinciplesEnabled={areCoachingPrinciplesEnabled}
        isActivityPresent={isActivityPresent}
        showPrinciplesPanel={showPrinciplesPanel}
        onDeletePrinciple={onDeletePrinciple}
        onUpdateActivityDuration={onUpdateActivityDuration}
        onClickDeleteActivity={onClickDeleteActivity}
        style={style}
        DragHandle={dragHandle}
        onClickAthleteParticipation={onClickAthleteParticipation}
      />
    </div>
  );
};

export default memo<SortableActivityProps>(SortableActivity);
