import { closeReorderModal, openReorderModal } from '../reorderModal';

describe('Reorder Modal Actions', () => {
  it('has the correct action CLOSE_REORDER_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_REORDER_MODAL',
    };

    expect(closeReorderModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_REORDER_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_REORDER_MODAL',
    };

    expect(openReorderModal()).toEqual(expectedAction);
  });
});
