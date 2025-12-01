// @flow
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  id: number,
  children: any,
};

const SortableItem = ({ id, children }: Props) => {
  const { setNodeRef, isDragging, transform, transition } = useSortable({
    id,
  });

  const style = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default SortableItem;
