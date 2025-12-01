import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import useAssignVisibility from '../useAssignVisibility';

describe('useAssignVisibility hook', () => {
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

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { act } = TestRenderer;
  it('returns the initial data properly', () => {
    const { result } = renderHook(() => useAssignVisibility(), { wrapper });

    expect(result.current).toHaveProperty('userId');
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('updateUserId');
    expect(result.current).toHaveProperty('updateUser');

    expect(result.current.userId).toEqual(null);
    expect(result.current.user).toEqual(null);
    expect(result.current.inactiveUsersWithVisibilityIssues).toEqual(mockUsers);
    expect(result.current.toasts).toEqual([]);
  });

  it('updates userId properly', () => {
    const { result } = renderHook(() => useAssignVisibility(), { wrapper });

    act(() => {
      result.current.updateUserId(1);
    });

    expect(result.current.userId).toEqual(1);
  });

  it('updates user properly', () => {
    const { result } = renderHook(() => useAssignVisibility(), { wrapper });

    act(() => {
      result.current.updateUser(mockUsers[0]);
    });

    expect(result.current.user).toEqual(mockUsers[0]);
  });
});
