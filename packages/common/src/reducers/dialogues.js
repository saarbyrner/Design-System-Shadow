// @flow
import type {
  DialoguesState,
  ShowDialogueAction,
  HideDialogueAction,
} from '@kitman/common/src/types';

type Action = ShowDialogueAction | HideDialogueAction;

const dialogues = (
  state: DialoguesState = {},
  action: Action
): DialoguesState => {
  switch (action.type) {
    case 'SHOW_DIALOGUE':
      return {
        [action.payload.dialogue]: true,
      };
    case 'HIDE_DIALOGUE':
      return {};
    default:
      return state;
  }
};

export default dialogues;
