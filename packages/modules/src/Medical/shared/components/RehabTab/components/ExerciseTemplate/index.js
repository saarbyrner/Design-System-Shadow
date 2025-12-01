// @flow
import { withNamespaces } from 'react-i18next';
import { zIndices } from '@kitman/common/src/variables';
import type { ComponentType } from 'react';
import FavouriteButton from '../FavouriteButton';
import getStyle from './style';
import Draggable from '../Draggable';
import type { ExerciseVariation } from '../../types';

export type Props = {
  templateId: string | number,
  isFavourite: boolean,
  isSelected: boolean,
  title: string,
  defaultVariation: ExerciseVariation,
  onToggleFavourite: Function,
  disabled: boolean,
  onClicked: Function,
};

const ExerciseTemplate = (props: Props) => {
  const style = getStyle(props.disabled, props.isSelected);

  return (
    <div
      css={style.exerciseTemplate}
      data-testid="Rehab|ExerciseTemplate"
      tabIndex={-1}
    >
      <Draggable
        key={`draggable_exercise_${props.templateId}`}
        dragId={`exercise_${props.templateId}`}
        zIndex={zIndices.draggableItemZ}
        data={{
          type: 'exerciseTemplate',
          exercise_template_id: props.templateId,
          exercise_name: props.title,
          defaultVariationsType: props.defaultVariation,
        }}
        disabled={props.disabled}
      >
        <div
          className="icon-drag-handle"
          css={style.dragHandle}
          data-testid="Rehab|DragHandle"
        />
      </Draggable>
      <div
        css={style.exerciseClickArea}
        onClick={() => {
          if (!props.disabled) {
            props.onClicked();
          }
        }}
        data-testid="Rehab|ExerciseTemplateClickArea"
      >
        <i css={style.addIcon} className="icon-add" />
        <div css={style.exerciseTitle}>{props.title}</div>
      </div>
      <FavouriteButton
        itemId={props.templateId}
        isFavourite={props.isFavourite}
        onToggle={props.onToggleFavourite}
      />
    </div>
  );
};

export const ExerciseTemplateTranslated: ComponentType<Props> =
  withNamespaces()(ExerciseTemplate);
export default ExerciseTemplate;
