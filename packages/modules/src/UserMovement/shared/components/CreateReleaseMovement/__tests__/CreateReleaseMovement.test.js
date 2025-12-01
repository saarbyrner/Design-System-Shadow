import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { getUserProfile } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import { initialState as initialCreateMovementState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import { data as MOCK_USER_DATA } from '@kitman/services/src/mocks/handlers/fetchUserData';
import {
  initialState as initialProfileState,
  REDUCER_KEY as movementProfileState,
} from '../../../redux/slices/movementProfileSlice';
import { mockUserResult } from '../../../utils/test_utils';
import { CreateReleaseMovementTranslated as CreateReleaseMovement } from '..';

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getUserProfile: jest.fn(),
}));

const mockCreateSelector = (userProfile = mockUserResult.data) => {
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

const defaultFormState = {
  transfer_type: 'release',
  leave_organisation_ids: [],
  user_id: MOCK_USER_DATA.id,
};

const associationOrg = {
  id: 112,
  name: 'KLS',
  logo_full_path: 'logo_full_path',
};

const org = {
  id: 113,
  name: 'KL Galaxy',
  logo_full_path: 'logo_full_path',
};

const mockTransferTypeFormState = (mockedFormState) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        ...defaultFormState,
        ...mockedFormState,
      },
    },
    [movementProfileState]: {
      profile: {
        ...initialProfileState,
      },
    },
    globalApi: {
      queries: {
        'getOrganisation(undefined)': {
          data: associationOrg,
        },
      },
    },
  };
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <CreateReleaseMovement {...props} />
    </Provider>
  );
};

describe('<MovementConfirmationDirection/>', () => {
  beforeEach(() => {
    mockCreateSelector();
  });

  describe('CreateReleaseMovement', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('renders the loading state if association athlete is undefined', () => {
      mockCreateSelector({});
      renderWithProviders(storeFake(mockTransferTypeFormState()));

      expect(screen.queryByText(/Release from/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/This athlete has no club to be released from./i)
      ).not.toBeInTheDocument();

      expect(screen.getByTestId(/DelayedLoadingFeedback/i)).toBeInTheDocument();
    });

    it('renders the alert message is athlete is at association level', () => {
      mockCreateSelector({
        id: 1,
        athlete: {
          organisations: [associationOrg],
          avatar_url: 'Logo/url',
        },
      });
      renderWithProviders(storeFake(mockTransferTypeFormState()));

      expect(screen.queryByText(/Release from/i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/This athlete has no club to be released from./i)
      ).toBeInTheDocument();
    });

    it('does not render the alert message if athlete is at association level and assigned to an org', () => {
      mockCreateSelector({
        id: 1,
        athlete: {
          organisations: [associationOrg, org],
          avatar_url: 'Logo/url',
        },
      });
      renderWithProviders(storeFake(mockTransferTypeFormState()));

      expect(screen.getByText(/Release from/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/This athlete has no club to be released from./i)
      ).not.toBeInTheDocument();
    });

    it('renders the releasing from selection', () => {
      renderWithProviders(
        storeFake(
          mockTransferTypeFormState({
            leave_organisation_ids: [1267],
          })
        )
      );

      expect(screen.getByText(/Release from/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue('KL Galaxy');
    });
  });
});
