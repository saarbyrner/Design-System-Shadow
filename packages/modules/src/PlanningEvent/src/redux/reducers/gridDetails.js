// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

const defaultState = {
  id: 'default',
  name: 'Workload',
  type: 'DEFAULT',
  updatedWorkloadGridRows: [],
  updatedAssessmentGridRows: [],
};

export default function (
  state: $PropertyType<Store, 'gridDetails'> = defaultState,
  action: Action
) {
  switch (action.type) {
    case 'SET_SELECTED_GRID_DETAILS': {
      const { id, name, type } = action.payload.gridDetails;
      const { participationLevels } = action.payload.gridDetails;

      return {
        ...state,
        id,
        name,
        type,
        participationLevels,
      };
    }
    case 'UPDATE_GRID_ROW': {
      const { attributes, rowId } = action.payload;
      let newRows = [];

      if (state.type === 'ASSESSMENT') {
        newRows = [...state.updatedAssessmentGridRows];
        const rowAlreadyEdited = newRows.filter(
          (row) =>
            row.id === rowId &&
            row.assessmentItemId === attributes.assessment_item_id
        );
        if (!rowAlreadyEdited.length) {
          newRows.push({
            id: rowId,
            assessmentItemId: attributes.assessment_item_id,
            value: attributes.value,
          });
        } else {
          rowAlreadyEdited[0].value = attributes.value;
        }

        return {
          ...state,
          updatedAssessmentGridRows: newRows,
        };
      }

      newRows = [...state.updatedWorkloadGridRows];
      if (!newRows.includes(rowId)) {
        newRows.push(rowId);
      }

      return {
        ...state,
        updatedWorkloadGridRows: newRows,
      };
    }
    case 'CLEAR_UPDATED_GRID_ROWS': {
      return {
        ...state,
        updatedAssessmentGridRows: [],
        updatedWorkloadGridRows: [],
      };
    }
    default:
      return state;
  }
}
