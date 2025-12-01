// @flow
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton } from '@kitman/components';

import style from './style';

type Props = {
  id: number,
  libraryId?: number,
  sortableId: number,
  name: string,
  isDragged?: boolean,
  isFavorite?: boolean,
  onAdd?: () => void,
  onToggleFavorite?: () => void | Promise<void>,
};
const DrillItem = (props: Props) => {
  const { transform, transition, setNodeRef, attributes, listeners } =
    useSortable({
      id: props.sortableId,
      data: {
        drillId: props.id,
        drillName: props.name,
      },
    });
  const sortableStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      css={[style.drillItem, props.isDragged && style.dragged]}
      style={sortableStyle}
      data-testid="DrillLibrary|DrillTemplate"
    >
      <span
        {...attributes}
        {...listeners}
        css={[style.dragHandle, props.isDragged && style.pressedDragHandle]}
        className="icon-drag-handle"
        data-testid="DrillLibrary|DragHandle"
      />
      {!props.isDragged && (
        <div css={style.addButton}>
          <IconButton
            isBorderless
            isSmall
            testId="DrillLibrary|DrillItem|PlusButton"
            icon="icon-add"
            onClick={props?.onAdd}
          />
        </div>
      )}
      <div
        css={style.drillClickArea}
        data-testid="DrillLibrary|DrillTemplateClickArea"
      >
        <div css={style.drillItemTitle}>{props.name}</div>
      </div>
      {!props.isDragged && props.onToggleFavorite && (
        <div
          css={[style.baseFavorited, !props.isFavorite && style.unfavorited]}
          data-testid="favorite-button"
        >
          <IconButton
            icon={props.isFavorite ? 'icon-star-filled' : 'icon-star'}
            isSmall
            isBorderless
            isTransparent
            onClick={() => props.onToggleFavorite?.()}
          />
        </div>
      )}
    </div>
  );
};

export default DrillItem;
