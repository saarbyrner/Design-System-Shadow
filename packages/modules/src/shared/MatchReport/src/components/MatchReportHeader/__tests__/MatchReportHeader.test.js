import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { matchReportEventListGameView } from '@kitman/common/src/consts/gameEventConsts';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { mockPenalties } from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportTestUtils';
import MatchReportHeader from '../index';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
describe('MatchReportHeader', () => {
  const mockGameEvent = {};
  const mockGameScores = {
    orgScore: 3,
    opponentScore: 0,
  };
  const mockSetCurrentView = jest.fn();

  const componentRender = ({
    preferences = { league_match_report_penalty_shootout: false },
    currentActiveView = matchReportEventListGameView.regular,
    currentPenalties = { homePenalties: [], awayPenalties: [] },
  }) => {
    usePreferences.mockReturnValue({ preferences });

    render(
      <MatchReportHeader
        isReadOnly={false}
        event={mockGameEvent}
        gameScores={mockGameScores}
        setGameScores={jest.fn}
        currentView={currentActiveView}
        setCurrentView={mockSetCurrentView}
        penaltyActivities={currentPenalties}
        t={i18nextTranslateStub()}
      />
    );
  };

  describe('normal render', () => {
    beforeEach(() => {
      componentRender({});
    });

    it('renders out the scoreline', () => {
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('does not render the event list toggle', () => {
      expect(
        screen.queryByText('Regular / Extra Time')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Penalty Shoot-out')).not.toBeInTheDocument();
    });
  });

  describe('Penalty shootout preference Active Render', () => {
    it('does render the event list toggle', () => {
      componentRender({
        preferences: { league_match_report_penalty_shootout: true },
      });
      expect(screen.getByText('Regular / Extra Time')).toBeInTheDocument();
      expect(screen.getByText('Penalty Shoot-out')).toBeInTheDocument();
    });

    it('allows the user to select the penalty view', async () => {
      const user = userEvent.setup();
      componentRender({
        preferences: { league_match_report_penalty_shootout: true },
      });
      await user.click(screen.getByText('Penalty Shoot-out'));
      expect(mockSetCurrentView).toHaveBeenCalledWith(
        matchReportEventListGameView.penalty
      );
    });

    it('allows the user to select the regular/extra time view', async () => {
      const user = userEvent.setup();
      componentRender({
        preferences: { league_match_report_penalty_shootout: true },
        currentActiveView: matchReportEventListGameView.penalty,
      });
      await user.click(screen.getByText('Regular / Extra Time'));
      expect(mockSetCurrentView).toHaveBeenCalledWith(
        matchReportEventListGameView.regular
      );
    });

    it('displays the default penalty score', () => {
      componentRender({
        preferences: { league_match_report_penalty_shootout: true },
        currentActiveView: matchReportEventListGameView.penalty,
      });
      expect(screen.getByText('(0 - 0)')).toBeInTheDocument();
    });

    it('displays the correct penalty score with activities passed in', () => {
      componentRender({
        preferences: { league_match_report_penalty_shootout: true },
        currentActiveView: matchReportEventListGameView.penalty,
        currentPenalties: mockPenalties,
      });

      expect(screen.getByText('(3 - 2)')).toBeInTheDocument();
    });
  });
});
