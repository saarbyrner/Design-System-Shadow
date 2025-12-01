/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

export default function (state = {}, action) {
  let actions;

  switch (action.type) {
    case 'NOTE_TYPE_CHANGE': {
      return {
        ...state,
        annotation_type_id: action.payload.typeId,
      };
    }
    case 'NOTE_TITLE_CHANGE': {
      return {
        ...state,
        title: action.payload.title,
      };
    }
    case 'NOTE_TEXT_CHANGE': {
      return {
        ...state,
        content: action.payload.text,
      };
    }
    case 'NOTE_RICH_TEXT_CHANGE': {
      return {
        ...state,
        content: action.payload.content,
      };
    }
    case 'NOTE_DATE_CHANGE': {
      return {
        ...state,
        annotation_date: moment(action.payload.date).format(
          DateFormatter.dateTransferFormat
        ),
      };
    }
    case 'NOTE_ATHLETE_CHANGE': {
      return {
        ...state,
        annotationable: {
          ...state.annotationable,
          id: action.payload.athleteId,
          fullname: action.payload.athleteName,
        },
      };
    }
    case 'UPDATE_NOTE_ACTION_TEXT': {
      actions = state.annotation_actions.slice();
      actions[action.payload.actionIndex].content = action.payload.text;
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'UPDATE_NOTE_ACTION_ASSIGNEE': {
      actions = state.annotation_actions.slice();
      let newAssigneeIds = [...actions[action.payload.actionIndex].user_ids];
      const indexOfId = newAssigneeIds.indexOf(action.payload.selectedId);
      if (indexOfId !== -1) {
        newAssigneeIds = newAssigneeIds.filter(
          (item, index) => index !== indexOfId
        );
      } else {
        newAssigneeIds.push(action.payload.selectedId);
      }
      actions[action.payload.actionIndex].user_ids = newAssigneeIds;
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'TOGGLE_ACTION_CHECKBOX': {
      actions = state.annotation_actions.slice();
      actions[action.payload.actionIndex].completed =
        !state.annotation_actions[action.payload.actionIndex].completed;
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'UPDATE_ACTION_DUE_DATE': {
      actions = state.annotation_actions.slice();
      actions[action.payload.actionIndex].due_date = action.payload.dueDate;
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'ADD_NOTE_ACTION': {
      actions = state.annotation_actions.slice();
      actions.push({
        content: '',
        user_ids: [],
        completed: false,
        due_date: null,
      });
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'REMOVE_NOTE_ACTION': {
      actions = [...state.annotation_actions].filter(
        (item, index) => index !== action.payload.actionIndex
      );
      return {
        ...state,
        annotation_actions: actions,
      };
    }
    case 'POPULATE_NOTE_MODAL': {
      const getType = () => {
        if (action.payload.options.isEditing) {
          return 'EDIT';
        }
        if (action.payload.options.isDuplicating) {
          return 'DUPLICATE';
        }
        return 'ADD_NEW';
      };

      return {
        ...state,
        ...action.payload.annotation,
        id: action.payload.options.isEditing
          ? action.payload.annotation.id
          : null,
        annotation_date: moment(
          action.payload.annotation.annotation_date,
          DateFormatter.dateTransferFormat
        ).format(DateFormatter.dateTransferFormat),
        modalType: getType(),
      };
    }
    case 'UPDATE_FILES': {
      return {
        ...state,
        unUploadedFiles: action.payload.files,
      };
    }
    case 'REMOVE_UPLOADED_FILE': {
      const newAttachments = [...state.attachments].filter((file) =>
        file ? file.id !== action.payload.fileId : false
      );
      return {
        ...state,
        attachments: newAttachments,
      };
    }
    default:
      return state;
  }
}
