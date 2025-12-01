import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  useFetchApplicationStatusesQuery,
  useFilterByRegistrationStatusQuery,
  useFetchSectionStatusesQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi';
import {
  getPanelFormSectionId,
  getUserId,
  getRequirementById,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import useRegistrationStatus from '../useRegistrationStatus';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationStatusesApi',
  () => ({
    useFetchApplicationStatusesQuery: jest.fn(),
    useFilterByRegistrationStatusQuery: jest.fn(),
    useFetchSectionStatusesQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    getPanelFormSectionId: jest.fn(),
    getUserId: jest.fn(),
    getRequirementById: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = storeFake({});

const wrapper = ({ children }) => {
  return <Provider store={mockStore}>{children}</Provider>;
};

const mockSelectors = () => {
  getPanelFormSectionId.mockReturnValue(1);
  getUserId.mockReturnValue(1);
  getRequirementById.mockReturnValue(
    () => MOCK_REGISTRATION_PROFILE.registrations[0]
  );
};
const pendingStatus = [
  {
    label: 'Pending',
    value: 'pending',
  },
];

describe('useRegistrationStatus', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = true;
    mockSelectors();
    useFetchApplicationStatusesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
    useFilterByRegistrationStatusQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
    useFetchSectionStatusesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRegistrationStatus({}), { wrapper });

    expect(result.current.registrationFilterStatuses).toEqual(pendingStatus);
    expect(result.current.sectionStatuses).toEqual(pendingStatus);
    expect(result.current.registrationApplicationStatus).toEqual(pendingStatus);
    expect(result.current.isLoadingRegistrationFilterStatusesData).toBe(false);
    expect(result.current.isErrorRegistrationFilterStatusesData).toBe(false);
    expect(result.current.isSuccessRegistrationFilterStatuses).toBe(false);
    expect(result.current.isSuccessSectionStatuses).toBe(false);
    expect(result.current.isSuccessRegistrationApplicationStatuses).toBe(false);
  });

  it('should fetch application statuses', () => {
    const mockData = [{ type: 'approved', name: 'Approved' }];
    useFetchApplicationStatusesQuery.mockReturnValue({
      data: mockData,
      isSuccess: true,
    });
    const { result } = renderHook(() => useRegistrationStatus({}), { wrapper });

    expect(result.current.registrationApplicationStatus).toEqual([
      { value: 'approved', label: 'Approved' },
    ]);
  });

  it('should fetch section statuses', () => {
    const mockData = [{ type: 'active', name: 'Active' }];
    useFetchSectionStatusesQuery.mockReturnValue({
      data: mockData,
      isSuccess: true,
    });
    const { result } = renderHook(() => useRegistrationStatus({}), { wrapper });

    expect(result.current.sectionStatuses).toEqual([
      { value: 'active', label: 'Active' },
    ]);
  });

  it('should update registration filter statuses when data changes', () => {
    const mockData = [{ type: 'pending_league', name: 'Pending League' }];
    useFilterByRegistrationStatusQuery.mockReturnValue({
      data: mockData,
      isSuccess: true,
    });
    const { result } = renderHook(() => useRegistrationStatus({}), {
      wrapper,
    });

    expect(result.current.registrationFilterStatuses).toEqual([
      { value: 'pending_league', label: 'Pending League' },
    ]);
  });
});
