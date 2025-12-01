import { screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import Toast from '@kitman/playbook/components/Toasts/Toast';
import { toastRemovalDelayEnumLike } from '@kitman/components/src/Toast/enum-likes';

const defaultProps = {
  toast: {
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
  onClose: jest.fn(),
  onLinkClick: jest.fn(),
};

const renderComponent = (props = defaultProps) =>
  renderWithUserEventSetup(<Toast {...props} />);

describe('<Toast />', () => {
  it('renders the toast correctly', async () => {
    renderComponent();

    expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
  });

  it('calls the correct callback when clicking the close button of a specific toast', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledWith(1);
  });

  it('calls the correct callback when clicking the link button of a specific toast', async () => {
    const { user } = renderComponent();

    await user.click(screen.getByText('Toast first link'));

    expect(defaultProps.onLinkClick).toHaveBeenCalled();
  });

  describe('Toast removal delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('applies the DefaultRemovalDelay of 5 seconds when no toastRemovalDelay property is set', async () => {
      renderComponent();
      expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(
        toastRemovalDelayEnumLike.DefaultRemovalDelay - 1
      );
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledWith(defaultProps.toast.id);
    });

    it('applies the LongRemovalDelay of 10 seconds when LongRemovalDelay is supplied', async () => {
      renderComponent({
        ...defaultProps,
        toastRemovalDelay: 'LongRemovalDelay',
      });
      expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(toastRemovalDelayEnumLike.LongRemovalDelay - 1);
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledWith(defaultProps.toast.id);
    });

    it('allows removal delay to be set via redux dispatch and passed from parent', () => {
      renderComponent({
        ...defaultProps,
        toast: { ...defaultProps.toast, removalDelay: 'LongRemovalDelay' },
      });
      expect(screen.getByText(defaultProps.toast.title)).toBeInTheDocument();
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(toastRemovalDelayEnumLike.LongRemovalDelay - 1);
      expect(defaultProps.onClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledWith(defaultProps.toast.id);
    });
  });
});
