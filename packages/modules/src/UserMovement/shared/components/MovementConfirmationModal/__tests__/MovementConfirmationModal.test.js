import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import moment from 'moment';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useLazySearchAthletesQuery,
  useSearchMovementOrganisationsListQuery,
  useFetchUserDataQuery,
  useCreateMovementRecordMutation,
  REDUCER_PATH as userMovementServices,
} from '@kitman/modules/src/UserMovement/shared/redux/services';

import { data as MOCK_USER_DATA } from '@kitman/services/src/mocks/handlers/fetchUserData';
import { response as MOCK_ORG_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_movement_organisation_list';
import {
  data,
  meta,
} from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_athletes';
import {
  getUserProfile,
  getProfileResult,
  getMovementFromOrganisationFactory,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';

import { REDUCER_KEY as movementProfileReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementProfileSlice';
import { initialState as initialCreateMovementState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';

import MovementConfirmationModal from '..';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getProfileResult: jest.fn(),
  getUserProfile: jest.fn(),
  getMovementFromOrganisationFactory: jest.fn(),
}));

const onCreateMovementRecord = jest.fn();

const ninthOfFebruary = new Date('2024-02-09T00:00:01Z');

jest.useFakeTimers().setSystemTime(ninthOfFebruary);

moment.tz.setDefault('UTC');

const mockCreateSelector = () => {
  getProfileResult.mockReturnValue({
    data: {
      ...MOCK_USER_DATA.userOnly,
      athlete: MOCK_USER_DATA.withAthlete,
    },
  });
  getUserProfile.mockReturnValue(() => ({
    ...MOCK_USER_DATA.userOnly,
    athlete: MOCK_USER_DATA.withAthlete,
  }));
  getMovementFromOrganisationFactory.mockReturnValue(() => MOCK_ORG_LIST[1]);
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

const mockedGlobalApi = {
  queries: {
    'getOrganisation(undefined)': {
      data: {
        id: 1267,
        name: 'KLS',
        logo_full_path: 'logo_full_path',
      },
    },
  },
};

const mockTransferTypeFormState = (type, isOpen = true) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      modal: {
        isOpen,
      },
      form: {
        user_id: 1111,
        transfer_type: type,
        join_organisation_ids: [MOCK_ORG_LIST[0].id],
        join_squad_ids: [1],
        leave_organisation_ids: [
          MOCK_USER_DATA.withAthlete.organisations[0].id,
        ],
        joined_at: ninthOfFebruary,
      },
    },
    [movementProfileReducerKey]: {
      id: 11111,
    },
    [userMovementServices]: {
      useSearchMovementOrganisationsListQuery: jest.fn(),
    },
    globalApi: mockedGlobalApi,
    athleteManagementSlice: {
      statuses: {
        activeStatus: 'ACTIVE',
        careerStatus: 'ACTIVE',
      },
    },
  };
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementConfirmationModal {...props} />
    </Provider>
  );
};

describe('<MovementConfirmationModal/>', () => {
  beforeEach(() => {
    onCreateMovementRecord.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    useCreateMovementRecordMutation.mockReturnValue([
      onCreateMovementRecord,
      { isError: false, isLoading: false, isSuccess: false, data: null },
    ]);
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
    useLazySearchAthletesQuery.mockReturnValue([
      jest.fn(),
      {
        data: {
          data,
          meta,
        },
        isFetching: false,
        isError: false,
        isLoading: true,
      },
    ]);
    mockCreateSelector();
  });
  it('does not render when isOpen is false', () => {
    renderWithProviders(storeFake(mockTransferTypeFormState('trade', false)));

    expect(() => screen.getByText('/Confirmation/i')).toThrow();
  });

  it('does render when isOpen is true and displays common elements', () => {
    renderWithProviders(storeFake(mockTransferTypeFormState('trade')));
    expect(screen.getByText('Hacksaw Jim Duggan')).toBeInTheDocument();
    expect(screen.getByText('DOB:')).toBeInTheDocument();
    expect(screen.getByText('12 Oct 1990')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(
      screen.getByText('hacksawjimduggan@kitmanlabs.com')
    ).toBeInTheDocument();
    expect(screen.getByText('Athlete ID:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/9 Feb 2024/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  describe('Movement types', () => {
    it('transfer_type TRADE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('trade')));
      expect(screen.getByText('Trade Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Trade')).toBeInTheDocument();
      expect(screen.getByText(/Date of Trade/i)).toBeInTheDocument();
      expect(screen.getByText(/Traded from/i)).toBeInTheDocument();
      expect(screen.getByText(MOCK_ORG_LIST[0].name)).toBeInTheDocument();
      expect(screen.getByText(/Traded to/i)).toBeInTheDocument();
      expect(
        screen.getByText(MOCK_USER_DATA.withAthlete.organisations[0].name)
      ).toBeInTheDocument();
    });
    it('transfer_type MEDICAL_TRIAL', () => {
      renderWithProviders(
        storeFake(mockTransferTypeFormState('medical_trial'))
      );
      expect(
        screen.getByText('Medical Trial Confirmation')
      ).toBeInTheDocument();
      expect(screen.getByText('Medical Trial')).toBeInTheDocument();
      expect(screen.getByText(/Sharing Start Date/i)).toBeInTheDocument();
      expect(screen.getByText(/Sharing Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/3 days/i)).toBeInTheDocument();
      expect(screen.getByText(/Medical Trial with/i)).toBeInTheDocument();
    });

    it('transfer_type RETIRE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('retire')));
      expect(screen.getByText('Retired Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Retire')).toBeInTheDocument();
      expect(screen.getByText(/Retired Date/i)).toBeInTheDocument();
      expect(screen.getByText(/Released from/i)).toBeInTheDocument();
    });

    it('transfer_type RELEASE', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('release')));
      expect(screen.getByText('Release Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Release')).toBeInTheDocument();
      expect(screen.getByText(/Release Date/i)).toBeInTheDocument();
      expect(screen.getByText(/Released from/i)).toBeInTheDocument();
    });

    it('transfer_type MULTI_ASSIGN', () => {
      renderWithProviders(storeFake(mockTransferTypeFormState('multi_assign')));
      expect(screen.getByText('Multi Assign Confirmation')).toBeInTheDocument();
      expect(screen.getByText('Multi Assign')).toBeInTheDocument();
      expect(screen.getByText(/Multi Assign date/i)).toBeInTheDocument();
      expect(screen.getByText(/Assign to/i)).toBeInTheDocument();
    });
  });
});
