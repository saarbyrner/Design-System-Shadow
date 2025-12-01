import { screen, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { axios } from '@kitman/common/src/utils/services';
import { data as gameEvent } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { data as userEventRequestsData } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestsHandler';
import { rest, server } from '@kitman/services/src/mocks/server';
import MatchRequests from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

describe('MatchRequests', () => {
  const defaultProps = {
    eventId: 5,
    toastDispatch: jest.fn(),
    t: i18nextTranslateStub(),
  };

  let useDispatchSpy;
  let mockDispatch;

  const renderComponent = (props = defaultProps) => {
    useLeagueOperations.mockReturnValue({
      organisationId: 5,
    });
    renderWithRedux(<MatchRequests {...props} />);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    window.setFlag('league-ops-matchday-lineup-refactor', true);
    server.use(
      rest.get('/planning_hub/events/:event_id', (req, res, ctx) =>
        res(
          ctx.json({
            event: {
              ...gameEvent.event,
              squad: { ...gameEvent.event.squad, owner_id: 5 },
            },
          })
        )
      )
    );
  });

  describe('default render', () => {
    it('renders the header description of the game', async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText(
            'Test Squad name Wee woo name v Opponent Org Test Name'
          )
        ).toBeInTheDocument();
      });
      expect(
        screen.getByText('December 19, 2023 5:58 PM - 06:58 PM')
      ).toBeInTheDocument();
    });

    it('renders the request table headers', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Access Requests')).toBeInTheDocument();
      });
      expect(screen.getByText('Scout')).toBeInTheDocument();
      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getByText('Request date')).toBeInTheDocument();
      expect(screen.getByText('Request time')).toBeInTheDocument();
      expect(screen.getByText('Access requests')).toBeInTheDocument();
      expect(screen.getByText('Scout attachment')).toBeInTheDocument();
    });

    it('allows the user to complete a approve request action', async () => {
      const user = userEvent.setup();
      const axiosPatchSpy = jest.spyOn(axios, 'patch');
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Approve')).toBeInTheDocument();
      });
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], status: 'approved' }]))
        )
      );

      await user.click(screen.getByText('Approve'));
      expect(axiosPatchSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1',
        { reason: undefined, status: 'approved' }
      );

      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Ted Burger request has been approved.',
        },
        type: 'UPDATE_TOAST',
      });
    });

    it('allows the user to complete a reject request action', async () => {
      const user = userEvent.setup();
      const axiosPatchSpy = jest.spyOn(axios, 'patch');
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Reject')).toBeInTheDocument();
      });
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], status: 'denied' }]))
        )
      );
      await user.click(screen.getByText('Reject'));
      expect(screen.getByText('Reject Access')).toBeInTheDocument();
      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Conflict of interest'));
      await user.click(screen.getByText('Save'));
      expect(screen.getByText('Rejected')).toBeInTheDocument();
      expect(axiosPatchSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1',
        { reason: undefined, status: 'denied', rejection_reason_id: 2 }
      );
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Ted Burger request has been rejected.',
        },
        type: 'UPDATE_TOAST',
      });
    });

    it('allows the user to remove a uploaded file', async () => {
      const user = userEvent.setup();
      const axiosPatchSpy = jest.spyOn(axios, 'patch');
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('testFilename.pdf')).toBeInTheDocument();
      });

      await user.click(screen.getAllByRole('button')[2]);
      expect(axiosPatchSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1',
        { attachment: null, reason: undefined, status: undefined }
      );
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'SUCCESS',
          title: 'Document has been removed.',
        },
        type: 'UPDATE_TOAST',
      });
    });

    it('allows the user to withdraw a request if the request belongs to their org', async () => {
      const axiosDeleteSpy = jest.spyOn(axios, 'delete');
      const user = userEvent.setup();
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], editable: false }]))
        )
      );
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Ted Burger-admin-eu')).toBeInTheDocument();
      });
      expect(screen.getByText('Pending')).toBeInTheDocument();

      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Withdraw request'));

      expect(screen.getByText('Withdraw request?')).toBeInTheDocument();
      await user.click(screen.getByText('Submit'));
      expect(axiosDeleteSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1'
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          status: 'SUCCESS',
          title: 'Ted Burger-admin-eu access has been withdrawn.',
        },
        type: 'toasts/add',
      });
    });

    it('toolbar appears if checkbox clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Approve')).toBeInTheDocument();
      });

      await user.click(screen.getAllByRole('checkbox')[0]);

      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(screen.getByText('Approve request')).toBeInTheDocument();
      expect(screen.getByText('Reject request')).toBeInTheDocument();
    });

    it('the bulk action checkbox does not appear if there are no editable user requests', async () => {
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], editable: false }]))
        )
      );
      renderComponent();
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('Failed Render', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('whoops'));
      renderComponent();
    });

    it('displays a failed error message', () => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  describe('Failed Status Action', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'patch').mockImplementation(() => Promise.reject());
    });
    it('fails the action request and returns a toast if the api errors out', async () => {
      const user = userEvent.setup();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Approve')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Approve'));
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'ERROR',
          title: 'Scout access action failed',
        },
        type: 'UPDATE_TOAST',
      });
    });
  });

  describe('Failed Welcome pack upload action', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'patch').mockImplementation(() => Promise.reject());
    });

    it('fails the upload request and returns a toast if the api errors out', async () => {
      const user = userEvent.setup();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('testFilename.pdf')).toBeInTheDocument();
      });

      await user.click(screen.getAllByRole('button')[2]);
      expect(defaultProps.toastDispatch).toHaveBeenCalledWith({
        toast: {
          id: 1,
          status: 'ERROR',
          title: 'Failed to remove document.',
        },
        type: 'UPDATE_TOAST',
      });
    });
  });

  describe('[Feature Flag] league-ops-change-scout-request is enabled', () => {
    beforeEach(() => {
      window.setFlag('league-ops-change-scout-request', true);
    });

    it('should allow approved statuses to be rejected', async () => {
      const user = userEvent.setup();
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], status: 'approved' }]))
        )
      );
      const axiosPatchSpy = jest.spyOn(axios, 'patch');
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Approved')).toBeInTheDocument();
      });
      const selectAllRowsInput = screen.getByLabelText('Select all rows');
      await user.click(selectAllRowsInput);
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Approve request' })
      ).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Reject request' })
      ).toBeEnabled();

      await user.click(screen.getByRole('button', { name: 'Reject request' }));
      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Conflict of interest'));
      await user.click(screen.getByText('Save'));
      expect(axiosPatchSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1',
        { reason: undefined, status: 'denied', rejection_reason_id: 2 }
      );
    });

    it('should allow rejected statuses to be approved', async () => {
      const user = userEvent.setup();
      server.use(
        rest.get(
          '/planning_hub/user_event_requests?event_id=:eventId',
          (req, res, ctx) =>
            res(ctx.json([{ ...userEventRequestsData[0], status: 'denied' }]))
        )
      );
      const axiosPatchSpy = jest.spyOn(axios, 'patch');
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Rejected')).toBeInTheDocument();
      });
      const selectAllRowsInput = screen.getByLabelText('Select all rows');
      await user.click(selectAllRowsInput);
      expect(screen.getByText('1 selected')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Approve request' })
      ).toBeEnabled();
      expect(
        screen.getByRole('button', { name: 'Reject request' })
      ).toBeDisabled();

      await user.click(screen.getByRole('button', { name: 'Approve request' }));

      expect(axiosPatchSpy).toHaveBeenCalledWith(
        '/planning_hub/user_event_requests/1',
        { reason: undefined, status: 'approved' }
      );
    });
  });
});
