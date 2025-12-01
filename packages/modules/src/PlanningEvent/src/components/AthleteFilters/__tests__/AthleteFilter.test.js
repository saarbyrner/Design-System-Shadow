import { render, screen, act, waitFor, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getPositionGroups, getSquads } from '@kitman/services';
import AthleteFilters from '../index';

jest.mock('@kitman/services', () => ({
  getPositionGroups: jest.fn(),
  getSquads: jest.fn(),
}));

const props = {
  eventType: 'session_event',
  athleteFilter: {
    athlete_name: '',
    availabilities: [],
    positions: [],
    squads: [],
    participation_levels: [],
  },
  participationLevels: [
    {
      id: 'full',
      name: 'Full',
      canonical_participation_level: 'full',
      include_in_group_calculations: true,
    },
    {
      id: 'none',
      name: 'None',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
    },
  ],
  showNoneParticipationLevels: false,
  showParticipationLevels: true,
  showPositions: true,
  onFilterChange: jest.fn(),
  canViewAvailabilities: true,
  showSquads: true,
  t: i18nextTranslateStub(),
};

const mockedPositionGroups = [
  {
    id: 1,
    name: 'Position Group 1',
    positions: [
      { id: 1, name: 'Position 1' },
      { id: 2, name: 'Position 2' },
    ],
  },
];

const mockedSquads = [{ id: 1, name: 'Squad 1' }];

describe('<AthleteFilters />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    getPositionGroups.mockReturnValue(Promise.resolve(mockedPositionGroups));
    getSquads.mockReturnValue(Promise.resolve(mockedSquads));
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('when loading the initial data', () => {
    it('renders a loader', () => {
      render(<AthleteFilters {...props} />);
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
    });
  });

  describe('when the requests are successfull', () => {
    it('renders the desktop athlete filters', async () => {
      render(<AthleteFilters {...props} />);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const desktopFilters = document.querySelector(
          '.planningEventGridTab__filters--desktop'
        );
        expect(desktopFilters).toBeInTheDocument();
        const { getByText, getByPlaceholderText } = within(desktopFilters);

        expect(getByPlaceholderText('Search athletes')).toBeInTheDocument();
        expect(getByText('Availability')).toBeInTheDocument();
        expect(getByText('Position')).toBeInTheDocument();
        expect(getByText('Participation level')).toBeInTheDocument();
        expect(getByText('Squad')).toBeInTheDocument();
      });
    });

    it('does not render the availability filter if the user does not have permission to view availabilities', async () => {
      render(<AthleteFilters {...props} canViewAvailabilities={false} />);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const desktopFilters = document.querySelector(
          '.planningEventGridTab__filters--desktop'
        );
        expect(desktopFilters).toBeInTheDocument();
        const { getByText, getByPlaceholderText, queryByText } =
          within(desktopFilters);

        expect(getByPlaceholderText('Search athletes')).toBeInTheDocument();
        expect(queryByText('Availability')).not.toBeInTheDocument();
        expect(getByText('Position')).toBeInTheDocument();
        expect(getByText('Participation level')).toBeInTheDocument();
        expect(getByText('Squad')).toBeInTheDocument();
      });
    });
  });
});
