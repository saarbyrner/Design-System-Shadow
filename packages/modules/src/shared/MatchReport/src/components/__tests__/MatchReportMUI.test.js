import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  defaultProps,
  mockPermissions,
} from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportTestUtils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import MatchReportMUI from '../MatchReportMUI';

// Mock the hooks
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('MatchReportMUI', () => {
  const mockLeagueOperationsDefault = {
    isLeague: true,
    isOfficial: false,
  };

  const mockPreferences = {
    league_match_report_penalty_shootout: true,
    league_game_forms_tab: false,
  };

  const renderComponent = ({
    props = defaultProps,
    leagueOpsProps = mockLeagueOperationsDefault,
    permissions = mockPermissions,
    preferences = mockPreferences,
  }) => {
    useLeagueOperations.mockReturnValue(leagueOpsProps);
    usePermissions.mockReturnValue({
      permissions,
    });
    usePreferences.mockReturnValue({ preferences });
    renderWithRedux(<MatchReportMUI {...props} />);
  };

  describe('Match Report default Render', () => {
    describe('Match Report Header', () => {
      const defaultHeaderRenderAssertions = () => {
        expect(
          screen.getByText('U16 KL Toronto v U17 KL Atlanta')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'Mar 1, 2025 7:15pm Europe/Dublin | Stadium Name | Match no. 12345'
          )
        ).toBeInTheDocument();
      };

      it('correctly renders the report header elements when in league admin view', () => {
        renderComponent({});
        defaultHeaderRenderAssertions();
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });

      it('correctly renders the report header elements when in officials view', () => {
        renderComponent({
          leagueOpsProps: { isLeague: false, isOfficial: true },
        });
        defaultHeaderRenderAssertions();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
      });
    });

    describe('Match Report Scoreline Header', () => {
      it('correctly renders the scoreline sub header elements and penalty info', () => {
        renderComponent({});
        expect(screen.getByDisplayValue('3')).toBeInTheDocument();
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
        expect(screen.getByText('(0 - 0)')).toBeInTheDocument();
      });
    });

    describe('Match Report Tabs render', () => {
      it('renders the appropriate tabs', () => {
        renderComponent({});
        expect(screen.getByText('Athlete events')).toBeInTheDocument();
        expect(screen.getByText('Staff events')).toBeInTheDocument();
        expect(screen.queryByText('Forms')).not.toBeInTheDocument();
      });

      it('renders the Forms tab when preference is enabled', () => {
        renderComponent({
          preferences: { ...mockPreferences, league_game_forms_tab: true },
        });
        expect(screen.getByText('Athlete events')).toBeInTheDocument();
        expect(screen.getByText('Staff events')).toBeInTheDocument();
        expect(screen.getByText('Forms')).toBeInTheDocument();
      });
    });
  });
});
