import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import getEventAthletesGrid from '../../../services/getEventAthletesGrid';
import AthletesTab from '../index';

jest.mock('../../../services/getEventAthletesGrid');

const i18nT = i18nextTranslateStub();

const defaultProps = {
  event: buildEvent(),
  statusVariables: [],
  participationLevels: [
    {
      id: 1,
      name: 'Testing',
      canonical_participation_level: 'none',
      include_in_group_calculations: true,
    },
  ],
  participationLevelReasons: [
    {
      id: 1,
      label: 'Injury',
      value: 1,
    },
    {
      id: 2,
      label: 'Rest-non-injury',
      value: 2,
    },
  ],
  toastAction: jest.fn(),
  t: i18nT,
};

const mockedColumns = [
  { row_key: 'athlete', name: 'Athlete', id: 0 },
  { row_key: 'participation_level', name: 'Participation level', id: 2 },
  {
    row_key: 'participation_level_reason',
    name: 'Participation level reason',
    id: 3,
  },
  { row_key: 'related_issue', name: 'Injury/ Illness', id: 5 },
  { row_key: 'free_note', name: 'Notes', id: 6 },
];

const mockedAthletesGrid = {
  columns: mockedColumns,
  rows: [
    {
      id: 'athlete_1',
      athlete: { fullname: 'John Doe', avatar_url: '' },
      participation_level: 1,
    },
  ],
  next_id: null,
};

const renderWithProviders = (children) =>
  render(<Provider store={setupStore({})}>{children}</Provider>);

describe('<AthletesTab />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    getEventAthletesGrid.mockResolvedValue(mockedAthletesGrid);
    window.featureFlags = {};
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders the header and grid', async () => {
    renderWithProviders(<AthletesTab {...defaultProps} />);

    // Initially shows loading
    expect(
      screen.getByRole('progressbar', { name: /Loading/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(400); // 400ms debounce
    });

    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('when the planning-participation-reason feature flag is enabled', () => {
    it('shows participation reason and notes columns', async () => {
      window.featureFlags['planning-participation-reason'] = true;

      renderWithProviders(<AthletesTab {...defaultProps} />);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Participation level reason')
      ).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.queryByText('Injury/ Illness')).not.toBeInTheDocument();
    });
  });

  describe('when the planning-participation-reason feature flag is disabled', () => {
    it('hides participation reason and notes columns when planning-participation-reason is disabled', async () => {
      window.featureFlags['planning-participation-reason'] = false;

      renderWithProviders(<AthletesTab {...defaultProps} />);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(
        screen.queryByText('Participation level reason')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Notes')).not.toBeInTheDocument();
      expect(screen.queryByText('Injury/ Illness')).not.toBeInTheDocument();
    });
  });
});
