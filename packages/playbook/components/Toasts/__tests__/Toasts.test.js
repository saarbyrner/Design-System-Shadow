import { screen, within } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import Toasts from '@kitman/playbook/components/Toasts';
import { TOAST_TYPE } from '@kitman/components/src/Toast/types';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');

const toasts = {
  success: {
    id: 1,
    status: 'SUCCESS',
    title: 'Success title',
    links: [
      {
        id: 12,
        text: 'Toast first link',
        link: 'www.mock-first-link.com',
        metadata: {
          action: 'TEST_ACTION',
        },
      },
    ],
    onClose: jest.fn(),
    onClickToastLink: jest.fn(),
  },
  info: {
    id: 2,
    status: 'INFO',
    title: 'Info title',
    onClose: jest.fn(),
  },
  warning: {
    id: 3,
    status: 'WARNING',
    title: 'Warning title',
    onClose: jest.fn(),
  },
  error: {
    id: 4,
    status: 'ERROR',
    title: 'Error title',
    onClose: jest.fn(),
  },
  loading: {
    id: 5,
    status: 'LOADING',
    title: 'Loading title',
    onClose: jest.fn(),
  },
  message: {
    id: 6,
    title: 'Message title',
    description: 'Toast message description',
    type: TOAST_TYPE.MESSAGE,
    onClose: jest.fn(),
  },
};

const defaultProps = {
  toasts: [toasts.success],
  onCloseToast: jest.fn(),
  onClickToastLink: jest.fn(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<Toasts {...props} />);

describe('<Toasts />', () => {
  beforeEach(() => {
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the success toast correctly', async () => {
    renderComponent();

    expect(screen.getByText(toasts.success.title)).toBeInTheDocument();
  });

  it('renders the info toast correctly', async () => {
    renderComponent({ toasts: [toasts.info] });

    expect(screen.getByText(toasts.info.title)).toBeInTheDocument();
  });

  it('renders the warning toast correctly', async () => {
    renderComponent({ toasts: [toasts.warning] });

    expect(screen.getByText(toasts.warning.title)).toBeInTheDocument();
  });
  it('renders the message toast correctly', async () => {
    renderComponent({ toasts: [toasts.message] });

    expect(screen.getByText(toasts.message.title)).toBeInTheDocument();
    expect(screen.getByText(toasts.message.description)).toBeInTheDocument();
  });

  it('renders the error toast correctly', async () => {
    renderComponent({ toasts: [toasts.error] });

    expect(screen.getByText(toasts.error.title)).toBeInTheDocument();
  });

  it('renders multiple toasts correctly', async () => {
    renderComponent({ toasts: [toasts.success, toasts.error] });

    expect(screen.getByText(toasts.success.title)).toBeInTheDocument();
    expect(screen.getByText(toasts.error.title)).toBeInTheDocument();
  });
  it('renders multiple type of toasts correctly', async () => {
    renderComponent({ toasts: [toasts.success, toasts.error, toasts.message] });

    expect(screen.getByText(toasts.success.title)).toBeInTheDocument();
    expect(screen.getByText(toasts.error.title)).toBeInTheDocument();
    expect(screen.getByText(toasts.message.title)).toBeInTheDocument();
  });

  it('renders toasts in the correct order', async () => {
    renderComponent({ toasts: [toasts.success, toasts.error] });

    const toastAlerts = screen.getAllByRole('alert');

    expect(toastAlerts).toHaveLength(2);

    // check that toasts are rendered in the correct order
    expect(
      within(toastAlerts[0]).getByText(toasts.error.title)
    ).toBeInTheDocument();
    expect(
      within(toastAlerts[1]).getByText(toasts.success.title)
    ).toBeInTheDocument();
  });

  it('calls the correct callback when clicking the close button of a specific toast', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(defaultProps.onCloseToast).toHaveBeenCalledTimes(1);
    expect(defaultProps.onCloseToast).toHaveBeenCalledWith(1);
  });

  it('calls the correct callback when clicking the link button of a specific toast', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByText('Toast first link'));

    expect(defaultProps.onClickToastLink).toHaveBeenCalled();
  });
});
