// @flow
import { ActionCheckbox } from '@kitman/components';
import type {
  Annotation,
  AnnotationAction,
} from '@kitman/common/src/types/Annotation';

type Props = {
  annotation: Annotation,
  updatedAction: AnnotationAction,
};

const ActionSummary = (props: Props) => {
  const actions = props.annotation.annotation_actions;
  if (props.updatedAction) {
    const actionToUpdate = actions.filter(
      (action) => action.id === props.updatedAction.id
    )[0];
    if (actionToUpdate) {
      const actionToUpdateIndex = actions.findIndex(
        (action) => action.id === actionToUpdate.id
      );
      actions[actionToUpdateIndex] = props.updatedAction;
    }
  }

  const numberOfActions = actions.length;
  const numberOfCompletedActions = actions.filter(
    (action) => action.completed
  ).length;

  return numberOfActions ? (
    <div className="actionSummary">
      <ActionCheckbox
        id="notesWidget__actionCheckbox"
        isChecked={numberOfCompletedActions === numberOfActions}
        isDisabled
        onToggle={() => {}}
      />
      <span className="actionSummary__actionsCompleted">{`${numberOfCompletedActions}/${numberOfActions}`}</span>
    </div>
  ) : null;
};

export default ActionSummary;
