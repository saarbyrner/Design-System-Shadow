import * as redux from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import TabsContainer from '../TabsContainer';
import { useBulkUpdateNotesQuery } from '../../../../Medical/shared/redux/services/medical';

jest.mock('../../../../Medical/shared/redux/services/medical');

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

describe('Staff User: <TabsContainer /> Component', () => {
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
      assignVisibilityModal: {
        open: false,
        user: null,
      },
    },
  });

  const i18nT = i18nextTranslateStub();
  const mockProps = {
    t: i18nT,
  };

  const location = window.location;

  beforeEach(() => {
    useBulkUpdateNotesQuery.mockReturnValue({
      isSuccess: false,
    });

    usePermissions.mockReturnValue({
      permissions: {
        medical: { privateNotes: { canAdmin: false } },
      },
      permissionsRequestStatus: 'SUCCESS',
    });

    delete window.location;
    window.location = { ...location, assign: jest.fn() };
  });

  afterEach(() => {
    window.location = location;
  });

  it('renders', () => {
    const wrapper = render(
      <Provider store={store}>
        <TabsContainer {...mockProps} />
      </Provider>
    );
    expect(wrapper.container.children.length).toEqual(1);
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

    it('renders', () => {
      const wrapper = render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );
      expect(wrapper.container.children.length).toEqual(2);
    });

    it('displays visibility issues badge', () => {
      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(
        document.querySelector('div[class$="-badge"]')
      ).toBeInTheDocument();
      expect(
        document.querySelector('div[class$="-badge"]')?.textContent
      ).toEqual('2');
    });

    it('displays User updated successfully toast', () => {
      const newUrl = '#user_updated=1';
      Object.defineProperty(window.location, 'hash', {
        writable: true,
        value: newUrl,
      });

      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      expect(screen.getByText('User updated successfully')).toBeInTheDocument();
    });

    it('displays Assign visibility toast', () => {
      const newUrl = '#user_updated=1';
      Object.defineProperty(window.location, 'hash', {
        writable: true,
        value: newUrl,
      });

      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      expect(screen.getByText('Resolve now')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There are 2 private notes visible to the user. If visibility is not assigned to them, they will be lost.'
        )
      ).toBeInTheDocument();
    });

    it('hides the Assign visibility toast when clicking Assign later', async () => {
      const newUrl = '#user_updated=1';
      Object.defineProperty(window.location, 'hash', {
        writable: true,
        value: newUrl,
      });

      const { unmount } = render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      await fireEvent.click(screen.getByText('Assign later'));

      Object.defineProperty(window.location, 'hash', {
        writable: true,
        value: '',
      });

      unmount();
      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      expect(() => screen.getByText('Assign later')).toThrow();
    });

    it('calls SET_ASSIGN_VISIBILITY_MODAL when clicking Resolve now', async () => {
      const newUrl = '#user_updated=1';
      Object.defineProperty(window.location, 'hash', {
        writable: true,
        value: newUrl,
      });

      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      fireEvent.click(screen.getByText('Resolve now'));

      await waitFor(() => {
        expect(mockDispatchFn).toHaveBeenCalledTimes(1);
        expect(mockDispatchFn).toHaveBeenCalledWith({
          payload: {
            open: true,
            user: mockUsers[0],
          },
          type: 'SET_ASSIGN_VISIBILITY_MODAL',
        });
      });
    });
  });

  describe('[feature-flag] confidential-notes is off', () => {
    it('hides visibility issues badge', () => {
      render(
        <Provider store={store}>
          <TabsContainer {...mockProps} />
        </Provider>
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
      expect(document.querySelector('div[class$="-badge"]')).toBeFalsy();
    });
  });
});
