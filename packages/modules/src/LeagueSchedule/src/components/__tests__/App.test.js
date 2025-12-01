import { screen, waitFor } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import App from '../App';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
describe('League Schedule App', () => {
  const renderComponent = ({
    isPreferencesSuccess = true,
    permissionsRequestStatus = 'SUCCESS',
  }) => {
    usePermissions.mockReturnValue({
      permissions: {
        settings: {
          canRunLeagueExports: false,
        },
      },
      permissionsRequestStatus,
    });

    usePreferences.mockReturnValue({
      isPreferencesSuccess,
    });
    return renderWithRedux(<App />);
  };

  it('does not render properly when preferences are not loaded', () => {
    renderComponent({ isPreferencesSuccess: false });
    expect(screen.getByTestId('LeagueScheduleApp')).toBeInTheDocument();
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
  });

  it('does not render properly when permissions are not loaded', () => {
    renderComponent({ permissionsRequestStatus: 'FAILED' });
    expect(screen.getByTestId('LeagueScheduleApp')).toBeInTheDocument();
    expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
  });

  it('renders the fixture schedule correctly', () => {
    renderComponent({});
    expect(screen.getByTestId('LeagueScheduleApp')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
  });

  it('renders a match report correctly', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/planning_hub/league-schedule/reports/123',
        href: 'http://localhost',
      },
    });

    renderComponent({});

    expect(screen.getByTestId('MatchReport')).toBeInTheDocument();
  });

  it('renders a match request correctly', async () => {
    window.location.pathname = '/planning_hub/league-schedule/requests/123';

    renderComponent({});
    await waitFor(() => {
      expect(screen.getByText('Access Requests')).toBeInTheDocument();
    });
  });
});
