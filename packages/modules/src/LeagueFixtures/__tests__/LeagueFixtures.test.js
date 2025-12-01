import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import LeagueFixtures from '..';

jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/hooks/useSquadScopedPersistentState');

describe('<LeagueFixtures />', () => {
  it('renders correctly', async () => {
    renderWithProviders(<LeagueFixtures />);

    expect(screen.getByTestId('league-fixtures')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('LeagueAndOfficials')).toBeInTheDocument();
    });
  });
});
