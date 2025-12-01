// @flow
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  PlanningTabActivity,
  type PlanningTabActivityProps,
} from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabActivity/PlanningTabActivity';

const SortableActivity = (props: PlanningTabActivityProps) => {
  const { transform, transition, setNodeRef, attributes, listeners } =
    useSortable({ id: props.activity?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <PlanningTabActivity
      {...props}
      ref={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  );
};

export default SortableActivity;
