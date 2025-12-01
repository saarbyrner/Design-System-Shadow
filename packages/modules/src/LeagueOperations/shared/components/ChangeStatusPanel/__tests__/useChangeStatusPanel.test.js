import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { useFetchRegistrationStatusReasonsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import mockedRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_history';
import useChangeStatusPanel from '../hooks/useChangeStatusPanel';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultSelectedRow = {
  id: '1',
  registration_system_status: {
    id: '1',
    type: RegistrationStatusEnum.APPROVED,
    name: 'Approved',
  },
  registration_status: RegistrationStatusEnum.APPROVED,

  athlete: [
    {
      id: '1',
      text: 'Naruto Uzumaki',
    },
  ],
};

const defaultApprovalState = {
  status: RegistrationStatusEnum.APPROVED,
  reasonId: undefined,
  annotation: '',
};

const mockedReasons = [
  {
    id: 1,
    name: 'Reason 1',
  },
  {
    id: 2,
    name: 'Reason 2',
  },
];

const defaultReturnedValues = {
  handleOnClose: expect.any(Function),
  handleStatusChange: expect.any(Function),
  handleTracking: expect.any(Function),
  onSave: expect.any(Function),
  isPanelStateValid: false,
  panelState: {
    status: RegistrationStatusEnum.APPROVED,
    reasonId: undefined,
    annotation: '',
  },
  isUserUnapproved: false,
  isUnapprovingUser: false,
  modalBody: {
    header: 'Approve user',
    body: expect.stringContaining(
      'will be approved. He will now be able to be placed on rosters and active in the system.'
    ),
    ctaText: 'Approve',
  },
  reasons: mockedReasons,
  username: 'Naruto Uzumaki',
  registrationHistory: mockedRegistrationHistory,
};

const mockStore = (
  selectedRow = defaultSelectedRow,
  approvalState = defaultApprovalState
) =>
  storeFake({
    [REDUCER_KEY]: {
      grids: null,
      modal: {
        isOpen: false,
        action: '',
        text: {},
      },
      panel: {
        isOpen: false,
      },
      approvalState,
      selectedRow,
    },
  });

describe('useChangeStatusPanel', () => {
  beforeAll(() => {
    useFetchRegistrationStatusReasonsQuery.mockReturnValue({
      data: mockedReasons,
    });
    useFetchRegistrationHistoryQuery.mockReturnValue({
      data: mockedRegistrationHistory,
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return the correct values when user is approved', () => {
    const { result } = renderHook(() => useChangeStatusPanel(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore()}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual(defaultReturnedValues);
  });

  it('should return the correct values when user is unapproved', () => {
    const { result } = renderHook(() => useChangeStatusPanel(), {
      wrapper: ({ children }) => (
        <Provider
          store={mockStore(
            {
              ...defaultSelectedRow,
              registration_system_status: {
                id: '2',
                type: RegistrationStatusEnum.UNAPPROVED,
                name: 'Unapproved',
              },
            },
            {
              ...defaultApprovalState,
              status: undefined,
            }
          )}
        >
          {children}
        </Provider>
      ),
    });

    result.current.handleStatusChange({
      key: 'status',
      value: RegistrationStatusEnum.UNAPPROVED,
    });

    expect(result.current).toEqual({
      ...defaultReturnedValues,
      isUserUnapproved: true,
      isUnapprovingUser: true,
      panelState: {
        ...defaultApprovalState,
        annotation: 'Bad Behavior',
        status: RegistrationStatusEnum.UNAPPROVED,
      },
      modalBody: {
        header: 'Unapprove user',
        body: expect.stringContaining(
          'will be unapproved indefinitely. He will not be able to be placed on rosters or active in the system.'
        ),
        ctaText: 'Unapprove',
      },
    });
  });

  it('should return the correct values when the user is unapproved with a reason and has a note', async () => {
    const { result } = renderHook(() => useChangeStatusPanel(), {
      wrapper: ({ children }) => (
        <Provider
          store={mockStore(
            {
              ...defaultSelectedRow,
              registration_system_status: {
                id: '2',
                type: RegistrationStatusEnum.UNAPPROVED,
                name: 'Unapproved',
              },
            },
            {
              ...defaultApprovalState,
              status: RegistrationStatusEnum.UNAPPROVED,
              reasonId: 1,
              annotation: 'This is a note',
            }
          )}
        >
          {children}
        </Provider>
      ),
    });

    await act(async () => {
      result.current.handleStatusChange({
        key: 'annotation',
        value: 'This is an updated note',
      });
    });

    expect(result.current).toEqual({
      ...defaultReturnedValues,
      isUserUnapproved: true,
      isUnapprovingUser: true,
      isPanelStateValid: true,
      panelState: {
        ...defaultApprovalState,
        status: RegistrationStatusEnum.UNAPPROVED,
        reasonId: 1,
        annotation: 'This is an updated note',
      },
      modalBody: {
        header: 'Unapprove user',
        body: expect.stringContaining(
          'will be unapproved indefinitely. He will not be able to be placed on rosters or active in the system.'
        ),
        ctaText: 'Unapprove',
      },
    });
  });

  it('should return `isPanelStateValid` as true when the user is unapproved and has updated the reason regardless of the annotation', async () => {
    const { result } = renderHook(() => useChangeStatusPanel(), {
      wrapper: ({ children }) => (
        <Provider
          store={mockStore(
            {
              ...defaultSelectedRow,
              registration_system_status: {
                id: '2',
                type: RegistrationStatusEnum.UNAPPROVED,
                name: 'Unapproved',
              },
            },
            {
              ...defaultApprovalState,
              status: RegistrationStatusEnum.UNAPPROVED,
              reasonId: 1,
            }
          )}
        >
          {children}
        </Provider>
      ),
    });

    await act(async () => {
      result.current.handleStatusChange({
        key: 'reasonId',
        value: 2,
      });
    });

    expect(result.current).toEqual({
      ...defaultReturnedValues,
      isUserUnapproved: true,
      isUnapprovingUser: true,
      isPanelStateValid: true,
      panelState: {
        ...defaultApprovalState,
        status: RegistrationStatusEnum.UNAPPROVED,
        reasonId: 2,
        annotation: 'Bad Behavior',
      },
      modalBody: {
        header: 'Unapprove user',
        body: expect.stringContaining(
          'will be unapproved indefinitely. He will not be able to be placed on rosters or active in the system.'
        ),
        ctaText: 'Unapprove',
      },
    });
  });
});
