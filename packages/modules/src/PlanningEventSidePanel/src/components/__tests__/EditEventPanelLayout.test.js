import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  useGetOrganisationQuery,
  useGetActiveSquadQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  renderWithProvider,
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import EditEventPanelLayout from '../EditEventPanelLayout';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => {
  return {
    useGetOrganisationQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  };
});
jest.mock('@kitman/common/src/hooks/useEventTracking');

const defaultStore = storeFake();

describe('EditEventPanelLayout', () => {
  const commonFields = {
    title: '',
    local_timezone: 'Europe/Dublin',
    start_time: '2021-07-12T10:00:16+00:00',
    duration: '20',
    event_collection_complete: false,
  };
  const gameEvent = {
    type: 'game_event',
    turnaround_prefix: '',
    turnaround_fixture: true,
    ...commonFields,
  };

  const sessionEvent = {
    type: 'session_event',
    session_type_id: 1,
    workload_type: 2,
    ...commonFields,
  };

  const customEvent = {
    type: 'custom_event',
    title: '',
    event_type_id: 4,
  };

  const props = {
    event: gameEvent,
    panelMode: 'CREATE',
    onUpdateEventStartTime: jest.fn(),
    onUpdateEventDuration: jest.fn(),
    onUpdateEventDate: jest.fn(),
    onUpdateEventTimezone: jest.fn(),
    onUpdateEventTitle: jest.fn(),
    onUpdateEventDetails: jest.fn(),
    onDataLoadingStatusChanged: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (componentProps = props) =>
    renderWithProvider(
      <EditEventPanelLayout {...componentProps} />,
      defaultStore
    );

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_admin: true },
    });

    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Test',
        owner_id: 1234,
      },
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {},
    });
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  describe('rendering', () => {
    it('renders a gameEvent', () => {
      renderComponent();

      expect(screen.getByText('Opposition')).toBeInTheDocument();
      expect(screen.getByText('Competition')).toBeInTheDocument();
    });

    it('renders a session event', () => {
      renderComponent({
        ...props,
        event: sessionEvent,
        eventValidity: { type: 'session_event' },
      });

      expect(screen.getByText('Session type')).toBeInTheDocument();
    });

    it('renders a the game details v2 game event', () => {
      window.featureFlags['game-details'] = true;
      renderComponent({
        ...props,
        eventValidity: {},
      });

      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getByText('Competition type')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Periods')).toBeInTheDocument();
      window.featureFlags['game-details'] = false;
    });

    it('renders a custom event', async () => {
      renderComponent({
        ...props,
        event: customEvent,
        eventValidity: { type: 'custom_event' },
      });

      expect(await screen.findByText('Event Type')).toBeInTheDocument();
    });

    describe('Event Collection', () => {
      it('calls the correct callbacks when click toggle Event collection complete in EDIT mode', async () => {
        window.setFlag('event-collection-complete', true);
        renderComponent({ ...props, panelMode: 'EDIT' });
        await userEvent.click(screen.getByText('Event collection complete'));
        expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
          event_collection_complete: true,
        });
        window.setFlag('event-collection-complete', false);
      });
    });

    it('renders without a type', () => {
      renderComponent({
        ...props,
        event: { ...gameEvent, type: '' },
      });

      expect(screen.queryByText('Opposition')).not.toBeInTheDocument();
      expect(screen.queryByText('Session type')).not.toBeInTheDocument();
      expect(screen.queryByText('Event Type')).not.toBeInTheDocument();
      expect(screen.queryByText('Competition')).not.toBeInTheDocument();
    });

    describe('[event-attachments] FF is on', () => {
      beforeEach(() => {
        window.featureFlags['event-attachments'] = true;
      });

      afterEach(() => {
        window.featureFlags['event-attachments'] = false;
      });

      it('renders Attach accordion in create mode', async () => {
        renderComponent();

        expect(await screen.findByText('Attach')).toBeInTheDocument();
      });

      it('renders Attach accordion in edit mode', async () => {
        renderComponent({ ...props, panelMode: 'EDIT' });

        expect(await screen.findByText('Attach')).toBeInTheDocument();
      });

      it('renders Uploads accordion in edit mode if attachments exist', async () => {
        renderComponent({
          ...props,
          panelMode: 'EDIT',
          event: {
            ...props.event,
            attachments: [
              {
                attachment: { filename: 'file name', confirmed: true },
                id: 1,
              },
            ],
          },
        });

        expect(await screen.findByText('Uploads')).toBeInTheDocument();
      });

      it('does not render Uploads accordion in edit mode if attachments exist', async () => {
        renderComponent({
          ...props,
          panelMode: 'EDIT',
          event: {
            ...props.event,
            attachments: [
              {
                attachment: { filename: 'file name', confirmed: false },
                id: 1,
              },
            ],
          },
        });

        await waitFor(async () => {
          await expect(screen.queryByTestId('Uploads')).not.toBeInTheDocument();
        });
      });

      it('renders Uploads accordion in edit mode if links exist', async () => {
        renderComponent({
          ...props,
          panelMode: 'EDIT',
          event: {
            ...props.event,
            attached_links: [{ title: 'link title', id: 1 }],
          },
        });

        expect(await screen.findByText('Uploads')).toBeInTheDocument();
      });

      it('clicking Uploads accordion shows correct attachment and link info', async () => {
        renderComponent({
          ...props,
          panelMode: 'EDIT',
          event: {
            ...props.event,
            attached_links: [
              {
                attached_link: {
                  title: 'link title',
                  confirmed: true,
                },
                event_attachment_categories: [
                  { id: 9483, name: 'Category Test' },
                  { id: 92874, name: 'Second Test' },
                ],
                id: 1,
              },
            ],
            attachments: [
              {
                attachment: {
                  filename: 'file name',
                  download_url: 'url',
                  name: 'custom name',
                  confirmed: true,
                },
                id: 1,
                event_attachment_categories: [
                  { id: 9483, name: 'My Test Category' },
                ],
              },
            ],
          },
        });

        userEvent.click(screen.getByText('Uploads'));

        await waitFor(() => {
          expect(screen.getByText('Attachments')).toBeInTheDocument();
          expect(screen.getByText(/custom name/)).toBeInTheDocument();
          expect(screen.queryByText('file name')).not.toBeInTheDocument();
          expect(screen.queryByText('url')).not.toBeInTheDocument();

          expect(screen.getByText('Links')).toBeInTheDocument();
          expect(screen.getByText('link title')).toBeInTheDocument();
          expect(screen.queryByText('test.com')).not.toBeInTheDocument();
        });

        expect(
          screen.getByText(/Category Test, Second Test/)
        ).toBeInTheDocument();
        expect(screen.getByText(/My Test Category/)).toBeInTheDocument();
      });

      it('trash bins exist', async () => {
        renderComponent({
          ...props,
          panelMode: 'EDIT',
          event: {
            ...props.event,
            attachments: [
              {
                attachment: {
                  filename: 'file name',
                  download_url: 'url',
                  name: 'custom name',
                  confirmed: true,
                },
                id: 1,
              },
              {
                attachment: {
                  filename: 'file name 2',
                  download_url: 'url 2',
                  name: 'custom name 2',
                  confirmed: true,
                },
                id: 2,
              },
            ],
          },
        });

        userEvent.click(screen.getByText('Uploads'));
        await waitFor(() => {
          expect(screen.getByText('Attachments')).toBeInTheDocument();
        });

        const binIcons = within(
          screen.getByTestId('PreviousUploads|Attachments')
        ).getAllByRole('button', { hidden: true });
        expect(binIcons.length).toEqual(2);
      });
    });
  });
});
