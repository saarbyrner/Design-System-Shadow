// @flow

const keyboardKeyActions = {
  Tab: ['Tab'],
  Shift: ['Shift'],
  Escape: ['Esc', 'Escape'],
  Enter: ['Enter'],
  Space: ['Space'],

  // Directions
  Up: ['Up', 'ArrowUp'],
  Down: ['Down', 'ArrowDown'],
  Right: ['Right', 'ArrowRight'],
  Left: ['Left', 'ArrowLeft'],

  // Rehab Exercise actions
  EditExercise: ['Enter'],
  DoneEditExercise: ['Esc', 'Escape'],
  DeleteExercise: ['d'],
  BeginMoveExercise: ['Space'],

  // Rehab Menu Commands (Require control (meta) key)
  EditAll: ['e'], // Repeat command to toggle
  CopyExercises: ['k'], // Repeat command to toggle
  LinkExercises: ['l'], // Repeat command to toggle
  ChangeDateNextDay: ['Right', 'ArrowRight'], // Only works when no focused on an INPUT field
  ChangeDatePreviousDay: ['Left', 'ArrowLeft'], // Only works when no focused on an INPUT field
};

export default keyboardKeyActions;
