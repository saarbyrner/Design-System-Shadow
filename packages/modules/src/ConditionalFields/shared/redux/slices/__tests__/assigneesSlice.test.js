import assigneesSlice, {
  updateEditMode,
  updateAssignment,
  updateFetchedAssignments,
  updateAssignments,
  resetAssignees,
} from '../assigneesSlice';
import { data } from '../../../services/mocks/data/assignees.mock';

const initialState = {
  assignments: [],
};

describe('[assigneesSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(assigneesSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  it('should correctly update edit mode', () => {
    const actionToTrue = updateEditMode(true);
    const stateToTrue = assigneesSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.editMode).toEqual(true);

    const actionToFalse = updateEditMode(false);
    const stateToFalse = assigneesSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.editMode).toEqual(false);
  });

  it('should correctly update an assignment with active = true', () => {
    const assignmentsUpdate = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: false,
    }));
    const assignmentsUpdateAction = updateAssignments(assignmentsUpdate);
    const assignmentsUpdateState = assigneesSlice.reducer(
      initialState,
      assignmentsUpdateAction
    );

    const action = updateAssignment({ squad_id: 1374, active: true });
    const updatedState = assigneesSlice.reducer(assignmentsUpdateState, action);

    expect(
      updatedState.assignments.filter(
        (assignment) => assignment.squad_id === 1374
      )[0].active
    ).toEqual(true);
  });

  it('should correctly update an assignment with active = false', () => {
    const assignmentsUpdate = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: false,
    }));
    const assignmentsUpdateAction = updateAssignments(assignmentsUpdate);
    const assignmentsUpdateState = assigneesSlice.reducer(
      initialState,
      assignmentsUpdateAction
    );

    const actionToTrue = updateAssignment({ squad_id: 744, active: true });
    const updatedStateToTrue = assigneesSlice.reducer(
      assignmentsUpdateState,
      actionToTrue
    );

    expect(
      updatedStateToTrue.assignments.filter(
        (assignment) => assignment.squad_id === 744
      )[0].active
    ).toEqual(true);

    const actionToFalse = updateAssignment({ squad_id: 744, active: false });
    const updatedStateToFalse = assigneesSlice.reducer(
      updatedStateToTrue,
      actionToFalse
    );

    expect(
      updatedStateToFalse.assignments.filter(
        (assignment) => assignment.squad_id === 744
      )[0].active
    ).toEqual(false);
  });

  it('should correctly update fetched assignments', () => {
    const assignments = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: 'active' in assignment ? assignment.active : false,
    }));
    const action = updateAssignments(assignments);
    const state = assigneesSlice.reducer(initialState, action);
    expect(state.assignments).toEqual(assignments);
    expect(
      state.assignments.filter((assignment) => assignment.active).length
    ).toBe(1);
  });

  it('should correctly update assignments', () => {
    const assignmentsToTrue = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: true,
    }));
    const actionToTrue = updateAssignments(assignmentsToTrue);
    const stateToTrue = assigneesSlice.reducer(initialState, actionToTrue);
    expect(stateToTrue.assignments).toEqual(assignmentsToTrue);
    expect(
      stateToTrue.assignments.filter((assignment) => assignment.active).length
    ).toBe(13);

    const assignmentsToFalse = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: false,
    }));
    const actionToFalse = updateAssignments(assignmentsToFalse);
    const stateToFalse = assigneesSlice.reducer(stateToTrue, actionToFalse);
    expect(stateToFalse.assignments).toEqual(assignmentsToFalse);
    expect(
      stateToFalse.assignments.filter((assignment) => !assignment.active).length
    ).toBe(13);
  });

  it('should correctly reset assignments', () => {
    const assignmentsUpdate = data.assignments.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: 'active' in assignment ? assignment.active : false,
    }));

    const fetchedAssignmentsUpdateAction =
      updateFetchedAssignments(assignmentsUpdate);
    const fetchAssignmentsUpdateState = assigneesSlice.reducer(
      initialState,
      fetchedAssignmentsUpdateAction
    );

    const assignmentsUpdateAction = updateAssignments(assignmentsUpdate);
    const assignmentsUpdateState = assigneesSlice.reducer(
      fetchAssignmentsUpdateState,
      assignmentsUpdateAction
    );

    const editModeToTrueState = assigneesSlice.reducer(
      assignmentsUpdateState,
      updateEditMode(true)
    );

    const actionToTrue = updateAssignment({ squad_id: 744, active: true });
    const updatedStateToTrue = assigneesSlice.reducer(
      editModeToTrueState,
      actionToTrue
    );

    expect(
      updatedStateToTrue.assignments.filter(
        (assignment) => assignment.squad_id === 744
      )[0].active
    ).toEqual(true);

    const actionToReset = resetAssignees();
    const updatedStateToReset = assigneesSlice.reducer(
      updatedStateToTrue,
      actionToReset
    );

    expect(updatedStateToReset.editMode).toBe(false);
    expect(
      updatedStateToReset.assignments.filter(
        (assignment) => assignment.squad_id === 744
      )[0].active
    ).toEqual(false);
  });
});
