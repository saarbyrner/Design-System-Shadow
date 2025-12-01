import { screen, render } from '@testing-library/react';
import {
  defaultProps,
  mockPenalties,
} from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportTestUtils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import MatchReportScorelineSubHeader from '../index';

// Mock the hooks
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('MatchReportScorelineSubHeader', () => {
  const mockPreferences = {
    league_match_report_penalty_shootout: false,
  };

  const scorelineSubHeaderProps = {
    ...defaultProps,
    penaltyActivities: { homePenalties: [], awayPenalties: [] },
  };

  const renderComponent = ({
    props = scorelineSubHeaderProps,
    preferences = mockPreferences,
  }) => {
    usePreferences.mockReturnValue({ preferences });
    render(<MatchReportScorelineSubHeader {...props} />);
  };

  describe('default render', () => {
    it('renders the scoreline sub header correctly', () => {
      renderComponent({});
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });
  });

  describe('Preference: league_match_report_penalty_shootout enabled', () => {
    it('renders out the current penalty dots to represent the penalty shootout activities', () => {
      renderComponent({
        preferences: { league_match_report_penalty_shootout: true },
      });

      expect(screen.getByText('(0 - 0)')).toBeInTheDocument();
    });

    it('renders out the filled in penalty dots to represent the updated penalty shootout activities', () => {
      renderComponent({
        props: { ...scorelineSubHeaderProps, penaltyActivities: mockPenalties },
        preferences: { league_match_report_penalty_shootout: true },
      });

      expect(screen.getByText('(3 - 2)')).toBeInTheDocument();
    });
  });
});
