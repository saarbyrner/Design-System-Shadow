import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { MOCK_PERMISSIONS } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import RegistrationHomeApp from '..';

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

// We dont really care what gets rendered in this case, as long as the correct
// component gets rendered. In this instance, I'm mocking them.
// components wil be tested in isolation.
jest.mock('@kitman/modules/src/LeagueOperations/RegistrationAssociationApp');
jest.mock('@kitman/modules/src/LeagueOperations/RegistrationOrganisationApp');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.profile': {
    useFetchRegistrationProfileQuery: jest.fn(),
  },
});

const props = {
  t: i18nextTranslateStub(),
};

const renderWithProviders = (storeArg, localProps) => {
  render(
    <Provider store={storeArg}>
      <RegistrationHomeApp {...props} {...localProps} />
    </Provider>
  );
};

const mockSelectors = ({
  mockedPermissions = MOCK_PERMISSIONS.registration,
  user = 'association_admin',
}) => {
  getRegistrationPermissions.mockReturnValue(() => mockedPermissions);
  getRegistrationUserTypeFactory.mockReturnValue(() => user);
};

describe('<RegistrationHomeApp/>', () => {
  describe('association_admin', () => {
    beforeEach(() => {
      mockSelectors({
        mockedPermissions: MOCK_PERMISSIONS.registration,
        user: 'association_admin',
      });
    });
    it('renders', () => {
      renderWithProviders(storeFake(defaultStore));
      expect(
        screen.getByText(/RegistrationAssociationAppTranslated/)
      ).toBeInTheDocument();
    });
  });

  describe('organisation_admin', () => {
    beforeEach(() => {
      mockSelectors({
        mockedPermissions: MOCK_PERMISSIONS.registration,
        user: 'organisation_admin',
      });
    });
    it('renders', () => {
      renderWithProviders(storeFake(defaultStore));
      expect(
        screen.getByText(/RegistrationOrganisationApp/)
      ).toBeInTheDocument();
    });
  });
});
