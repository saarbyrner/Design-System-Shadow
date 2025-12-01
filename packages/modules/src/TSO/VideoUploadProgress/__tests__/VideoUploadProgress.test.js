import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { axe } from 'jest-axe';
import getTSOUrl from '@kitman/services/src/services/getTSOUrl';
import { data as tsoUrl } from '@kitman/services/src/mocks/handlers/getTSOUrl';
import $ from 'jquery';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import VideoUploadProgress from '..';

jest.mock('@kitman/services/src/services/getTSOUrl');
jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

describe('<VideoUploadProgress />', () => {
  // Mocking root element on document for PopupBox portal to be attached to
  beforeAll(() => {
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'root');
    document.body.appendChild(mockElement);
  });

  beforeEach(() => {
    const deferred = $.Deferred();
    getTSOUrl.mockImplementation(() => deferred.resolve(tsoUrl));
    useOrganisation.mockReturnValue({
      organisation: {
        tso_application: { base_web_url: 'https://pmastg.premierleague.com' },
      },
      organisationRequestStatus: 'SUCCESS',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  const mockUploadUpdated = (id, amountUploaded = '2000') => ({
    type: 'message-relay',
    message: {
      payload: {
        result: {
          autoFinalize: false,
          createdAt: 1683039791,
          fileName: 'Screen Recording 2023-04-24 at 3.43.40 pm.mov',
          fileSize: '171412',
          id: '1_6d38515249d44ffbc6611b15bff86ab3',
          objectType: 'KalturaUploadToken',
          partnerId: 1821821,
          status: 2,
          updatedAt: 1683039791,
          uploadUrl: 'https://ny-upload.kaltura.com',
          uploadedFileSize: amountUploaded,
          userId: '',
        },
        state: 'file_update_progress',
        tracking_id: id,
      },
      type: 'file_update',
    },
  });

  const sendMessageEvent = (payload) => {
    fireEvent(
      window,
      new MessageEvent(
        'message',
        {
          data: payload,
        },
        '*'
      )
    );
  };

  const renderComponent = (showSidePanel = true) => {
    renderWithProviders(<VideoUploadProgress {...defaultProps} />);

    if (showSidePanel) {
      sendMessageEvent({ type: 'symbiosis-side-panel-closed' });
    }
  };

  it('should pass accessibility audit', async () => {
    const { container } = renderWithProviders(
      <VideoUploadProgress {...defaultProps} />
    );

    await act(async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should not render popup component if no messages have been received', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
    });
  });

  it('should not render component if symbiosis-side-panel-opened message received', async () => {
    delete window.location;
    window.location = new URL('http://localhost/media/videos');

    renderComponent();
    sendMessageEvent(mockUploadUpdated(1));

    expect(screen.queryByTestId('PopupBox')).toBeInTheDocument();

    sendMessageEvent({ type: 'symbiosis-side-panel-opened' });

    await waitFor(() => {
      expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
    });
  });

  it('should render popup component and correct amount of children if message has been received with upload details', async () => {
    renderComponent();

    sendMessageEvent(mockUploadUpdated(1));

    // Expand PopupBox
    fireEvent.click(screen.getByTestId('PopupBox|Header'));

    await waitFor(() => {
      expect(screen.getByTestId('ProgressContainer')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('ProgressContainer').length).toBe(1);
  });

  it('should de-render popup component and show toast if all uploads have completed', async () => {
    renderComponent();

    sendMessageEvent(mockUploadUpdated(1));
    sendMessageEvent(mockUploadUpdated(1, '171412'));

    await waitFor(() => {
      expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('Toast')).toBeInTheDocument();
  });

  it('should close toast on click of button', async () => {
    renderComponent();

    sendMessageEvent(mockUploadUpdated(1));
    sendMessageEvent(mockUploadUpdated(1, '171412'));

    await waitFor(() => {
      expect(screen.getByTestId('Toast')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByTestId('Toast')).not.toBeInTheDocument();
  });

  it('should render component if user navigates to a different url while side panel is open', async () => {
    renderComponent(false);

    sendMessageEvent({ type: 'symbiosis-side-panel-opened' });

    await waitFor(() => {
      expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
    });

    delete window.location;
    window.location = new URL('http://localhost/medical/rosters');

    sendMessageEvent(mockUploadUpdated(1));

    await waitFor(() => {
      expect(screen.queryByTestId('PopupBox')).toBeInTheDocument();
    });
  });

  describe('progress', () => {
    it('should render loading spinner if update progress message has been received with 0 progress', async () => {
      renderComponent();

      sendMessageEvent(mockUploadUpdated(1, '0'));

      // Expand PopupBox
      fireEvent.click(screen.getByTestId('PopupBox|Header'));

      await waitFor(() => {
        expect(screen.getByTestId('ProgressContainer')).toBeInTheDocument();
      });

      expect(screen.getByTestId('LoadingSpinner')).toBeInTheDocument();
    });

    it('should render upload progress if message has been received', async () => {
      renderComponent();

      sendMessageEvent(mockUploadUpdated(1));
      sendMessageEvent(mockUploadUpdated(1));

      // Expand PopupBox
      fireEvent.click(screen.getByTestId('PopupBox|Header'));

      await waitFor(() => {
        expect(screen.getByTestId('ProgressContainer')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('LoadingSpinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('UploadProgress')).toBeInTheDocument();
    });
  });

  describe('onClick events', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send delete-video message event to iframe if bin icon has been clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByTitle('TSO Service worker relay')
        ).toBeInTheDocument();
      });

      const messageSpy = jest.spyOn(
        document.querySelector('iframe').contentWindow,
        'postMessage'
      );

      sendMessageEvent(mockUploadUpdated(1));

      // Expand PopupBox
      fireEvent.click(screen.getByTestId('PopupBox|Header'));
      fireEvent.click(screen.getAllByRole('button')[1]);

      await waitFor(() => {
        expect(messageSpy).toHaveBeenNthCalledWith(
          1,
          { type: 'delete-video', tracking_id: 1 },
          '*'
        );
      });
    });

    it('should send redirect correctly on click of expand', async () => {
      delete window.location;
      window.location = { assign: jest.fn() };

      getTSOUrl.mockResolvedValue(tsoUrl);

      renderComponent();

      sendMessageEvent(mockUploadUpdated(1));

      // Expand PopupBox
      fireEvent.click(screen.getByTestId('PopupBox|Header'));
      fireEvent.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(
          '/media/videos?state=open-side-panel'
        );
      });
    });

    it('should send redirect correctly on click of title', async () => {
      delete window.location;
      window.location = { assign: jest.fn() };

      getTSOUrl.mockResolvedValue(tsoUrl);

      renderComponent();

      await waitFor(() => {
        expect(getTSOUrl).toHaveBeenCalled();
      });

      sendMessageEvent(mockUploadUpdated(1));

      // Expand PopupBox
      fireEvent.click(screen.getByTestId('PopupBox|Header'));
      fireEvent.click(screen.getAllByRole('button')[2]);

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(
          '/media/videos?state=open-side-panel'
        );
      });
    });
  });

  describe('title wording', () => {
    describe('PopupBox title', () => {
      it('should include "videos" in title if files uploading is > 1', async () => {
        renderComponent();

        sendMessageEvent(mockUploadUpdated(1));
        sendMessageEvent(mockUploadUpdated(2));

        await waitFor(() => {
          expect(screen.getByText('Uploading 2 videos...')).toBeInTheDocument();
        });
      });

      it('should include "video" in title if files uploading is <= 1', async () => {
        renderComponent();

        sendMessageEvent(mockUploadUpdated(1));

        await waitFor(() => {
          expect(screen.getByText('Uploading 1 video...')).toBeInTheDocument();
        });
      });
    });

    describe('Toasts', () => {
      it('should render video title in toast once completed', async () => {
        renderComponent();

        sendMessageEvent(mockUploadUpdated(1));
        sendMessageEvent(mockUploadUpdated(1, '171412'));

        await waitFor(() => {
          expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('Toast')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Screen Recording 2023-04-24 at 3.43.40 pm.mov Uploaded Successfully'
          )
        ).toBeInTheDocument();
      });

      it('should render a toast per successful upload', async () => {
        renderComponent();

        sendMessageEvent(mockUploadUpdated(1));
        sendMessageEvent(mockUploadUpdated(2));
        sendMessageEvent(mockUploadUpdated(1, '171412'));
        sendMessageEvent(mockUploadUpdated(2, '171412'));

        await waitFor(() => {
          expect(screen.queryByTestId('PopupBox')).not.toBeInTheDocument();
        });

        expect(screen.getAllByTestId('Toast').length).toEqual(2);
      });
    });
  });

  describe('AppStatus', () => {
    it('should not render app status error if call to getTSOUrl fails', async () => {
      getTSOUrl.mockRejectedValue('whoops');
      renderComponent();

      await waitFor(() => {
        expect(
          screen.queryByText('Something went wrong!')
        ).not.toBeInTheDocument();
      });
    });
  });
});
