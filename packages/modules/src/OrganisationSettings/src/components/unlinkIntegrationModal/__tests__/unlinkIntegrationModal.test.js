import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UnlinkIntegrationModal from '..';

describe('<UnlinkIntegrationModal />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      isOpen: true, // Render the modal open for testing
      onClickCloseModal: jest.fn(),
      onClickUnlink: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('does not render the modal when isOpen is false', () => {
    render(<UnlinkIntegrationModal {...baseProps} isOpen={false} />);

    // The modal should not be in the document at all when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the modal with the correct title and description', () => {
    render(<UnlinkIntegrationModal {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: 'Unlink integration?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Removing this integration will result in you no longer being able to import this integrations data. All previous data will be retained.'
      )
    ).toBeInTheDocument();
  });

  it('renders the Cancel and Unlink buttons', () => {
    render(<UnlinkIntegrationModal {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unlink' })).toBeInTheDocument();
  });

  it('calls the onClickCloseModal callback when the modal close icon is clicked', async () => {
    const user = userEvent.setup();

    render(<UnlinkIntegrationModal {...baseProps} />);
    // The legacy Modal component renders a close button with a default accessible name
    const closeIcon = screen.getAllByRole('button')[0];

    await user.click(closeIcon);

    expect(baseProps.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls the onClickCloseModal callback when the Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<UnlinkIntegrationModal {...baseProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(baseProps.onClickCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls the onClickUnlink callback when the Unlink button is clicked', async () => {
    const user = userEvent.setup();

    render(<UnlinkIntegrationModal {...baseProps} />);

    const unlinkButton = screen.getByRole('button', { name: 'Unlink' });

    await user.click(unlinkButton);

    expect(baseProps.onClickUnlink).toHaveBeenCalledTimes(1);
  });
});
