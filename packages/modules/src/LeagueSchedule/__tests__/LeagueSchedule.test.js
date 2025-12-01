import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import LeagueSchedule from '..';

describe('<LeagueSchedule />', () => {
  it('renders correctly', async () => {
    renderWithProviders(<LeagueSchedule />);

    await waitFor(() => {
      expect(screen.getByTestId('LeagueScheduleApp')).toBeInTheDocument();
    });
  });
});
