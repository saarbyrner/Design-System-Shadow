import { screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AthleteRosterTab from '..';
import useAthleteRoster from '../hooks/useAthleteRoster';

jest.mock(
  '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/components/Filters'
);
jest.mock('../hooks/useAthleteRoster');
jest.mock('@kitman/services/src/services/medical/getAthleteRoster');

const mockHookValue = ({
  requestStatus = 'SUCCESS',
  grid = {
    rows: [],
    columns: [],
    id: '',
    emptyTableText: '',
  },
  filteredSearchParams = {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    issues: [],
  },
} = {}) => ({
  requestStatus,
  filteredSearchParams,
  onFetchAthleteRoster: jest.fn(),
  onUpdateFilter: jest.fn(),
  grid,
  nextId: null,
  isInitialDataLoaded: false,
});

describe('<AthleteRosterTab />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = () =>
    renderWithRedux(<AthleteRosterTab {...props} />, {
      useGlobalStore: false,
      preloadedState: {
        globalApi: {},
      },
    });

  describe('[requestStatus]', () => {
    it('[SUCCESS] renders the correct content', async () => {
      useAthleteRoster.mockReturnValue(mockHookValue());

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Team/i)).toBeInTheDocument();
      });
    });

    it('[PENDING] renders the loading state when requestStatus is PENDING', async () => {
      useAthleteRoster.mockReturnValue(
        mockHookValue({ requestStatus: 'PENDING' })
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Loading .../i)).toBeInTheDocument();
      });
    });

    it('[ERROR] renders the failure state when requestStatus is ERROR', async () => {
      useAthleteRoster.mockReturnValue(
        mockHookValue({ requestStatus: 'ERROR' })
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Team/i)).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
      });
    });
  });
});
