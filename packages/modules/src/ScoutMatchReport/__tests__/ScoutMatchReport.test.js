import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import ScoutMatchReport from '..';

describe('<ScoutMatchReport />', () => {
  it('renders correctly', async () => {
    renderWithProviders(<ScoutMatchReport />);

    await waitFor(() => {
      expect(screen.getByTestId('ScoutMatchReportApp')).toBeInTheDocument();
    });
  });
});
