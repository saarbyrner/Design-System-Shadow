import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import { rest, server } from '@kitman/services/src/mocks/server';

import ScoutAccessRequestButton from '../index';

describe('ScoutAccessRequestButton', () => {
  const defaultProps = {
    eventId: 1,
    userEventRequests: [],
    userEventRequest: null,
    setUserEventRequests: jest.fn(),
    requestButtonViewable: true,
    t: i18nextTranslateStub(),
  };

  const getMockUserEventRequest = (status) => ({ id: 1, status });

  const renderComponent = (props = defaultProps) =>
    renderWithRedux(<ScoutAccessRequestButton {...props} />);

  describe('renders', () => {
    it('renders no button or request chip', () => {
      const { container } = renderComponent({
        ...defaultProps,
        requestButtonViewable: false,
      });
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the request status button', () => {
      renderComponent();
      expect(screen.getByText('Request access')).toBeInTheDocument();
    });

    it('renders the expired chip', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: getMockUserEventRequest(
          userEventRequestStatuses.expired
        ),
      });
      expect(screen.getByText('Expired')).toBeInTheDocument();
    });

    it('renders the denied chip', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: getMockUserEventRequest(
          userEventRequestStatuses.denied
        ),
      });
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

    it('renders the Approved chip', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: getMockUserEventRequest(
          userEventRequestStatuses.approved
        ),
      });
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    it('renders the pending status chip', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: getMockUserEventRequest(
          userEventRequestStatuses.pending
        ),
      });
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('button actions', () => {
    it('allows the user to send off a request for the request access button', async () => {
      server.use(
        rest.post('/planning_hub/user_event_requests', (req, res, ctx) =>
          res(ctx.json({ id: 1, status: userEventRequestStatuses.pending }))
        )
      );
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Request access'));
      expect(defaultProps.setUserEventRequests).toHaveBeenCalledWith([
        { id: 1, status: userEventRequestStatuses.pending },
      ]);
    });
  });
});
