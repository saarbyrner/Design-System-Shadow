import kitManagementSlice, {
  initialState,
  onTogglePanel,
  onToggleModal,
  onSetSelectedRow,
  onReset,
} from '../kitManagementSlice';

describe('kitManagementSlice', () => {
  it('should return the initial state when passed an empty action', () => {
    expect(kitManagementSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('onTogglePanel', () => {
    it('should update the panel state', () => {
      const prevState = {
        ...initialState,
        panel: { isOpen: false },
      };
      const action = onTogglePanel({ isOpen: true });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.panel.isOpen).toBe(true);
      // Should not affect other state
      expect(nextState.modal).toEqual(initialState.modal);
      expect(nextState.selectedRow).toBeNull();
    });

    it('should merge with existing panel state', () => {
      const prevState = {
        ...initialState,
        panel: { isOpen: false, foo: 'bar' },
      };
      const action = onTogglePanel({ isOpen: true });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.panel.isOpen).toBe(true);
      expect(nextState.panel.foo).toBe('bar');
    });
  });

  describe('onToggleModal', () => {
    it('should update the modal state', () => {
      const prevState = {
        ...initialState,
        modal: { isOpen: false, mode: '' },
      };
      const action = onToggleModal({ isOpen: true, mode: 'edit' });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.modal.isOpen).toBe(true);
      expect(nextState.modal.mode).toBe('edit');
      // Should not affect other state
      expect(nextState.panel).toEqual(initialState.panel);
      expect(nextState.selectedRow).toBeNull();
    });

    it('should merge with existing modal state', () => {
      const prevState = {
        ...initialState,
        modal: { isOpen: false, mode: '', foo: 'bar' },
      };
      const action = onToggleModal({ isOpen: true, mode: 'delete' });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.modal.isOpen).toBe(true);
      expect(nextState.modal.mode).toBe('delete');
      expect(nextState.modal.foo).toBe('bar');
    });
  });

  describe('onSetSelectedRow', () => {
    it('should set the selectedRow', () => {
      const prevState = {
        ...initialState,
        selectedRow: null,
      };
      const mockRow = { id: 1, name: 'Kit 1' };
      const action = onSetSelectedRow({ selectedRow: mockRow });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.selectedRow).toEqual(mockRow);
    });

    it('should set selectedRow to null', () => {
      const prevState = {
        ...initialState,
        selectedRow: { id: 2, name: 'Kit 2' },
      };
      const action = onSetSelectedRow({ selectedRow: null });
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState.selectedRow).toBeNull();
    });
  });

  describe('onReset', () => {
    it('should reset state to initialState', () => {
      const prevState = {
        panel: { isOpen: true },
        modal: { isOpen: true, mode: 'edit' },
        selectedRow: { id: 3, name: 'Kit 3' },
      };
      const action = onReset();
      const nextState = kitManagementSlice.reducer(prevState, action);
      expect(nextState).toEqual(initialState);
    });
  });
});
