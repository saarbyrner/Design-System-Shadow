import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import {
  MOCK_CURRENT_USER,
  MOCK_PERMISSIONS,
  MOCK_NO_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useFetchClubPaymentQuery,
  REDUCER_KEY as registrationPaymentApiKey,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi';
import { data as MOCK_ORG } from '@kitman/services/src/mocks/handlers/getOrganisation';
import { data as MOCK_CLUB_PAYMENT } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_club_payment';

import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  FALLBACK_DASH,
  ORGANISATION_ADMIN,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import TabClubDetails from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationPaymentApi'
    ),
    useFetchClubPaymentQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
    getRegistrationPermissions: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  [registrationPaymentApiKey]: {
    useFetchClubPaymentQuery: jest.fn(),
  },
});

const props = {
  t: i18nextTranslateStub(),
  preferences: { registration_payments_display: true },
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <TabClubDetails {...props} />
    </Provider>
  );
};

const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type,
  mockedPermissions = MOCK_NO_PERMISSIONS.registration
) => {
  getRegistrationPermissions.mockReturnValue(() => mockedPermissions);
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
  getOrganisation.mockReturnValue(() => MOCK_ORG);
};

describe('<TabClubDetails/>', () => {
  describe('Club details', () => {
    beforeEach(() => {
      mockSelectors(ORGANISATION_ADMIN);
      useGetOrganisationQuery.mockReturnValue({
        data: MOCK_ORG,
        isLoading: false,
      });
      renderWithProviders(storeFake(defaultStore));
    });
    it('renders the club details card', async () => {
      expect(screen.getByText(/Club details/)).toBeInTheDocument();
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText(MOCK_ORG.name)).toBeInTheDocument();
      expect(screen.getByText('Address:')).toBeInTheDocument();
      expect(screen.getByText(FALLBACK_DASH)).toBeInTheDocument();
    });
  });

  describe('Payment details', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-payments-registration'] = true;
      mockSelectors(ORGANISATION_ADMIN, MOCK_PERMISSIONS.registration);
      useGetOrganisationQuery.mockReturnValue({
        data: MOCK_ORG,
        isLoading: false,
      });
      useFetchClubPaymentQuery.mockReturnValue({
        data: MOCK_CLUB_PAYMENT,
        isLoading: false,
      });
      renderWithProviders(storeFake(defaultStore));
    });
    afterEach(() => {
      window.featureFlags = {};
    });
    it('renders the payment details card', () => {
      expect(screen.getByText(/Payment/)).toBeInTheDocument();
    });
  });
});
