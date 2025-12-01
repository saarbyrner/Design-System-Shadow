import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import moment from 'moment';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useSearchMovementOrganisationsListQuery,
  useFetchUserDataQuery,
  REDUCER_PATH as userMovementServices,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

import { data as MOCK_USER_DATA } from '@kitman/services/src/mocks/handlers/fetchUserData';
import { response as MOCK_ORG_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_movement_organisation_list';

import {
  getMovementFromOrganisationFactory,
  getUserProfile,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import { initialState as initialCreateMovementState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import {
  mockUserResult,
  mockUserWithOrgsResult,
} from '../../../utils/test_utils';
import MovementConfirmationDirection from '..';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getMovementFromOrganisationFactory: jest.fn(),
  getUserProfile: jest.fn(),
}));

const ninthOfFebruary = new Date('2024-02-09T00:00:01Z');

jest.useFakeTimers().setSystemTime(ninthOfFebruary);

moment.tz.setDefault('UTC');

const mockCreateSelector = (
  movementFromFactory = MOCK_ORG_LIST[1],
  userProfile = mockUserResult.data
) => {
  getMovementFromOrganisationFactory.mockReturnValue(() => movementFromFactory);
  getUserProfile.mockReturnValue(() => userProfile);
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

const mockTransferTypeFormState = (
  type,
  mockUser = MOCK_USER_DATA,
  leavingOrganisation = [MOCK_USER_DATA.withAthlete.organisations[0].id]
) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        user_id: mockUser.id,
        transfer_type: type,
        join_organisation_ids: [MOCK_ORG_LIST[0].id],
        join_squad_ids: [1],
        leave_organisation_ids: leavingOrganisation,

        joined_at: ninthOfFebruary,
      },
    },
    [userMovementServices]: {
      useSearchMovementOrganisationsListQuery: jest.fn(),
      fetchUserData: jest.fn(),
    },
    globalApi: {
      queries: {
        'getOrganisation(undefined)': {
          data: {
            id: 1267,
            name: 'KLS',
            logo_full_path: 'logo_full_path',
          },
        },
      },
    },
  };
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementConfirmationDirection {...props} />
    </Provider>
  );
};

describe('<MovementConfirmationDirection/>', () => {
  beforeEach(() => {
    useSearchMovementOrganisationsListQuery.mockReturnValue({
      data: MOCK_ORG_LIST,
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useFetchUserDataQuery.mockReturnValue({
      data: {
        ...MOCK_USER_DATA.userOnly,
        athlete: MOCK_USER_DATA.withAthlete,
      },
      isSuccess: true,
    });
    mockCreateSelector();
  });
  describe('Movement types', () => {
    it('renders for transfer_type TRADE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('trade')));

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Trade')).toBeInTheDocument();
      expect(screen.getByText('Date of Trade:')).toBeInTheDocument();
      expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Traded from/i)).toBeInTheDocument();
      expect(screen.getByText(/Manchester United/i)).toBeInTheDocument();
      expect(screen.getByText(/Traded to/i)).toBeInTheDocument();
      expect(screen.getByText(/Real Madrid/i)).toBeInTheDocument();
    });
    it('renders for transfer_type MEDICAL_TRIAL', () => {
      renderWithProviders(
        storeFake(mockTransferTypeFormState('medical_trial'))
      );

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Medical Trial')).toBeInTheDocument();
      expect(screen.getByText(/Sharing Start Date/i)).toBeInTheDocument();
      expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Sharing Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/3 days/i)).toBeInTheDocument();
      expect(screen.getByText(/Medical Trial with/i)).toBeInTheDocument();
      expect(screen.getByText(/Manchester United/i)).toBeInTheDocument();
    });
    it('renders for transfer_type RETIRE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('retire')));

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Retire')).toBeInTheDocument();
      expect(screen.getByText(/Retired Date/i)).toBeInTheDocument();
      expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Released from/i)).toBeInTheDocument();
      expect(screen.getByText(/KLS/i)).toBeInTheDocument();
    });
    it('renders for transfer_type RELEASE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('release')));

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Release')).toBeInTheDocument();
      expect(screen.getByText(/Release Date/i)).toBeInTheDocument();
      expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Released from/i)).toBeInTheDocument();
      expect(screen.getByText(/KLS/i)).toBeInTheDocument();
    });
    it('renders for transfer_type MULTI_ASSIGN', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('multi_assign')));

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Multi Assign')).toBeInTheDocument();
      expect(screen.getByText(/Multi Assign date/i)).toBeInTheDocument();
      expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Assign to/i)).toBeInTheDocument();
      expect(screen.getByText(/Manchester United/i)).toBeInTheDocument();
    });
  });
});

describe('Association movement type', () => {
  beforeEach(() => {
    useSearchMovementOrganisationsListQuery.mockReturnValue({
      data: [],
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useFetchUserDataQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    mockCreateSelector([], mockUserWithOrgsResult.data);
  });
  describe('Movement types', () => {
    it('renders for transfer_type RELEASE without release to if athlete has multiple orgs', () => {
      renderWithProviders(
        storeFake(
          mockTransferTypeFormState('release', mockUserWithOrgsResult.data, [
            mockUserWithOrgsResult.data.athlete.organisations[0].id,
          ])
        )
      );

      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('Release')).toBeInTheDocument();
      expect(screen.getByText(/Released from/i)).toBeInTheDocument();
      expect(screen.queryByText(/'Released to/i)).not.toBeInTheDocument();
    });
  });
});
