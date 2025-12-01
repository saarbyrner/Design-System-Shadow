// @flow
import { useSortable } from '@dnd-kit/sortable';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  id: number,
};
const DragHandle = ({ id }: Props) => {
  const { attributes, listeners, setActivatorNodeRef } = useSortable({
    id,
  });

  return (
    <KitmanIcon
      name={KITMAN_ICON_NAMES.DragIndicator}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

export default DragHandle;
