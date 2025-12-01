import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import useOrganisationId from '@kitman/modules/src/LeagueOperations/shared/hooks/useOrganisationId';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { getOrganisation } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationOrganisationSelectors';
import {
  useSearchAthleteListQuery,
  useFetchRegistrationStatusOptionsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import {
  REDUCER_KEY as HOMEGROWN_SLICE,
  initialState as initialHomegrownState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/homegrownSlice';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import MLS_NEXT_GRIDS from '@kitman/modules/src/LeagueOperations/technicalDebt/grids/mlsNext';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';

import { MOCK_CURRENT_USER } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import RegistrationOrganisationApp from '../index';

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useOrganisationId'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useSearchAthleteListQuery: jest.fn(),
    useFetchRegistrationStatusOptionsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi'
    ),
    useFetchRegistrationGridsQuery: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationOrganisationSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationOrganisationSelectors'
    ),
    getOrganisation: jest.fn(),
  })
);
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

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors'
    ),
    getIsHomegrownPanelOpen: jest.fn(),
    getHomegrownSubmission: jest.fn(),
  })
);

const MOCK_ATHLETE_LIST = [
  {
    id: 235887,
    address: null,
    avatar_url: 'dummy1234/test.png',
    date_of_birth: '2024-08-01',
    firstname: 'Marcus',
    fullname: 'Marcus Moore',
    lastname: 'Moore',
    email: 'ksorton@gmail.com',
    organisations: [
      {
        id: 1267,
        name: 'KL Galaxy',
        logo_full_path: 'dummy1234/test.png',
        address: null,
      },
    ],
    registration_status: {
      id: 1138684,
      status: 'approved',
      created_at: '2024-08-20T20:48:16Z',
      current_status: true,
      registration_system_status: {
        id: 11,
        name: 'Approved',
        type: 'approved',
      },
      registration_status_reason: null,
    },
    shortname: 'M. Moore',
    squad_numbers: [],
    squads: [
      {
        id: 3494,
        name: 'U13',
      },
    ],
    type: null,
    user_id: 345073,
    labels: [],
    registrations: [
      {
        id: 24158,
        user_id: 345073,
        status: 'approved',
        division: {
          id: 1,
          name: 'KLS Next',
          attachment: null,
        },
        registration_requirement: {
          id: 22,
          active: true,
          externally_managed: false,
        },
      },
    ],
    registration_system_status: {
      id: 11,
      name: 'Approved',
      type: 'approved',
    },
    position: {
      id: 84,
      name: 'Goalkeeper',
    },
    non_registered: false,
  },
];

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
  'LeagueOperations.registration.slice.grids': {
    grids: null,
    modal: {
      isOpen: false,
      action: '',
      text: {},
    },
    panel: {
      isOpen: false,
    },
    approvalState: {
      annotation: '',
    },
    selectedRow: {},
    bulkActions: {
      selectedAthleteIds: [],
      originalSelectedLabelIds: [],
      selectedLabelIds: [],
    },
  },
  'LeagueOperations.services': {},
  [HOMEGROWN_SLICE]: initialHomegrownState,
});

const renderWithProvider = (component, setStore = defaultStore) => {
  usePreferences.mockReturnValue({
    preferences: { registration_expire_enabled: true },
  });
  usePermissions.mockReturnValue({
    permissions: {
      registration: { status: { expire: true }, payment: { canExportPayment: false} },
      settings: { canRunLeagueExports: true },
      homegrown: { canViewHomegrownTags: true },
    },
  });
  return render(
    <Provider store={setStore}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        {component}
      </LocalizationProvider>
    </Provider>
  );
};

const mockSelectors = (
  mockedUserType = MOCK_CURRENT_USER.registration.user_type
) => {
  getOrganisation.mockReturnValue({
    id: '1267',
    organisation: {
      id: 1267,
      address: null,
      handle: 'klgalaxy',
      logo_full_path: 'dummy/test.png',
      name: 'KL Galaxy',
    },
  });
  getRegistrationUserTypeFactory.mockReturnValue(() => mockedUserType);
  getRegistrationPermissions.mockReturnValue(() => ({
    registrationArea: {
      canView: true,
    },
    organisation: {
      canView: true,
    },
    athlete: {
      canView: true,
      canEdit: true,
    },
    staff: {
      canView: true,
      canEdit: true,
    },
  }));
};

const mockRTKQueries = ({ grid, athletes }) => {
  useFetchRegistrationGridsQuery.mockReturnValue({
    data: grid,
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useFetchRegistrationStatusOptionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
  });
  useSearchAthleteListQuery.mockReturnValue(athletes);
  useRegistrationStatus.mockReturnValue({
    registrationFilterStatuses: [],
    isSuccessRegistrationFilterStatuses: false,
  });
};

describe('RegistrationOrganisationApp', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-expire-registration-profiles'] = true;
    mockSelectors();
    mockRTKQueries({
      grid: MLS_NEXT_GRIDS.association_admin.athlete,

      athletes: {
        data: {
          data: MOCK_ATHLETE_LIST,
          meta: {
            current_page: 1,
            next_page: null,
            prev_page: null,
            total_count: 2,
            total_pages: 1,
          },
        },
        isLoading: false,
        isFetching: false,
        isError: false,
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state', () => {
    useOrganisationId.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    });
    renderWithProvider(<RegistrationOrganisationApp />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render the error state', () => {
    useOrganisationId.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    });
    renderWithProvider(<RegistrationOrganisationApp />);

    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });

  it('should render the app on success', () => {
    useOrganisationId.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProvider(<RegistrationOrganisationApp />);

    expect(screen.getByText('Club Details')).toBeInTheDocument();
  });

  it('expires Registration', async () => {
    const user = userEvent.setup();
    useOrganisationId.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });

    renderWithProvider(<RegistrationOrganisationApp />);
    await user.click(screen.getByText('Players'));
    // click the action menu button
    expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();

    await user.click(screen.getByTestId('MoreVertIcon'));
    // click the Expire Registration menu item to trigger modal
    expect(
      screen.getByRole('menuitem', { name: 'Expire Registration' })
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('menuitem', { name: 'Expire Registration' })
    );
  });

  // check if GridActionsModal is rendered with the correct props
  it('renders GridActionsModal with correct props', () => {
    useOrganisationId.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
    const mockModal = {
      isOpen: true,
      action: 'expire_registration',
      text: {
        body: 'Click confirm to expire the KLS Next registration for Marcus Moore',
        header: 'Expire Registration',
        description:
          'Once expired, the registration is cleared, reset and ready to be filled out and resubmitted.',
      },
    };
    // getModal.mockReturnValue(mockModal);
    renderWithProvider(
      <RegistrationOrganisationApp />,
      storeFake({
        globalApi: {},
        'LeagueOperations.registration.slice.grids': {
          grids: MLS_NEXT_GRIDS.association_admin.athlete,
          modal: mockModal,
          panel: {
            isOpen: false,
          },
          approvalState: {
            annotation: '',
          },
          selectedRow: {},
          bulkActions: {
            selectedAthleteIds: [],
            originalSelectedLabelIds: [],
            selectedLabelIds: [],
          },
        },
        'LeagueOperations.services': {},
      })
    );

    expect(screen.getByText('Expire Registration')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Click confirm to expire the KLS Next registration for Marcus Moore'
      )
    ).toBeInTheDocument();
  });
});
