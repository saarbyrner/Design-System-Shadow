import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import UserTable from '../UserTable';

jest.mock('../../../../Medical/shared/redux/services/medical');
jest.mock('@kitman/services/src/services/unlockAccess', () =>
  jest.fn().mockResolvedValue(true)
);

const defaultLocation = window.ipForGovernment;
const isIpForGov = (value) => {
  Object.defineProperty(window, 'ipForGovernment', {
    value,
  });
};

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

const mockUsers = [
  {
    id: 1,
    username: 'johndoe1',
    access_locked: true,
    current: false,
    created: '2023-01-01',
    updated: '2023-01-02',
    avatar: 'user1.jpg',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@gmail.com',
    role: 'Account Admin',
  },
  {
    id: 2,
    username: 'janesmith1',
    access_locked: false,
    current: false,
    created: '2023-02-01',
    updated: '2023-02-02',
    avatar: 'user2.jpg',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'janesmith@gmail.com',
  },
];

const mockProps = {
  title: '',
  users: [],
  columns: [],
  noResultsText: '',
};

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

describe('<UserTable />', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        userAccounts: { canUnlock: false },
        medical: { privateNotes: { canAdmin: false } },
        settings: { canViewStaffUsers: false },
      },
      permissionsRequestStatus: 'SUCCESS',
    });

    Object.defineProperty(window, 'ipForGovernment', {
      writable: true,
      value: true,
    });

    window.featureFlags['form-based-staff-profile'] = false;
  });

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    userReducer: {
      users: [],
      inactiveUsers: mockUsers,
      searchText: '',
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.ipForGovernment = defaultLocation;
  });

  describe('Staff User: <UserTable />', () => {
    it('renders header text', () => {
      const title = 'Active Users';
      render(
        <Provider store={store}>
          <UserTable {...mockProps} title={title} />
        </Provider>
      );
      const header = screen.getByText(title);
      expect(header).toBeInTheDocument();
    });

    it('renders no results text when no columns rendered', () => {
      const noResults = 'No results text';
      render(
        <Provider store={store}>
          <UserTable {...mockProps} noResultsText={noResults} />
        </Provider>
      );
      const noResultsElement = screen.getByText(noResults);
      expect(noResultsElement).toBeInTheDocument();
    });

    it('renders the avatar and full name in the staff_name column inside a link', () => {
      const columns = [{ id: 'staff_name', content: 'Staff name' }];
      const users = [...mockUsers];
      render(
        <Provider store={store}>
          <UserTable {...mockProps} columns={columns} users={users} />
        </Provider>
      );

      mockUsers.forEach((user) => {
        const usernameCell = screen.getByText(
          `${user.firstname} ${user.lastname}`
        );
        const altText = `${user.firstname[0]}${user.lastname[0]}`;
        const userAvatar = screen.getByAltText(altText);

        expect(userAvatar).toBeInTheDocument();
        expect(usernameCell).toBeInTheDocument();
      });
    });

    it('renders the edit url in the edit column', () => {
      const columns = [{ id: 'staff_name', content: 'Staff name' }];
      render(
        <Provider store={store}>
          <UserTable {...mockProps} columns={columns} users={[...mockUsers]} />
        </Provider>
      );
      const links = screen.getAllByRole('link');

      expect(links[1]).toHaveAttribute('href', '/users/1/edit');
    });

    describe("with the 'form-based-staff-profile' FF on", () => {
      beforeEach(() => {
        window.featureFlags['form-based-staff-profile'] = true;
      });

      afterEach(() => {
        window.featureFlags['form-based-staff-profile'] = false;
      });
      it('renders the form based staff profile edit url in the edit column and in the name column', () => {
        usePermissions.mockReturnValue({
          permissions: {
            settings: { canViewStaffUsers: true },
          },
        });
        const columns = [{ id: 'staff_name', content: 'Staff name' }];
        render(
          <Provider store={store}>
            <UserTable
              {...mockProps}
              columns={columns}
              users={[...mockUsers]}
            />
          </Provider>
        );
        const href = '/administration/staff/1';

        const firstRow = screen.getAllByRole('row')[1]; // the header is the first
        const allCells = Array.from(firstRow.querySelectorAll('td'));
        const firstCell = allCells.at(0);
        expect(firstCell.querySelector('a')).toHaveAttribute('href', href);

        const lastCell = allCells.at(-2); // the actual last is a filler cell
        expect(lastCell.querySelector('a')).toHaveAttribute('href', href);
      });

      it('does not render the form based staff profile edit url in the edit column and in the name column because the user does not have permissions', () => {
        const columns = [{ id: 'staff_name', content: 'Staff name' }];
        render(
          <Provider store={store}>
            <UserTable
              {...mockProps}
              columns={columns}
              users={[...mockUsers]}
            />
          </Provider>
        );
        const href = '/administration/staff/1';

        const firstRow = screen.getAllByRole('row')[1]; // the header is the first
        const allCells = Array.from(firstRow.querySelectorAll('td'));
        const firstCell = allCells.at(0);
        expect(firstCell.querySelector('div')).not.toHaveAttribute(
          'href',
          href
        );

        const lastCell = allCells.at(-2); // the actual last is a filler cell
        expect(lastCell).toBeEmptyDOMElement();
      });
    });

    it('renders nothing in the edit column when current user', () => {
      const users = [
        {
          id: 1,
          username: 'User-1',
          access_locked: true,
          current: true,
          created: '2023-01-01',
          updated: '2023-01-02',
          avatar: 'user1.jpg',
          firstname: 'John',
          lastname: 'Doe',
        },
      ];
      const columns = [{ id: 'staff_name', content: 'Staff name' }];
      render(
        <Provider store={store}>
          <UserTable {...mockProps} columns={columns} users={users} />
        </Provider>
      );

      const links = screen.getAllByRole('link');
      const userTableName = links[0];
      expect(userTableName).toBeInTheDocument();
      expect(links[1]).toBeUndefined();
    });

    it('renders the formatted date in the created and updated columns', () => {
      const columns = [
        { id: 'created', content: '' },
        { id: 'updated', content: '' },
      ];
      const users = [...mockUsers];
      render(
        <Provider store={store}>
          <UserTable {...mockProps} columns={columns} users={users} />
        </Provider>
      );
      const createdDate = screen.getByText('January 1, 2023');
      const updatedDate = screen.getByText('January 2, 2023');
      expect(createdDate).toBeInTheDocument();
      expect(updatedDate).toBeInTheDocument();
    });

    it('renders data into the remaining supported columns', () => {
      const columns = [
        { id: 'role', content: 'User Role' },
        { id: 'username', content: 'Username' },
        { id: 'email', content: 'Email' },
      ];
      const users = [...mockUsers];
      render(
        <Provider store={store}>
          <UserTable {...mockProps} columns={columns} users={users} />
        </Provider>
      );
      const role = screen.getByText('Account Admin');
      const username = screen.getByText('johndoe1');
      const email = screen.getByText('johndoe@gmail.com');
      expect(role).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
    });
  });

  describe('UserTable, visibility issues column', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canAdmin: true } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = true;
    });
    afterEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canAdmin: false } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders data into visibility issues column', () => {
      const columns = [
        { id: 'orphaned_annotation_ids', content: 'Visibility issues' },
      ];
      render(
        <Provider store={store}>
          <UserTable
            users={[
              mockUsers[0],
              { ...mockUsers[0], orphaned_annotation_ids: [1, 2] },
            ]}
            columns={columns}
          />
        </Provider>
      );

      expect(screen.getByText('2 private notes')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Resolve' })
      ).toBeInTheDocument();
    });

    it('calls SET_ASSIGN_VISIBILITY_MODAL modal when clicking Resolve', async () => {
      const columns = [
        { id: 'orphaned_annotation_ids', content: 'Visibility issues' },
      ];
      render(
        <Provider store={store}>
          <UserTable
            users={[
              mockUsers[0],
              { ...mockUsers[0], orphaned_annotation_ids: [1, 2] },
            ]}
            columns={columns}
          />
        </Provider>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Resolve' }));

      await waitFor(() => {
        expect(mockDispatchFn).toHaveBeenCalledTimes(1);
        expect(mockDispatchFn).toHaveBeenCalledWith({
          payload: {
            open: true,
            user: { ...mockUsers[0], orphaned_annotation_ids: [1, 2] },
          },
          type: 'SET_ASSIGN_VISIBILITY_MODAL',
        });
      });
    });
  });

  describe('UserTable, access locked column', () => {
    describe('unlock modal', () => {
      beforeEach(() => {
        usePermissions.mockReturnValue({
          permissions: {
            userAccounts: { canUnlock: true },
            medical: { privateNotes: { canAdmin: false } },
          },
          permissionsRequestStatus: 'SUCCESS',
        });
        render(
          <Provider store={store}>
            <UserTable
              title="User List"
              users={mockUsers}
              columns={[{ id: 'username', content: 'Username' }]}
              noResultsText="No users found."
            />
          </Provider>
        );
      });
      it('renders unlock button if ipForGovernment and canUnlock are true', () => {
        const unlockButton = screen.getByRole('button', {
          name: 'Unlock',
        });
        expect(unlockButton).toBeInTheDocument();
        fireEvent.click(unlockButton);
        expect(screen.getByText('Unlock this account')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(
          screen.queryByText('Unlock this account')
        ).not.toBeInTheDocument();
      });

      it('should open and close modal', async () => {
        fireEvent.click(screen.getByText('Unlock'));
        expect(screen.getByText('Unlock this account')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(
          screen.queryByText('Unlock this account')
        ).not.toBeInTheDocument();
      });

      it('should render and unlock user access', async () => {
        fireEvent.click(screen.getByText('Unlock'));
        fireEvent.click(screen.getByText('Unlock account'));

        await waitFor(() => {
          expect(screen.getByText('Account unlocked')).toBeInTheDocument();
        });
      });
    });

    it('does not render unlock button if ipForGovernment is false', () => {
      isIpForGov(false);
      render(
        <Provider store={store}>
          <UserTable
            title="User List"
            users={mockUsers}
            columns={[{ id: 'username', content: 'Username' }]}
            noResultsText="No users found."
          />
        </Provider>
      );

      const unlockButton = screen.queryByRole('button', {
        name: 'Unlock',
      });
      expect(unlockButton).not.toBeInTheDocument();
    });
  });
});
