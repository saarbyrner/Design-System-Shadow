import { screen, waitFor } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import App from '../App';

describe('MainNavBar <App /> component', () => {
  // define matchMedia as per JEST docs
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const props = {
    currentUser: {
      firstname: 'Jon',
      lastname: 'Doe',
    },
    t: (key) => key,
  };

  describe('Loading state', () => {
    it('renders the loading message', () => {
      renderWithProviders(<App {...props} />);

      expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders the error state', async () => {
      server.use(
        rest.get('/ui/organisation/organisations/current', (req, res, ctx) =>
          res(ctx.status(500))
        ),
        rest.get('/ui/current_user', (req, res, ctx) => res(ctx.status(500)))
      );

      renderWithProviders(<App {...props} />);

      await waitFor(() => {
        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
      });
    });
  });

  it('renders mainNav with mainNavBar class', async () => {
    const { container } = renderWithProviders(<App {...props} />);

    await waitFor(() => {
      expect(container.getElementsByClassName('mainNavBar')).toHaveLength(1);
    });
  });

  describe('when ip-branding flag is on', () => {
    beforeEach(() => {
      window.featureFlags['ip-login-branding'] = true;
    });

    afterEach(() => {
      window.featureFlags['ip-login-branding'] = false;
    });

    it('renders mainNav with iP-branded class', async () => {
      const { container } = renderWithProviders(<App {...props} />);

      await waitFor(() => {
        expect(container.getElementsByClassName('ip-mainNavBar')).toHaveLength(
          1
        );
      });
    });
  });
});
