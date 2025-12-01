import { initialState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import createMovementSlice, {
  onReset,
  onToggleDrawer,
  onToggleModal,
  onUpdateCreateMovementForm,
  onUpdateValidation,
} from '../createMovementSlice';

describe('[createMovementSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(createMovementSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const updatedState = createMovementSlice.reducer(initialState, action);
    expect(updatedState).toEqual(initialState);
  });

  it('should onToggleDrawer', () => {
    const action = onToggleDrawer();
    const updatedState = createMovementSlice.reducer(initialState, action);
    expect(updatedState.drawer).toEqual({
      isOpen: true,
    });
  });

  it('should onToggleModal', () => {
    const action = onToggleModal();
    const updatedState = createMovementSlice.reducer(initialState, action);
    expect(updatedState.modal).toEqual({ isOpen: true });
  });

  it('should onUpdateCreateMovementForm', () => {
    const action = onUpdateCreateMovementForm({
      transfer_type: 'medical_trial',
    });
    const updatedState = createMovementSlice.reducer(initialState, action);
    expect(updatedState.form).toEqual({
      ...initialState.form,
      transfer_type: 'medical_trial',
    });
  });
  it('should onUpdateValidation', () => {
    const action = onUpdateValidation({
      user_id: {
        status: 'VALID',
        message: 'Valid',
      },
    });
    const updatedState = createMovementSlice.reducer(initialState, action);
    expect(updatedState.validation).toEqual({
      ...initialState.validation,
      user_id: {
        status: 'VALID',
        message: 'Valid',
      },
    });
  });
});
