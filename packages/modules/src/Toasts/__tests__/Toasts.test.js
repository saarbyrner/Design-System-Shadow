import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { add, reset } from '@kitman/modules/src/Toasts/toastsSlice';
import Toasts from '..';

describe('<Toasts/>', () => {
  it('renders a list of toasts', () => {
    renderWithProviders(<Toasts />, {
      preloadedState: {
        toastsSlice: {
          value: [
            {
              id: '1',
              status: 'SUCCESS',
              title: 'Success toast 1',
            },
            {
              id: '2',
              status: 'SUCCESS',
              title: 'Success toast 2',
            },
          ],
        },
      },
    });

    expect(screen.getByText('Success toast 1')).toBeInTheDocument();
    expect(screen.getByText('Success toast 2')).toBeInTheDocument();
  });

  it('removes the toasts when clicking the delete button', async () => {
    const { container } = renderWithProviders(<Toasts />, {
      preloadedState: {
        toastsSlice: {
          value: [
            {
              id: '1',
              status: 'SUCCESS',
              title: 'Success toast 1',
            },
            {
              id: '2',
              status: 'SUCCESS',
              title: 'Success toast 2',
            },
          ],
        },
      },
    });

    expect(screen.getByText('Success toast 1')).toBeInTheDocument();
    expect(screen.getByText('Success toast 2')).toBeInTheDocument();

    await userEvent.click(container.getElementsByClassName('icon-close')[0]);

    expect(screen.queryByText('Success toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Success toast 2')).toBeInTheDocument();
  });

  it('adds a toast when dispatching {add}', () => {
    const { store } = renderWithProviders(<Toasts />, {
      preloadedState: {
        toastsSlice: {
          value: [
            {
              id: '1',
              status: 'SUCCESS',
              title: 'Success toast 1',
            },
          ],
        },
      },
    });

    expect(screen.getByText('Success toast 1')).toBeInTheDocument();
    expect(screen.queryByText('Success toast 2')).not.toBeInTheDocument();

    store.dispatch(
      add({
        status: 'SUCCESS',
        title: 'Success toast 2',
      })
    );

    expect(screen.queryByText('Success toast 1')).toBeInTheDocument();
    expect(screen.getByText('Success toast 2')).toBeInTheDocument();
  });

  it('resets toasts when dispatching {reset}', () => {
    const { store } = renderWithProviders(<Toasts />, {
      preloadedState: {
        toastsSlice: {
          value: [
            {
              id: '1',
              status: 'SUCCESS',
              title: 'Success toast 1',
            },
            {
              id: '2',
              status: 'SUCCESS',
              title: 'Success toast 2',
            },
          ],
        },
      },
    });

    expect(screen.getByText('Success toast 1')).toBeInTheDocument();
    expect(screen.getByText('Success toast 2')).toBeInTheDocument();

    store.dispatch(reset());

    expect(screen.queryByText('Success toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Success toast 2')).not.toBeInTheDocument();
  });
});
