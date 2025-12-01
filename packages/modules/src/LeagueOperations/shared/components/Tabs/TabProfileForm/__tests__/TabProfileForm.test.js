import { screen, render } from '@testing-library/react';
import useRegistrationProfileForm from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationProfileForm';
import { Provider } from 'react-redux';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  getRegistrationProfile,
  getRequirementById,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import TabProfileForm from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi'
);
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationProfileForm',
  () => jest.fn()
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
    ),
    getRegistrationProfile: jest.fn(),
    getRequirementById: jest.fn(),
  })
);
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));

const createMockStore = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const mockSelectors = () => {
  getRegistrationProfile.mockReturnValue({
    id: 1234,
    permission_group: 'Athlete',
    registrations: [
      {
        id: 36710,
        user_id: 1234,
        status: 'approved',
        division: {
          id: 1,
          name: 'KLS Next',
        },
        registration_requirement: {
          id: 22,
          active: true,
        },
      },
    ],
  });

  getRequirementById.mockReturnValue(() => ({
    id: 12,
    user_id: 1234,
    status: 'approved',
    division: {
      id: 1,
      name: 'KLS',
    },
    registration_requirement: {
      id: 22,
      active: true,
    },
  }));
};

const defaultState = {
  globalApi: {},
  'LeagueOperations.registration.slice.requirements': {
    profile: MOCK_REGISTRATION_PROFILE,
  },
  'LeagueOperations.registration.api.profile': {
    profile: {
      id: 1,
      registration_status: {
        status: 'APPROVED',
      },
    },
  },
  formStateSlice: {
    originalForm: {},
    form: {},
    elements: {},
    structure: {},
    config: {
      mode: 'VIEW',
      showMenuIcons: false,
      showUnsavedChangesModal: false,
    },
  },
  formValidationSlice: {
    validation: {},
  },
  formMenuSlice: {
    menu: {},
    drawer: {
      isOpen: true,
    },
    active: {
      menuGroupIndex: 0,
      menuItemIndex: 0,
    },
  },
};

const renderWithProviders = (storeState) => {
  render(
    <Provider store={createMockStore(storeState)}>
      <TabProfileForm />
    </Provider>
  );
};

describe('TabProfileForm Component', () => {
  beforeEach(() => {
    mockSelectors();
    usePreferences.mockReturnValue({
      preferences: {
        registration_edit_profile: false,
      },
    });
    usePermissions.mockReturnValue({
      permissions: {
        homegrown: { canManageHomegrown: false },
        registration: { athlete: { canEdit: false } },
      },
    });
    useFetchIsRegistrationSubmittableQuery.mockReturnValue({
      data: {
        additional_info: null,
      },
    });
    getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    useRegistrationProfileForm.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    renderWithProviders(defaultState);
    expect(
      screen.getByTestId('ProfileFormLayout.Loading.FormBody')
    ).toBeInTheDocument();
  });

  it('renders error state', () => {
    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    });

    renderWithProviders(defaultState);
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });
  it('renders success state', () => {
    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProviders(defaultState);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  it('renders edit button', () => {
    window.featureFlags['league-operations-edit-registration-profiles'] = true;
    usePreferences.mockReturnValue({
      preferences: {
        registration_edit_profile: true,
      },
    });
    usePermissions.mockReturnValue({
      permissions: {
        homegrown: { canManageHomegrown: false },
        registration: { athlete: { canEdit: true } },
      },
    });
    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProviders(defaultState);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
  it('renders edit button with non-registrated player', () => {
    usePermissions.mockReturnValue({
      permissions: {
        homegrown: { canManageHomegrown: true },
        registration: { athlete: { canEdit: false } },
      },
    });

    getRegistrationProfile.mockReturnValue({
      id: 1234,
      permission_group: 'Athlete',
      non_registered: true,
      registrations: [
        {
          id: 36710,
          user_id: 1234,
          status: 'approved',
          division: {
            id: 1,
            name: 'KLS Next',
          },
          registration_requirement: {
            id: 22,
            active: true,
          },
        },
      ],
    });

    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProviders(defaultState);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders additional info alert', () => {
    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
    useFetchIsRegistrationSubmittableQuery.mockReturnValue({
      data: {
        additional_info:
          'To update this information, please sign into League Apps.',
      },
    });

    renderWithProviders(defaultState);
    expect(
      screen.getByText(
        'To update this information, please sign into League Apps.'
      )
    ).toBeInTheDocument();
  });

  it('does not render additional info alert when additional info is null', () => {
    useRegistrationProfileForm.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProviders(defaultState);
    expect(
      screen.queryByText(
        'To update this information, please sign into League Apps.'
      )
    ).not.toBeInTheDocument();
  });
});
