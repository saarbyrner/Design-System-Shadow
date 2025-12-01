import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import getTSOUrl from '@kitman/services/src/services/getTSOUrl';
import { data as tsoUrl } from '@kitman/services/src/mocks/handlers/getTSOUrl';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import TSOApp from '..';

jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock('@kitman/services/src/services/getTSOUrl');
jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

describe('TSOApp', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    const mockIntercomElement = document.createElement('div');
    mockIntercomElement.setAttribute('class', 'intercom-lightweight-app');
    mockIntercomElement.setAttribute('data-testid', 'intercom');
    document.body.appendChild(mockIntercomElement);
  });

  beforeEach(() => {
    useOrganisation.mockReturnValue({
      organisation: {
        tso_application: { base_web_url: 'https://pmastg.premierleague.com' },
      },
      organisationRequestStatus: 'SUCCESS',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    title: 'Iframe title',
    src: 'this/is/a/src',
    t: i18nextTranslateStub(),
  };

  it('should render AppStatus error if requestStatus is FAILURE', async () => {
    getTSOUrl.mockRejectedValue('whoops');
    renderWithProviders(<TSOApp {...defaultProps} />);

    await waitFor(() => {
      expect(useOrganisation).toHaveBeenCalled();
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    expect(screen.queryByTitle('Iframe title')).not.toBeInTheDocument();
  });

  it('should render Iframe as expected with display none', async () => {
    getTSOUrl.mockResolvedValue(tsoUrl);

    renderWithProviders(<TSOApp {...defaultProps} />);

    await waitFor(() => {
      expect(getTSOUrl).toHaveBeenCalled();
    });

    expect(screen.getByTitle('Iframe title')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTitle('Iframe title')).toHaveStyle({
      display: 'none',
    });
  });

  it('should render Iframe with display as initial if message has been received', async () => {
    getTSOUrl.mockResolvedValue(tsoUrl);

    renderWithProviders(<TSOApp {...defaultProps} />);

    await waitFor(() => {
      expect(getTSOUrl).toHaveBeenCalled();
    });

    // Load Iframe
    fireEvent.load(screen.getByTitle('Iframe title'));

    // Send message
    fireEvent(
      window,
      new MessageEvent(
        'message',
        {
          data: { type: 'symbiosis-page-ready' },
        },
        '*'
      )
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByTitle('Iframe title')).toHaveStyle({
        display: 'initial',
      });
    });
  });

  it('should visually hide/un-hide intercom element when messages have been received', async () => {
    getTSOUrl.mockResolvedValue(tsoUrl);

    renderWithProviders(<TSOApp {...defaultProps} />);

    await waitFor(() => {
      expect(getTSOUrl).toHaveBeenCalled();
    });

    // Load Iframe
    fireEvent.load(screen.getByTitle('Iframe title'));

    // Check intercom is visually visible
    expect(screen.getByTestId('intercom')).toHaveStyle('display: initial');

    // Send message
    fireEvent(
      window,
      new MessageEvent(
        'message',
        {
          data: { type: 'symbiosis-side-panel-opened' },
        },
        '*'
      )
    );

    // Check intercom is visually hidden
    await waitFor(() => {
      expect(screen.getByTestId('intercom')).toHaveStyle('display: none');
    });

    // Send message
    fireEvent(
      window,
      new MessageEvent(
        'message',
        {
          data: { type: 'symbiosis-side-panel-closed' },
        },
        '*'
      )
    );

    // Check intercom is visually visible
    await waitFor(() => {
      expect(screen.getByTestId('intercom')).toHaveStyle('display: initial');
    });
  });

  describe('timeout', () => {
    it('should render error app status if iframe has loaded but no message received before timer expires', async () => {
      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(<TSOApp {...defaultProps} />);

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      // Load Iframe
      fireEvent.load(screen.getByTitle('Iframe title'));

      act(() => jest.runAllTimers());

      await waitFor(() => {
        expect(screen.queryByText('Something went wrong!')).toBeInTheDocument();
      });
    });

    it('should not render error app status if message received', async () => {
      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(<TSOApp {...defaultProps} />);

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      // Load Iframe
      fireEvent.load(screen.getByTitle('Iframe title'));

      // Send message
      fireEvent(
        window,
        new MessageEvent(
          'message',
          {
            data: { type: 'symbiosis-page-ready' },
          },
          '*'
        )
      );

      act(() => jest.runAllTimers());

      await waitFor(() => {
        expect(
          screen.queryByText('Something went wrong!')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('create event side panel', () => {
    it('should not render side panel if permissions are false', async () => {
      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(<TSOApp {...defaultProps} />);

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      // Load Iframe
      fireEvent.load(screen.getByTitle('Iframe title'));

      expect(screen.queryByTestId('sliding-panel')).not.toBeInTheDocument();
    });

    it('should hide side panel if message is not received', async () => {
      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(<TSOApp {...defaultProps} canCreateEvent />);

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      // Load Iframe
      fireEvent.load(screen.getByTitle('Iframe title'));

      expect(screen.getByTestId('sliding-panel')).toHaveStyle(
        'visibility: hidden'
      );
    });

    it('should open side panel if message is received', async () => {
      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(<TSOApp {...defaultProps} canCreateEvent />);

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      // Load Iframe
      fireEvent.load(screen.getByTitle('Iframe title'));

      // Send message
      fireEvent(
        window,
        new MessageEvent(
          'message',
          {
            data: { type: 'symbiosis-create-event' },
          },
          '*'
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId('sliding-panel')).toHaveStyle(
          'visibility: visible'
        );
      });
    });
  });

  describe('event management redirection logic', () => {
    it('should set iframe src with event if FF is enabled and eventId query param exists', async () => {
      window.featureFlags['tso-event-management'] = true;

      useLocationSearch.mockReturnValue(new URLSearchParams({ eventId: '23' }));

      getTSOUrl.mockResolvedValue(tsoUrl);

      renderWithProviders(
        <TSOApp t={i18nextTranslateStub()} src="test/src/without/param" />
      );

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTitle('Iframe component').src).toContain(
          '&EventID=23'
        );
      });
    });
  });
});
