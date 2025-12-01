import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import Header from '../Header';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

describe('Staff User: <Header /> Component', () => {
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
      users: [],
      inactiveUsers: mockUsers,
      searchText: '',
    },
  });

  const i18nT = i18nextTranslateStub();
  const mockProps = {
    t: i18nT,
  };

  const location = window.location;

  const createNewUserButtonText = 'Create New User';

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: { privateNotes: { canAdmin: false } },
        settings: { canManageStaffUsers: true },
      },
      permissionsRequestStatus: 'SUCCESS',
    });

    delete window.location;
    window.location = { ...location, assign: jest.fn() };
    window.featureFlags['form-based-staff-profile'] = false;
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders', () => {
    const wrapper = render(<Header {...mockProps} />);
    expect(wrapper.container.children.length).toEqual(1);
  });

  it('Renders header text', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText('Manage Staff Users')).toBeInTheDocument();
  });

  it('redirects to new user route when clicking Create New User', () => {
    render(<Header {...mockProps} />);

    const button = screen.getByRole('button', {
      name: createNewUserButtonText,
    });

    expect(button).toBeInTheDocument();

    button.click();

    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('/users/new');
  });

  describe('with form-based-staff-profile FF on', () => {
    beforeEach(() => {
      window.featureFlags['form-based-staff-profile'] = true;
    });

    afterEach(() => {
      window.featureFlags['form-based-staff-profile'] = false;
    });

    it('redirects to form based new user route when clicking Create New User', () => {
      render(<Header {...mockProps} />);

      const button = screen.getByRole('button', {
        name: createNewUserButtonText,
      });

      expect(button).toBeInTheDocument();

      button.click();

      expect(window.location.assign).toHaveBeenCalledTimes(1);
      expect(window.location.assign).toHaveBeenCalledWith(
        '/administration/staff/new'
      );
    });

    it('does not show the create new user button when the user does not have edit permissions', () => {
      usePermissions.mockReturnValue({
        permissions: {
          settings: { canManageStaffUsers: false },
        },
      });

      render(<Header {...mockProps} />);

      expect(
        screen.queryByRole('button', {
          name: createNewUserButtonText,
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] confidential-notes is on', () => {
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

    it('displays the visibility issues indicator', () => {
      render(
        <Provider store={store}>
          <Header {...mockProps} />
        </Provider>
      );

      expect(
        screen.getByText('2 users with visibility issues')
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] confidential-notes is off', () => {
    it('hides the visibility issues indicator', () => {
      render(
        <Provider store={store}>
          <Header {...mockProps} />
        </Provider>
      );

      expect(() =>
        screen.getByText('2 users with visibility issues')
      ).toThrow();
    });
  });
});
