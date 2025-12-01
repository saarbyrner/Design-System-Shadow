import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import ImportActions from '..';

const props = {
  eventId: 1,
  onClickImportData: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('ImportActions', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClickImportData when clicking the import button', async () => {
    render(<ImportActions {...props} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Import Data'));

    expect(props.onClickImportData).toHaveBeenCalledTimes(1);
  });

  it('shows a confirmation message when clicking the delete button', async () => {
    render(<ImportActions {...props} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Delete All Data'));

    expect(
      screen.getByText('Delete all imported data associated with this session?')
    ).toBeInTheDocument();
  });

  it('shows an error message if the request fails', async () => {
    server.use(
      rest.delete(
        '/planning_hub/events/1/imports/clear_data',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    render(<ImportActions {...props} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Delete All Data'));
    await user.click(screen.getByRole('button', { name: 'Delete All' }));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
