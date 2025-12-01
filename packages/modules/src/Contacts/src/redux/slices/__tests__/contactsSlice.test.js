import contactsSlice, { onToggleModal, reset } from '../contactsSlice';

const initialState = {
  modal: {
    isOpen: false,
    contact: null,
  },
};

describe('[contactsSlice]', () => {
  it('should correctly toggle modal state', () => {
    const actionOnToggleModal = onToggleModal({
      isOpen: true,
      contact: { id: 1, name: 'John Doe' },
    });
    const stateToOpenModal = contactsSlice.reducer(
      initialState,
      actionOnToggleModal
    );
    expect(stateToOpenModal.modal.isOpen).toEqual(true);
    expect(stateToOpenModal.modal.contact).toEqual({ id: 1, name: 'John Doe' });

    const actionOnToggleModalClose = onToggleModal({
      isOpen: false,
      contact: null,
    });
    const stateToCloseModal = contactsSlice.reducer(
      initialState,
      actionOnToggleModalClose
    );
    expect(stateToCloseModal.modal.isOpen).toEqual(false);
    expect(stateToCloseModal.modal.contact).toBe(null);
  });

  it('should correctly reset state', () => {
    const actionOnToggleModal = onToggleModal({
      isOpen: true,
      contact: { id: 1, name: 'John Doe' },
    });
    const stateToOpenModal = contactsSlice.reducer(
      initialState,
      actionOnToggleModal
    );
    expect(stateToOpenModal.modal.isOpen).toEqual(true);
    expect(stateToOpenModal.modal.contact).toEqual({ id: 1, name: 'John Doe' });

    const actionToReset = reset();
    const stateToReset = contactsSlice.reducer(stateToOpenModal, actionToReset);
    expect(stateToReset.modal.isOpen).toEqual(false);
    expect(stateToReset.modal.contact).toBe(null);
  });
});
