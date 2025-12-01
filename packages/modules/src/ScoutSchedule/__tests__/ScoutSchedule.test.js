import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import ScoutSchedule from '..';

describe('<ScoutSchedule />', () => {
  it('renders correctly', async () => {
    renderWithProviders(<ScoutSchedule />);

    await waitFor(() => {
      expect(screen.getByTestId('ScoutScheduleApp')).toBeInTheDocument();
    });
  });
});
