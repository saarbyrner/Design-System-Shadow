import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  mockPermissions,
  defaultStore,
} from '@kitman/modules/src/shared/MatchReport/src/utils/matchReportTestUtils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import userEvent from '@testing-library/user-event';
import { MATCH_REPORT_TABS } from '@kitman/modules/src/shared/MatchReport/src/consts/matchReportConsts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import TabMatchReportEvents from '../index';

// Mock the hooks
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('TabMatchReportEvents', () => {
  const mockLeagueOperationsDefault = {
    isScout: false,
  };

  const mockPreferences = {};

  const defaultTabProps = {
    tabTitle: MATCH_REPORT_TABS.PLAYERS,
    t: i18nextTranslateStub(),
  };

  const renderComponent = ({
    props = defaultTabProps,
    leagueOpsProps = mockLeagueOperationsDefault,
    permissions = mockPermissions,
    preferences = mockPreferences,
    store = defaultStore,
  }) => {
    useLeagueOperations.mockReturnValue(leagueOpsProps);
    usePermissions.mockReturnValue({
      permissions,
    });
    usePreferences.mockReturnValue({ preferences });
    renderWithRedux(<TabMatchReportEvents {...props} />, {
      preloadedState: store,
    });
  };

  describe('Default Match Report Events Tab Rendering', () => {
    it('correctly renders the players tab with team toggle buttons', () => {
      renderComponent({});

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
    });

    it('correctly renders the staff tab with team toggle buttons', () => {
      renderComponent({
        props: { ...defaultTabProps, tabTitle: MATCH_REPORT_TABS.STAFF },
      });

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Away')).toBeInTheDocument();
    });

    it('renders the players data grid component', () => {
      renderComponent({});

      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Jersey')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Designation')).toBeInTheDocument();
    });

    it('renders the staff data grid component', () => {
      renderComponent({
        props: { ...defaultTabProps, tabTitle: MATCH_REPORT_TABS.STAFF },
      });

      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });
  });

  describe('Team Toggle Functionality', () => {
    it('allows switching between Home and Away teams', async () => {
      const user = userEvent.setup();
      renderComponent({});

      const homeButton = screen.getByText('Home');
      const awayButton = screen.getByText('Away');

      // Home should be selected by default
      expect(homeButton).toHaveAttribute('aria-pressed', 'true');
      expect(awayButton).toHaveAttribute('aria-pressed', 'false');

      // Click Away button
      await user.click(awayButton);

      expect(homeButton).toHaveAttribute('aria-pressed', 'false');
      expect(awayButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('maintains team selection when clicked on same button', async () => {
      const user = userEvent.setup();
      renderComponent({});

      const homeButton = screen.getByText('Home');

      // Home should be selected by default
      expect(homeButton).toHaveAttribute('aria-pressed', 'true');

      // Click Home button again - should remain selected
      await user.click(homeButton);

      expect(homeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('League Scout user render', () => {
    it('renders the appropriate datagrid columns when it is a scout user', () => {
      renderComponent({ leagueOpsProps: { isScout: true } });

      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Jersey')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();

      expect(screen.queryByText('Designation')).not.toBeInTheDocument();

      expect(screen.getByText('Grad year')).toBeInTheDocument();
      expect(screen.getByText('Age group')).toBeInTheDocument();
    });
  });
});
