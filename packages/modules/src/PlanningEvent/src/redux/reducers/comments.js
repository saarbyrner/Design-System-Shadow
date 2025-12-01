// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

const defaultState = {
  athleteComments: [],
  athleteLinkedToComments: {},
  isPanelOpen: false,
  panelViewType: 'VIEW',
};

export default function (
  state: $PropertyType<Store, 'comments'> = defaultState,
  action: Action
) {
  switch (action.type) {
    case 'SET_ATHLETE_COMMENTS': {
      const { columns, rows } = action.payload.grid;
      const comments = [];

      const selectedAthleteRow = rows.find(
        (row) => row.athlete.id === action.payload.athleteId
      );

      columns.forEach((column) => {
        if (selectedAthleteRow && selectedAthleteRow[column.row_key]?.comment) {
          comments.push({
            assessmentItemId: column.assessment_item_id,
            assessmentItemName: column.name,
            note: {
              content: selectedAthleteRow[column.row_key].comment.content,
              createdAt: selectedAthleteRow[column.row_key].comment.created_at,
            },
          });
        }
      });

      return {
        ...state,
        athleteComments: comments,
      };
    }
    case 'SET_ATHLETE_LINKED_TO_COMMENTS': {
      return {
        ...state,
        athleteLinkedToComments: action.payload.athlete,
      };
    }
    case 'SET_COMMENTS_PANEL_VIEW_TYPE': {
      return {
        ...state,
        panelViewType: action.payload.viewType,
      };
    }
    case 'SET_IS_COMMENTS_SIDE_PANEL_OPEN': {
      return {
        ...state,
        isPanelOpen: action.payload.isOpen,
      };
    }
    default:
      return state;
  }
}
