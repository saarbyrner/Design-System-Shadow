import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import App from '../App';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('<App />', () => {
  const renderComponent = () => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isOfficial: false,
      isAssociationAdmin: false,
      isRegistrationRequired: false,
      isOrgSupervised: false,
      isScout: false,
    });
    return renderWithProviders(<App />);
  };

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByTestId('ScoutMatchReportApp')).toBeInTheDocument();
  });
});
