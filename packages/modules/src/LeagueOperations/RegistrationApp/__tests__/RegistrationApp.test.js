import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider, useSelector } from 'react-redux';

import {
  getModal,
  getPanel,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';

import {
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import { initialState } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationProfileSlice';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import { MOCK_CURRENT_USER } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import RegistrationApp from '..';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
  getOrganisationResult: jest.fn(),
  getOrganisation: jest.fn(),
}));
jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
    getRegistrationPermissions: jest.fn(),
    getCurrentUser: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors'
    ),
    getProfile: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi'
    ),
    useFetchRegistrationProfileQuery: jest.fn(),
  })
);

// We dont really care what gets rendered in this case, as long as the correct
// component gets rendered. In this instance, I'm mocking them.
// components wil be tested in isolation.
jest.mock('@kitman/modules/src/LeagueOperations/RegistrationAssociationApp');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {
    useGetActiveSquadQuery: jest.fn(),
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  },
  'LeagueOperations.registration.slice.profile': initialState,
  'LeagueOperations.registration.api.profile': {
    useFetchRegistrationProfileQuery: jest.fn(),
  },
  'LeagueOperations.registration.slice.grids': {
    grids: {},
    modal: {},
    selectedRow: {},
  },
});

const props = {
  t: i18nextTranslateStub(),
};

const renderWithProviders = (storeArg, localProps) => {
  render(
    <Provider store={storeArg}>
      <RegistrationApp {...props} {...localProps} />
    </Provider>
  );
};

const mockRTKQueries = (
  state = { isLoading: true, isError: false, isSuccess: false, data: {} }
) => {
  useGetActiveSquadQuery.mockReturnValue(state);
  useGetOrganisationQuery.mockReturnValue(state);
  useGetPermissionsQuery.mockReturnValue(state);
  useGetPreferencesQuery.mockReturnValue(state);
  useGetCurrentUserQuery.mockReturnValue(state);
  useFetchRegistrationProfileQuery.mockReturnValue(state);
};

describe('<RegistrationApp/>', () => {
  describe('[INITIAL STATE] - loading', () => {
    beforeEach(() => {
      mockRTKQueries({
        data: null,
        isLoading: true,
      });
      useSelector.mockReturnValue({
        modal: {},
        panel: {},
      });
      useGridActions.mockReturnValue({
        onConfirm: jest.fn(),
        handleModalClose: jest.fn(),
      });
    });
    it('renders the loading message', async () => {
      renderWithProviders(storeFake(defaultStore));
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('[FAILURE STATE]', () => {
    beforeEach(() => {
      mockRTKQueries({
        data: null,
        isError: true,
      });
      useSelector.mockReturnValue({
        modal: {},
        panel: {},
      });
      useGridActions.mockReturnValue({
        onConfirm: jest.fn(),
        handleModalClose: jest.fn(),
      });
    });
    it('renders the error message', async () => {
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
    });
  });

  describe('[SUCCESS STATE]', () => {
    beforeEach(() => {
      mockRTKQueries({
        data: MOCK_CURRENT_USER,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useSelector.mockImplementation((selector) => {
        if (selector === getModal) {
          return { isOpen: false };
        }
        if (selector === getPanel) {
          return { isOpen: false };
        }
        if (selector === getProfile) {
          return MOCK_CURRENT_USER;
        }
        return null;
      });
      useGridActions.mockReturnValue({
        onConfirm: jest.fn(),
        handleModalClose: jest.fn(),
      });
    });

    it('renders the success state', async () => {
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    });
  });
});
