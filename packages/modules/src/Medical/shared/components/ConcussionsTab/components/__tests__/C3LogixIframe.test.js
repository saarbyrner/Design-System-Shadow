import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  getC3LogixSingleSignOn,
  getC3LogixAthleteSingleSignOn,
} from '@kitman/services/src/services/medical';

import C3LogixIframe from '../C3LogixIframe';

jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  getC3LogixSingleSignOn: jest.fn(),
  getC3LogixAthleteSingleSignOn: jest.fn(),
}));

describe('C3LogixIframe', () => {
  const props = {
    t: i18nextTranslateStub(),
  };
  const titleRoster = 'C3Logix Roster Iframe';
  const titleAthlete = 'C3Logix Athlete Iframe';
  const MOCK_SSO_URL = 'https://portal.c3logix.com/affiliates/101/athletes/999';

  describe('[feature-flag] c3logix-concussion-iframe - iframe enabled', () => {
    let submitMock;
    let originalSubmit;
    let clearTimeoutSpy;

    beforeEach(() => {
      jest.useFakeTimers();
      window.setFlag('c3logix-concussion-iframe', true);
      clearTimeoutSpy = jest
        .spyOn(global, 'clearTimeout')
        .mockImplementation(() => {});
      server.use(
        rest.get(MOCK_SSO_URL, (req, res, ctx) => {
          return res(
            ctx.json({
              url: MOCK_SSO_URL,
              token: 'mock-token-123',
            })
          );
        })
      );

      // Mock requestSubmit using Object.defineProperty to ensure it's in place before render
      originalSubmit = HTMLFormElement.prototype.submit;
      submitMock = jest.fn();
      Object.defineProperty(HTMLFormElement.prototype, 'submit', {
        configurable: true,
        value: submitMock,
      });
    });

    afterEach(() => {
      window.setFlag('c3logix-concussion-iframe', false);
      // Restore original submit
      Object.defineProperty(HTMLFormElement.prototype, 'submit', {
        configurable: true,
        value: originalSubmit,
      });
      clearTimeoutSpy.mockRestore(); // Restore clearTimeout spy
      jest.restoreAllMocks(); // Ensure all other spies are restored
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('renders "Loading C3Logix" text and CircularProgress while fetching SSO URL', async () => {
      // Delay the resolution of the mock to ensure loading state is observed
      getC3LogixSingleSignOn.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  url: MOCK_SSO_URL,
                  token: 'mock-token-123',
                }),
              100
            )
          )
      );
      render(<C3LogixIframe {...props} />);

      // Expect the Typography loading text and CircularProgress
      expect(screen.getByText('Loading C3Logix')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument(); // CircularProgress renders a progressbar role

      // Ensure the iframe is NOT in the document yet
      expect(screen.queryByTitle(titleRoster)).not.toBeInTheDocument();

      // Wait for the API call to resolve and the loading state to clear
      await waitForElementToBeRemoved(screen.queryByText('Loading C3Logix'));
      expect(screen.queryByText('Loading C3Logix')).not.toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('renders the iframe and submits the form with correct data on successful SSO, then iframe becomes visible', async () => {
      // Mock getC3LogixSingleSignOn to resolve immediately
      getC3LogixSingleSignOn.mockResolvedValue({
        url: MOCK_SSO_URL,
        token: 'mock-token-123',
      });

      render(<C3LogixIframe {...props} />);

      // First, wait for the initial Typography "Loading C3Logix" to be removed
      await waitForElementToBeRemoved(screen.queryByText('Loading C3Logix'));
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

      // Now, the iframe should be in the document
      const iframe = await screen.findByTitle(titleRoster); // Use findByTitle to wait for the iframe to appear
      expect(iframe).toBeInTheDocument();

      // Wait for the form to be submitted
      await waitFor(() => {
        expect(submitMock).toHaveBeenCalledTimes(1);
      });

      // After form submission, the iframe should become visible.
      expect(iframe).toHaveStyle('visibility: visible');

      const form = screen.getByTitle('ssoForm');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('id', 'ssoForm');
      expect(form).toHaveAttribute('action', MOCK_SSO_URL);
      expect(form).toHaveAttribute('method', 'POST');
      expect(form).toHaveAttribute('target', 'ssoIframe');
      expect(form).toHaveStyle('visibility: hidden'); // Form should always be hidden

      const hiddenInput = await screen.findByDisplayValue('mock-token-123', {
        hidden: true,
      });
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).toHaveAttribute('name', 'token');
      expect(hiddenInput).toHaveValue('mock-token-123');

      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveStyle('visibility: visible'); // Iframe should become visible after form submission
      expect(iframe).toHaveAttribute(
        'sandbox',
        'allow-scripts allow-forms allow-popups allow-downloads'
      ); // No allow-same-origin sandbox attribute as is a security concern
      expect(
        screen.queryByText('C3Logix failed to login')
      ).not.toBeInTheDocument();
    });

    it('shows manual retry button if iframe fails to load within timeout and retries on click', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      // Mock initial SSO call to succeed
      getC3LogixSingleSignOn.mockResolvedValueOnce({
        url: MOCK_SSO_URL,
        token: 'initial-mock-token',
      });

      render(<C3LogixIframe {...props} />);

      // Wait for initial loading to clear
      await waitForElementToBeRemoved(screen.queryByText('Loading C3Logix'));
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

      // Verify initial form submission attempt
      await waitFor(() => {
        expect(submitMock).toHaveBeenCalledTimes(1);
      });

      // Advance timers to trigger the manual retry button
      await act(async () => {
        jest.advanceTimersByTime(8000);
      });

      // Expect the retry button to appear
      const retryButton = await screen.findByRole('button', {
        name: 'C3Logix login',
      });
      expect(retryButton).toBeInTheDocument();
      expect(
        screen.getByText(
          'C3Logix may have been blocked by your browser. Please try again.'
        )
      ).toBeInTheDocument();

      // Mock getC3LogixSingleSignOn for the retry call
      getC3LogixSingleSignOn.mockResolvedValueOnce({
        url: MOCK_SSO_URL,
        token: 'retry-mock-token',
      });

      // Simulate click on the retry button
      await user.click(retryButton);

      // Expect getC3LogixSingleSignOn to be called again for a fresh token
      await waitFor(() => {
        expect(getC3LogixSingleSignOn).toHaveBeenCalledTimes(2);
      });

      // Expect form to be submitted again
      await waitFor(() => {
        expect(submitMock).toHaveBeenCalledTimes(2);
      });

      // Expect the retry button to disappear
      expect(retryButton).not.toBeInTheDocument();

      // Verify the hidden input has the new token
      const hiddenInput = await screen.findByDisplayValue('retry-mock-token', {
        hidden: true,
      });
      expect(hiddenInput).toBeInTheDocument();
    });

    it('renders "C3Logix failed to login" if getC3LogixSingleSignOn fails', async () => {
      getC3LogixSingleSignOn.mockRejectedValue(new Error('SSO failed'));
      render(<C3LogixIframe {...props} />);
      expect(
        await screen.findByText('C3Logix failed to login')
      ).toBeInTheDocument();
      expect(screen.queryByTitle(titleRoster)).not.toBeInTheDocument();
    });

    it('does not render the iframe if the URL hostname is not portal.c3logix.com', async () => {
      const MOCK_INVALID_SSO_URL =
        'https://someotherdomain.com/affiliates/101/athletes/999';
      getC3LogixSingleSignOn.mockResolvedValue({
        url: MOCK_INVALID_SSO_URL,
        token: 'mock-token-123',
      });

      render(<C3LogixIframe {...props} />);
      expect(
        await screen.findByText('C3Logix failed to login')
      ).toBeInTheDocument();

      expect(screen.queryByTitle(titleRoster)).not.toBeInTheDocument();
    });

    it('calls getC3LogixAthleteSingleSignOn when athleteId is provided', async () => {
      const ATHLETE_ID = 123;
      const MOCK_ATHLETE_SSO_URL = `https://portal.c3logix.com/affiliates/101/athletes/${ATHLETE_ID}`;

      getC3LogixAthleteSingleSignOn.mockResolvedValue({
        url: MOCK_ATHLETE_SSO_URL,
        token: 'athlete-mock-token-456',
      });
      getC3LogixSingleSignOn.mockClear(); // Ensure this is not called

      render(<C3LogixIframe {...props} athleteId={ATHLETE_ID} />);

      await waitForElementToBeRemoved(screen.queryByText('Loading C3Logix'));

      expect(getC3LogixAthleteSingleSignOn).toHaveBeenCalledTimes(1);
      expect(getC3LogixAthleteSingleSignOn).toHaveBeenCalledWith(ATHLETE_ID);
      expect(getC3LogixSingleSignOn).not.toHaveBeenCalled();

      const iframe = await screen.findByTitle(titleAthlete);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveStyle('visibility: visible');

      const form = screen.getByTitle('ssoForm');
      expect(form).toHaveAttribute('action', MOCK_ATHLETE_SSO_URL);

      const hiddenInput = await screen.findByDisplayValue(
        'athlete-mock-token-456',
        {
          hidden: true,
        }
      );
      expect(hiddenInput).toBeInTheDocument();
    });
  });
});
