import { getModal } from '../contactsGridSelectors';
import { REDUCER_KEY } from '../../slices/contactsSlice';

describe('getModal selector', () => {
  it('should return the modal state', () => {
    const state = {
      [REDUCER_KEY]: {
        modal: {
          contact: {},
          isOpen: false,
        },
      },
    };
    expect(getModal(state)).toEqual({ contact: {}, isOpen: false });
  });

  it('should return undefined if modal state is not present', () => {
    const state = {
      [REDUCER_KEY]: {},
    };
    expect(getModal(state)).toBeUndefined();
  });
});
