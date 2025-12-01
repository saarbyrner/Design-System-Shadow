import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';

import { getModal } from '@kitman/modules/src/Contacts/src/redux/selectors/contactsGridSelectors';
import { useDeleteContactMutation } from '@kitman/modules/src/Contacts/src/redux/rtk/getContactRolesApi';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import userEvent from '@testing-library/user-event';

import {
  REDUCER_KEY,
  initialState,
  onToggleModal,
} from '@kitman/modules/src/Contacts/src/redux/slices/contactsSlice';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';

import DeleteContactModal from '../DeleteContactModal';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/Contacts/src/redux/selectors/contactsGridSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Contacts/src/redux/selectors/contactsGridSelectors'
    ),
    getModal: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/Contacts/src/redux/slices/contactsSlice',
  () => ({
    onToggleModal: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/Contacts/src/redux/rtk/getContactRolesApi',
  () => ({
    useDeleteContactMutation: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi',
  () => ({
    useSearchContactsQuery: jest.fn(),
  })
);

jest.mock('@kitman/modules/src/Toasts/toastsSlice', () => ({
  add: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const mockSelectors = ({ modal }) => {
  getModal.mockReturnValue(modal);
  useDeleteContactMutation.mockReturnValue([jest.fn(), {}]);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [REDUCER_KEY]: initialState,
};

describe('DeleteContactModal', () => {
  describe('modal', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe('Not Open', () => {
      beforeEach(() => {
        mockSelectors({
          modal: {
            contact: null,
            isOpen: false,
          },
        });

        render(
          <Provider store={storeFake(defaultStore)}>
            <DeleteContactModal />
          </Provider>
        );
      });
      it('does not render', () => {
        expect(screen.queryByText('Delete Contact')).not.toBeInTheDocument();
      });
    });

    describe('Is open', () => {
      beforeEach(() => {
        mockSelectors({
          modal: {
            contact: {
              id: 9,
              name: 'Henry',
              email: 'mas@mail.com',
            },
            isOpen: true,
          },
        });

        render(
          <Provider store={storeFake(defaultStore)}>
            <DeleteContactModal />
          </Provider>
        );
      });
      it('renders modal', () => {
        expect(screen.queryByText('Delete Contact')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });
  });
  describe('has actions', () => {
    const user = userEvent.setup();
    let dispatchMock;
    let onDeleteContactMock;
    let refetchMock;

    beforeEach(() => {
      dispatchMock = jest.fn();
      onDeleteContactMock = jest.fn();
      refetchMock = jest.fn();

      useDispatch.mockReturnValue(dispatchMock);
      useDeleteContactMutation.mockReturnValue([
        onDeleteContactMock,
        { isError: false, isSuccess: false },
      ]);
      useSearchContactsQuery.mockReturnValue({ refetch: refetchMock });
      getModal.mockReturnValue({
        isOpen: true,
        contact: { id: 1, name: 'John Doe' },
      });

      render(
        <Provider store={storeFake(defaultStore)}>
          <DeleteContactModal />
        </Provider>
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('calls onDeleteContactMock when "Delete" button is clicked', async () => {
      await user.click(screen.getByText('Delete'));
      expect(onDeleteContactMock).toHaveBeenCalledWith({
        id: 1,
        archived: true,
      });
    });

    it('calls onToggleModal when "Cancel" button is clicked', async () => {
      await user.click(screen.getByText('Cancel'));
      expect(onToggleModal).toHaveBeenCalledWith({
        isOpen: false,
        contact: null,
      });
    });

    it('calls onToggleModal and add when isDeleteContactSuccess', async () => {
      useDeleteContactMutation.mockReturnValue([
        onDeleteContactMock,
        { isError: false, isSuccess: true },
      ]);

      render(
        <Provider store={storeFake(defaultStore)}>
          <DeleteContactModal />
        </Provider>
      );

      await waitFor(() => {
        expect(onToggleModal).toHaveBeenCalledWith({
          isOpen: false,
          contact: null,
        });
      });
      expect(add).toHaveBeenCalledWith({
        id: 'DELETE_CONTACT',
        status: 'SUCCESS',
        title: 'Contact successfully deleted.',
      });
    });

    it('calls onToggleModal and add when hasDeleteContactFailed', async () => {
      useDeleteContactMutation.mockReturnValue([
        onDeleteContactMock,
        { isError: true, isSuccess: false },
      ]);

      render(
        <Provider store={storeFake(defaultStore)}>
          <DeleteContactModal />
        </Provider>
      );

      await waitFor(() => {
        expect(onToggleModal).toHaveBeenCalledWith({
          isOpen: false,
          contact: null,
        });
      });
      expect(add).toHaveBeenCalledWith({
        id: 'DELETE_CONTACT_FAILED',
        status: 'ERROR',
        title: 'Failed to successfully deleted contact.',
      });
    });
  });
});
