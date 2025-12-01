// @flow
import keyboardKeyActions from './keyboardKeyActions';
import type { RehabMode } from './types';

type Props = {
  mode: RehabMode,
  changeRehabMode: Function,
  dispatch: Function,
  deleteExerciseCallback: Function,
  moveActiveDateCallback: Function,
  editingAll: boolean,
};

const keyCommands = (props: Props) => {
  const onKeydown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    const activeElement = document.activeElement;
    if (keyboardKeyActions.DoneEditExercise.includes(event.key)) {
      let exerciseId;

      if (activeElement?.dataset.rehab_item_mode === 'EditItem') {
        const id = activeElement?.dataset.rehab_item_id;
        exerciseId = parseInt(id, 10);
      } else if (activeElement) {
        const closetEditItem = activeElement?.closest(
          '[data-rehab_item_mode="EditItem"]'
        );
        if (closetEditItem?.contains(activeElement)) {
          const id = closetEditItem?.getAttribute('data-rehab_item_id');
          exerciseId = parseInt(id, 10);
          // $FlowIgnore[prop-missing] Focus will be present
          closetEditItem?.focus();
        }
      }

      if (exerciseId != null) {
        props.dispatch({
          type: 'REMOVE_EXERCISE_FROM_EDIT_ARRAY',
          exerciseId,
        });
        event.preventDefault();
      }
    }

    if (activeElement?.dataset.rehab_item_id != null) {
      const id = activeElement.dataset.rehab_item_id;
      const exerciseId = parseInt(id, 10);

      switch (true) {
        case keyboardKeyActions.EditExercise.includes(event.key): {
          props.dispatch({
            type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
            exerciseId,
          });
          if (document.activeElement?.dataset?.rehab_item_id === id) {
            activeElement?.querySelector('.InputNumeric__input')?.focus();
          }
          event.preventDefault();
          break;
        }

        case keyboardKeyActions.DeleteExercise.includes(event.key): {
          // Only allow delete when not editing
          if (activeElement?.dataset.rehab_item_mode === 'Item') {
            props.deleteExerciseCallback(exerciseId);
            event.preventDefault();
          }
          break;
        }

        case keyboardKeyActions.Down.includes(event.key):
        case keyboardKeyActions.Up.includes(event.key): {
          const sibling = keyboardKeyActions.Down.includes(event.key)
            ? activeElement?.nextElementSibling
            : activeElement?.previousElementSibling;

          if (sibling && sibling.getAttribute('data-rehab_item_id') != null) {
            activeElement.blur();
            // $FlowIgnore[prop-missing] Focus will be present
            sibling.focus();
          }

          event.preventDefault();
          break;
        }

        case keyboardKeyActions.Right.includes(event.key):
        case keyboardKeyActions.Left.includes(event.key): {
          const sessionColumn = activeElement?.closest(
            '[data-rehab_container_type="session_container"]'
          );

          const siblingSessionColumn = keyboardKeyActions.Right.includes(
            event.key
          )
            ? sessionColumn?.nextElementSibling
            : sessionColumn?.previousElementSibling;

          siblingSessionColumn
            ?.querySelector(`[data-rehab_item_mode]`)
            ?.focus();

          event.preventDefault();

          break;
        }
        default:
          break;
      }
    }

    // General Commands

    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    switch (true) {
      case keyboardKeyActions.ChangeDateNextDay.includes(event.key):
      case keyboardKeyActions.ChangeDatePreviousDay.includes(event.key): {
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          props.moveActiveDateCallback(
            keyboardKeyActions.ChangeDateNextDay.includes(event.key) ? 1 : -1
          );
          event.preventDefault();
        }
        break;
      }
      case keyboardKeyActions.EditAll.includes(event.key): {
        if (!props.editingAll) {
          props.dispatch({
            type: 'EDIT_ALL_EXERCISES',
          });
        } else {
          props.dispatch({
            type: 'CLEAR_EDITING_EXERCISE_IDS',
          });
        }
        event.preventDefault();
        break;
      }
      case keyboardKeyActions.CopyExercises.includes(event.key): {
        if (props.mode !== 'COPY_TO_MODE') {
          props.changeRehabMode('COPY_TO_MODE');
        } else {
          props.changeRehabMode('DEFAULT');
        }
        event.preventDefault();
        break;
      }
      case keyboardKeyActions.LinkExercises.includes(event.key): {
        if (props.mode !== 'LINK_TO_MODE') {
          // NOTE: changeRehabMode will reject if not in maintenance
          props.changeRehabMode('LINK_TO_MODE');
        } else {
          props.changeRehabMode('DEFAULT');
        }
        event.preventDefault();

        break;
      }
      default:
        break;
    }
  };

  return onKeydown;
};

export default keyCommands;
