import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { useBulkUpdateAthleteLabelsMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { useShowToasts } from '@kitman/common/src/hooks';
import useBulkUpdateLabelsAction from '../utils/hooks/useBulkUpdateLabelsAction';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
);
jest.mock('@kitman/common/src/hooks');

const createMockStore = (state = {}) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('useBulkUpdateLabelsAction', () => {
  let store;
  const mockDispatch = jest.fn();
  const mockShowErrorToast = jest.fn();
  const mockBulkUpdateAthleteLabels = jest.fn();
  const mockT = jest.fn((str) => str);

  const mockLabelsData = [
    { id: 1, name: 'Label 1', color: '000' },
    { id: 2, name: 'Label 2', color: 'fff' },
    { id: 3, name: 'Non-registered', color: 'grey' },
  ];

  beforeEach(() => {
    store = createMockStore({
      labelsApi: {
        queries: {
          'getAllLabels(undefined)': {
            data: mockLabelsData,
          },
        },
      },
      'LeagueOperations.registration.slice.grids': {
        bulkActions: {
          selectedAthleteIds: [{ id: 1, userId: 123 }],
          originalSelectedLabelIds: [1, 2, 3],
          selectedLabelIds: [1, 2],
        },
      },
    });

    store.dispatch = mockDispatch;

    useGetAllLabelsQuery.mockReturnValue({
      data: mockLabelsData,
      isFetching: false,
    });

    useBulkUpdateAthleteLabelsMutation.mockReturnValue([
      mockBulkUpdateAthleteLabels,
      { isLoading: false },
    ]);

    useShowToasts.mockReturnValue({
      showErrorToast: mockShowErrorToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(
      () =>
        useBulkUpdateLabelsAction({
          selectedAthleteIds: [{ id: 1 }],
          canViewLabels: true,
          t: mockT,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    expect(result.current).toEqual({
      handleBulkUpdateLabelsClick: expect.any(Function),
      handleLabelChange: expect.any(Function),
      isBulkUpdateAthleteLabelsLoading: false,
      selectedLabelIds: [1, 2],
      originalSelectedLabelIds: [1, 2, 3],
      labelsOptions: [
        { value: 1, label: 'Label 1', color: '000' },
        { value: 2, label: 'Label 2', color: 'fff' },
        { value: 3, label: 'Non-registered', color: 'grey' },
      ],
      areLabelsDataFetching: false,
    });
  });

  it('should handle label change', () => {
    const { result } = renderHook(
      () =>
        useBulkUpdateLabelsAction({
          selectedAthleteIds: [{ id: 1 }],
          canViewLabels: true,
          t: mockT,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    act(() => {
      result.current.handleLabelChange({}, [1, 2]);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should handle bulk update labels click successfully', async () => {
    mockBulkUpdateAthleteLabels.mockResolvedValue({ data: {} });

    const { result } = renderHook(
      () =>
        useBulkUpdateLabelsAction({
          selectedAthleteIds: [{ id: 1 }],
          canViewLabels: true,
          t: mockT,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await act(async () => {
      await result.current.handleBulkUpdateLabelsClick();
    });

    expect(mockBulkUpdateAthleteLabels).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LeagueOperations.registration.slice.grids/onReset',
      payload: undefined,
    });
  });

  it('should simulate removal and adding', async () => {
    mockBulkUpdateAthleteLabels.mockResolvedValue({ data: {} });

    const { result } = renderHook(
      () =>
        useBulkUpdateLabelsAction({
          selectedAthleteIds: [{ id: 1 }],
          canViewLabels: true,
          t: mockT,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    act(() => {
      // Simulate label change to add label 2 and remove label 1
      result.current.handleLabelChange({}, [2]);
    });

    await act(async () => {
      await result.current.handleBulkUpdateLabelsClick();
    });

    expect(mockBulkUpdateAthleteLabels).toHaveBeenCalledWith({
      athleteIds: [1],
      labelsToAdd: [],
      labelsToRemove: [3],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LeagueOperations.registration.slice.grids/onReset',
      payload: undefined,
    });
  });

  it('should skip fetching labels when feature flag is disabled', () => {
    renderHook(
      () =>
        useBulkUpdateLabelsAction({
          selectedAthleteIds: [{ id: 1 }],
          canViewLabels: false,
          t: mockT,
        }),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    expect(useGetAllLabelsQuery).toHaveBeenCalledWith(undefined, {
      skip: true,
    });
  });
});
