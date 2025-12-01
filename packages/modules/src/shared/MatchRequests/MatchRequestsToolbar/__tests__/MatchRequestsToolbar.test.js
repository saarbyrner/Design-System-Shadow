import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { userEventRequestStatuses } from '@kitman/common/src/consts/userEventRequestConsts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import MatchRequestsToolbar from '../index';

const defaultProps = {
  selectedIds: [1, 2],
  userEventRequests: [
    { id: 1, status: userEventRequestStatuses.pending },
    { id: 2, status: userEventRequestStatuses.pending },
    { id: 3, status: userEventRequestStatuses.approved },
  ],
  handleApprove: jest.fn(),
  handleReject: jest.fn(),
  isLoading: false,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = {}) => {
  const utils = render(<MatchRequestsToolbar {...defaultProps} {...props} />);
  return { ...utils };
};

describe('MatchRequestsToolbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render nothing if no selected items', () => {
    const { container } = renderComponent({ selectedIds: [] });
    expect(container).toBeEmptyDOMElement();
  });

  it('should display selected count and action buttons when events are selected', () => {
    renderComponent();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    expect(screen.getByText('Approve request')).toBeInTheDocument();
    expect(screen.getByText('Reject request')).toBeInTheDocument();
  });

  it('should disable buttons if the selected items have different statuses', () => {
    const props = {
      selectedIds: [1, 3], // ID 3 is "approved"
    };
    renderComponent(props);

    const approveBtn = screen.getByRole('button', { name: 'Approve request' });
    const rejectBtn = screen.getByRole('button', { name: 'Reject request' });

    expect(approveBtn).toBeDisabled();
    expect(rejectBtn).toBeDisabled();
  });

  it('should disable buttons when isLoading is true', () => {
    renderComponent({ isLoading: true });

    const approveBtn = screen.getByRole('button', { name: 'Approve request' });
    const rejectBtn = screen.getByRole('button', { name: 'Reject request' });

    expect(approveBtn).toBeDisabled();
    expect(rejectBtn).toBeDisabled();
  });

  it('should call handleApprove when approve button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const approveBtn = screen.getByText('Approve request');
    await user.click(approveBtn);

    expect(defaultProps.handleApprove).toHaveBeenCalledTimes(1);
  });

  it('should call handleReject when reject button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const rejectBtn = screen.getByText('Reject request');
    await user.click(rejectBtn);

    expect(defaultProps.handleReject).toHaveBeenCalledTimes(1);
  });
});
