import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { useGetAthleteIssuesQuery } from '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi';
import AthleteList from '../AthleteList';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock(
  '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi'
);

const mockAthlete = {
  id: 1,
  fullname: 'John Doe',
  firstname: 'John',
  lastname: 'Doe',
  nfl_player_id: 123,
  date_of_birth: '1990-01-01',
};

const mockIssues = {
  issues: [
    {
      id: 101,
      issue_type: 'INJURY',
      issue_occurrence_title: 'Knee Injury',
      full_pathology: 'Knee Injury',
    },
    {
      id: 102,
      issue_type: 'ILLNESS',
      issue_occurrence_title: 'Flu',
      full_pathology: 'Flu',
    },
  ],
};

describe('<AthleteList />', () => {
  let trackEventMock;

  beforeEach(() => {
    trackEventMock = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    useGetAthleteIssuesQuery.mockReturnValue({
      data: mockIssues,
      isError: false,
      isFetching: false,
    });
    window.setFlag('player-selector-side-nav', true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the athlete name', () => {
    render(<AthleteList athlete={mockAthlete} trackAthleteClicks={false} />);
    expect(screen.getByText('Doe, John')).toBeInTheDocument();
  });

  describe('event tracking', () => {
    it('does not track event when trackAthleteClicks is false', async () => {
      const user = userEvent.setup();
      render(<AthleteList athlete={mockAthlete} trackAthleteClicks={false} />);

      const athleteLink = screen.getByText('Doe, John');
      await user.click(athleteLink);

      expect(trackEventMock).not.toHaveBeenCalled();
    });

    it('tracks player selection event when an athlete is clicked', async () => {
      const user = userEvent.setup();
      render(<AthleteList athlete={mockAthlete} trackAthleteClicks />);

      const athleteLink = screen.getByText('Doe, John');
      await user.click(athleteLink);

      expect(trackEventMock).toHaveBeenCalledWith(
        performanceMedicineEventNames.playerListPlayerSelected
      );
    });

    it('tracks issue selection event when an issue is clicked', async () => {
      const user = userEvent.setup();
      render(<AthleteList athlete={mockAthlete} trackAthleteClicks />);

      // Expand the accordion to show issues
      const accordionButton = await screen.findByRole('button', {
        name: /Doe, John/,
      });
      await user.click(accordionButton);

      await screen.findByText('Knee Injury');

      const issueLink = screen.getByText('Knee Injury');
      await user.click(issueLink);

      expect(trackEventMock).toHaveBeenCalledWith(
        performanceMedicineEventNames.playerListIssueSelected
      );
    });
  });
});
