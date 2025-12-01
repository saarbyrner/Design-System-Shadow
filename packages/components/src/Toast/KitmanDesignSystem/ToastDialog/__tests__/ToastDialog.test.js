import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastDialog from '..';

describe('<ToastDialog />', () => {
  const props = {
    toasts: [
      {
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
      {
        id: 2,
        status: 'WARNING',
        title: 'Warning title',
        onClose: jest.fn(),
      },
      {
        id: 3,
        status: 'ERROR',
        title: 'Error title',
        onClose: jest.fn(),
      },
      {
        id: 4,
        status: 'INFO',
        title: 'Info title',
        onClose: jest.fn(),
      },
      {
        id: 5,
        status: 'LOADING',
        title: 'Loading title',
        onClose: jest.fn(),
      },
    ],
    onCloseToast: jest.fn(),
    onClickToastLink: jest.fn(),
  };

  it('renders the toasts correctly', async () => {
    render(<ToastDialog {...props} />);

    const toasts = screen.getAllByTestId('Toast');
    expect(toasts.length).toBe(5);

    const [successToast, warningToast, errorToast, infoToast, loadingToast] =
      toasts;

    expect(successToast).toHaveTextContent('Success title');
    expect(warningToast).toHaveTextContent('Warning title');
    expect(errorToast).toHaveTextContent('Error title');
    expect(infoToast).toHaveTextContent('Info title');
    expect(loadingToast).toHaveTextContent('Loading title');
  });

  it('calls the correct callback when clicking the close button of a specific toast', async () => {
    render(<ToastDialog {...props} />);

    // Click close button of first toast
    const [successToast] = screen.getAllByTestId('Toast');
    await userEvent.click(successToast.querySelector('button'));

    expect(props.onCloseToast).toHaveBeenCalledTimes(1);
    expect(props.onCloseToast).toHaveBeenCalledWith(1);
  });

  it('calls the correct callback when clicking the link button of a specific toast', async () => {
    render(<ToastDialog {...props} />);

    await userEvent.click(screen.getByText('Toast first link'));

    expect(props.onClickToastLink).toHaveBeenCalled();
  });
});
