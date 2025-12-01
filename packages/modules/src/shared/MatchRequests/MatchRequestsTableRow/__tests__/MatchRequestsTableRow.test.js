import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as matchRequestData } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestsHandler';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import MatchRequestsTableRow from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('MatchRequestsTableRow', () => {
  const mockMatchRequest = matchRequestData[0];

  const defaultProps = {
    userEventRequest: mockMatchRequest,
    isLastRow: false,
    rowApiRequestStatus: 'SUCCESS',
    updateUserEventRequests: jest.fn(),
    onRejectRequest: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (props = defaultProps) =>
    render(<MatchRequestsTableRow {...props} />);

  describe('default render', () => {
    it('renders out the appropriate match request row data cells', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: { ...mockMatchRequest, attachment: null },
      });
      expect(screen.getByText('Ted Burger-admin-eu')).toBeInTheDocument();
      expect(screen.getByText('Manchester United')).toBeInTheDocument();
      expect(screen.getByText('Jun 23, 2024')).toBeInTheDocument();
      expect(screen.getByText('10:06 AM')).toBeInTheDocument();
      expect(screen.getByText('Approve')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    it('allows the user to click the approve button to approve the request', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Approve'));
      expect(defaultProps.updateUserEventRequests).toHaveBeenCalledWith({
        actionType: 'approved',
        requestId: 1,
      });
    });

    it('allows the user to click the reject button to deny the request', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getByText('Reject'));
      expect(defaultProps.onRejectRequest).toHaveBeenCalledWith(1);
    });
  });

  describe('uploaded welcome pack file render', () => {
    it('allows them to remove a welcome pack file/attachment that has been uploaded', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        userEventRequest: {
          ...mockMatchRequest,
          attachment: { filename: 'test filename here' },
        },
      });
      expect(screen.getByText('test filename here')).toBeInTheDocument();
      await user.click(screen.getAllByRole('button')[2]);
      expect(defaultProps.updateUserEventRequests).toHaveBeenCalledWith({
        actionType: 'UPLOAD',
        attachment: null,
        requestId: 1,
      });
    });
  });

  describe('Editable is false', () => {
    it('does not show the Approve or Reject buttons', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: { ...mockMatchRequest, editable: false },
      });
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.queryByText('Approve')).not.toBeInTheDocument();
      expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    });

    it('does display the approve status', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: {
          ...mockMatchRequest,
          editable: false,
          status: 'approved',
        },
      });
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    it('does display the rejected status', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: {
          ...mockMatchRequest,
          editable: false,
          status: 'denied',
        },
      });
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

    it('does display the downloadable attachment when the request has been approved', () => {
      renderComponent({
        ...defaultProps,
        userEventRequest: {
          ...mockMatchRequest,
          editable: false,
          status: 'approved',
          attachment: { filename: 'test filename here', url: 'testurl.com' },
        },
      });
      expect(screen.getByText('test filename here')).toBeInTheDocument();
      expect(screen.getByTestId('download-file-button')).toBeInTheDocument();
    });
  });
});
