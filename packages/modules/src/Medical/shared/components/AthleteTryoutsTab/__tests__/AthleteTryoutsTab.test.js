import { render, screen, act, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import useTryoutAthletes from '../hooks/useTryoutAthletes';
import AthleteTryoutsTab from '..';

jest.mock('../hooks/useTryoutAthletes');
jest.mock('@kitman/services/src/services/medical/getPastAthletes');

const mockHookValue = ({
  requestStatus = 'SUCCESS',
  grid = {
    rows: [],
    columns: [],
    id: '',
    emptyTableText: '',
  },
  filteredSearchParams = { athlete_name: '' },
} = {}) => ({
  requestStatus,
  filteredSearchParams,
  onFetchTryoutAthletes: jest.fn(),
  onUpdateFilter: jest.fn(),
  grid,
});

describe('<AthleteTryoutsTab />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[SUCCESS] renders the correct content', async () => {
      useTryoutAthletes.mockReturnValue(mockHookValue());
      act(() => {
        render(<AthleteTryoutsTab {...props} />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Tryout/i)).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(/Search athletes/i)
        ).toBeInTheDocument();
      });
    });

    it('[PENDING] renders the loading state when requestStatus is PENDING', async () => {
      useTryoutAthletes.mockReturnValue(
        mockHookValue({ requestStatus: 'PENDING' })
      );

      act(() => {
        render(<AthleteTryoutsTab {...props} />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Loading .../i)).toBeInTheDocument();
      });
    });

    it('[FAILURE] renders the failure state when requestStatus is FAILURE', async () => {
      useTryoutAthletes.mockReturnValue(
        mockHookValue({ requestStatus: 'FAILURE' })
      );

      act(() => {
        render(<AthleteTryoutsTab {...props} />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Tryout/i)).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
      });
    });
  });

  describe('[requestStatus] NFL', () => {
    it('[SUCCESS] renders the correct nfl content', async () => {
      window.organisationSport = 'nfl';
      useTryoutAthletes.mockReturnValue(mockHookValue());
      act(() => {
        render(<AthleteTryoutsTab {...props} />);
      });

      await waitFor(() => {
        expect(screen.queryByText(/Tryout/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Shared Players/i)).toBeInTheDocument();
      });
    });
  });
});
