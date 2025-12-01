import { screen, act, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { server, rest } from '@kitman/services/src/mocks/server';

import ManageSquadsGrid from '..';

describe('<ManageSquadsGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[SUCCESS] renders the correct content', async () => {
      act(() => {
        renderWithProviders(<ManageSquadsGrid {...props} />);
      });

      expect(screen.getByText(/Manage Teams/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'New Team' })
      ).toBeInTheDocument();
    });

    it('[ERROR] renders the failure state when requestStatus is ERROR', async () => {
      server.use(
        rest.get('/settings/squads', (req, res, ctx) => res(ctx.status(500)))
      );
      act(() => {
        renderWithProviders(<ManageSquadsGrid {...props} />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });
  });

  describe('opening the side panel', () => {
    it('opens the side panel', async () => {
      act(() => {
        renderWithProviders(<ManageSquadsGrid {...props} />);
      });

      await userEvent.click(screen.getByRole('button', { name: 'New Team' }));

      expect(screen.getByTestId('sliding-panel|title')).toHaveTextContent(
        /New Team/i
      );
    });
  });
});
