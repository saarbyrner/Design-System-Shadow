import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { AssignVisibilityModalTranslated as AssignVisibilityModal } from '../AssignVisibilityModal';
import { useBulkUpdateNotesQuery } from '../../../../Medical/shared/redux/services/medical';

jest.mock('../../../../Medical/shared/redux/services/medical');

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

describe('AssignVisibilityModal', () => {
  const props = {
    toastAction: jest.fn(),
  };

  const mockUsers = [
    {
      id: 1,
      username: 'johndoe1',
      current: false,
      created: '2023-01-01',
      updated: '2023-01-02',
      avatar: 'user1.jpg',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      role: 'Account Admin',
      orphaned_annotation_ids: [1, 2],
    },
    {
      id: 2,
      username: 'janesmith1',
      current: false,
      created: '2023-02-01',
      updated: '2023-02-02',
      avatar: 'user2.jpg',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'janesmith@gmail.com',
      orphaned_annotation_ids: [3, 4],
    },
  ];

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    userReducer: {
      users: mockUsers,
      inactiveUsers: mockUsers,
      searchText: '',
      assignVisibilityModal: {
        open: true,
        user: mockUsers[0],
      },
    },
  });

  beforeEach(() => {
    useBulkUpdateNotesQuery.mockReturnValue({
      isSuccess: false,
    });
    render(
      <Provider store={store}>
        <AssignVisibilityModal {...props} />
      </Provider>
    );
  });

  it('renders and interacts with the modal', () => {
    const modalTitle = screen.getByText('Assign visibility');
    expect(modalTitle).toBeInTheDocument();

    const modalContent = screen.getByText(
      'There are 2 private notes visible to the user. Select active users to assign visibility of these private items.'
    );
    expect(modalContent).toBeInTheDocument();
  });

  it('disables the Assign now button if users and owner are not filled', () => {
    const assignNowButton = screen.getByText('Assign now').closest('button');
    expect(assignNowButton).toBeInTheDocument();
    expect(assignNowButton).toBeDisabled();
  });

  it('calls SET_ASSIGN_VISIBILITY_MODAL when the Cancel button is clicked', () => {
    const cancelButton = screen.getByText('Cancel').closest('button');
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      payload: {
        open: false,
        user: null,
      },
      type: 'SET_ASSIGN_VISIBILITY_MODAL',
    });
  });

  it('populates user select when staff select has only one value', () => {
    const staffSelect = document.querySelector('div[class$="-staffSelect"]');
    const ownerSelect = document.querySelector('div[class$="-ownerSelect"]');

    selectEvent.openMenu(staffSelect.querySelector('.kitmanReactSelect input'));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    fireEvent.click(screen.getByText('John Doe'));

    expect(
      ownerSelect.querySelector('.kitmanReactSelect__single-value')?.textContent
    ).toEqual('John Doe');

    selectEvent.openMenu(staffSelect.querySelector('.kitmanReactSelect input'));
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Jane Smith'));

    expect(
      ownerSelect.querySelector('.kitmanReactSelect__single-value')
    ).toBeNull();
  });

  it('calls toastAction with SUCCESS when the Assign now button is clicked', async () => {
    const assignNowButton = screen.getByText('Assign now').closest('button');
    expect(assignNowButton).toBeInTheDocument();

    const staffSelect = document.querySelector('div[class$="-staffSelect"]');

    selectEvent.openMenu(staffSelect.querySelector('.kitmanReactSelect input'));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    fireEvent.click(screen.getByText('John Doe'));

    fireEvent.click(assignNowButton);

    useBulkUpdateNotesQuery.mockReturnValue({
      isSuccess: true,
    });

    await waitFor(() => {
      expect(props.toastAction).toHaveBeenCalledTimes(1);
      expect(props.toastAction).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Visibility assigned successfully',
        },
        type: 'CREATE_TOAST',
      });
    });
  });
});
