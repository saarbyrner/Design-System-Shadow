// @flow
import { useDraggable } from '@dnd-kit/core';
import * as React from 'react';
import { zIndices } from '@kitman/common/src/variables';

export type Props = {
  dragId: string,
  zIndex?: number,
  data?: Object,
  children?: React.Node,
  disabled?: boolean,
};

const Draggable = (props: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.dragId,
    data: { ...props.data },
    disabled: props.disabled,
  });

  const styleTransform = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, ${
          props.zIndex || zIndices.draggableItemZ
        })`,
      }
    : undefined;

  return (
    <div
      style={styleTransform}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      tabIndex={-1}
    >
      {props.children}
    </div>
  );
};

export default Draggable;
