import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { data as mockFetchUserData } from '@kitman/services/src/mocks/handlers/fetchUserData';
import { response as mockHistoryResponse } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_post_movement_record_history';
import {
  useFetchUserDataQuery,
  usePostMovementRecordHistoryQuery,
  REDUCER_PATH as userMovementServices,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

import {
  getId,
  getUserProfile,
  getProfileResult,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';

import {
  getMovementHistory,
  getMovementHistoryResult,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementHistorySelectors';

import { REDUCER_KEY as movementHistoryReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementHistorySlice';
import { REDUCER_KEY as movementProfileReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementProfileSlice';
import { movementAssertions } from '../../../utils/test_utils';
import MovementActivityDrawer from '..';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getProfileResult: jest.fn(),
  getId: jest.fn(),
  getUserProfile: jest.fn(),
}));

jest.mock('../../../redux/selectors/movementHistorySelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementHistorySelectors'),
  getMovementHistory: jest.fn(),
  getMovementHistoryResult: jest.fn(),
}));

const mockSelectors = () => {
  getId.mockReturnValue(11111);
  getProfileResult.mockReturnValue({
    data: {
      ...mockFetchUserData.userOnly,
      athlete: mockFetchUserData.withAthlete,
    },
  });
  getUserProfile.mockReturnValue(() => ({
    ...mockFetchUserData.userOnly,
    athlete: mockFetchUserData.withAthlete,
  }));
  getMovementHistory.mockReturnValue(() => mockHistoryResponse.data);
  getMovementHistoryResult.mockReturnValue(mockHistoryResponse);
};

const mockQueries = () => {
  useFetchUserDataQuery.mockReturnValue({
    data: {
      ...mockFetchUserData.userOnly,
      athlete: mockFetchUserData.withAthlete,
    },
    isSuccess: true,
  });
  usePostMovementRecordHistoryQuery.mockReturnValue({
    data: mockHistoryResponse,
    isSuccess: true,
    isLoading: false,
    isError: false,
    isFetching: false,
  });
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const defaultStore = {
  [movementHistoryReducerKey]: {
    drawer: {
      isOpen: false,
    },
  },
  [movementProfileReducerKey]: {
    id: 11111,
  },

  [userMovementServices]: {
    useFetchUserDataQuery: jest.fn(),
    usePostMovementRecordHistoryQuery: jest.fn(),
  },
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementActivityDrawer {...props} />
    </Provider>
  );
};

describe('<MovementActivityDrawer/>', () => {
  beforeEach(() => {
    mockQueries();
    mockSelectors();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(storeFake(defaultStore));
    expect(() => screen.getByText('/Activity/i')).toThrow();
  });

  describe('happy paths', () => {
    beforeEach(() => {
      renderWithProviders(
        storeFake({
          ...defaultStore,
          [movementHistoryReducerKey]: {
            drawer: {
              isOpen: true,
            },
          },
        })
      );
    });
    it('does render when isOpen is true', () => {
      expect(screen.getAllByText('Activity')[0]).toBeInTheDocument();
    });
    it('does renders the athlete profile', () => {
      expect(screen.getByText('Hacksaw Jim Duggan')).toBeInTheDocument();
      expect(screen.getByText('DOB:')).toBeInTheDocument();
      expect(screen.getByText('12 Oct 1990')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(
        screen.getByText('hacksawjimduggan@kitmanlabs.com')
      ).toBeInTheDocument();
      expect(screen.getByText('Athlete ID:')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Assigned To:')).toBeInTheDocument();
      expect(screen.getAllByText('Manchester United')[0]).toBeInTheDocument();
      expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    });

    test.each(movementAssertions)('does render the movement history', (row) => {
      expect(
        screen.getByRole('row', {
          name: row,
        })
      ).toBeInTheDocument();
    });
  });
});
