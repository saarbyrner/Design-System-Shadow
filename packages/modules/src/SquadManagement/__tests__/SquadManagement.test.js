import {
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import SquadManagement from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<SquadManagementApp/>', () => {
  it('renders', async () => {
    renderWithProviders(<SquadManagement />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

    await waitFor(() => {
      expect(screen.getByText(/Manage teams/i)).toBeInTheDocument();
    });
  });
});
