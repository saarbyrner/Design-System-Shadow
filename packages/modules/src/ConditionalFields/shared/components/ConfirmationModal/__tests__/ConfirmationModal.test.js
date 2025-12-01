import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ConfirmationModal from '..';

const onPrimaryAction = jest.fn();
const onCancel = jest.fn();

const props = {
  open: true,
  modalTitle: 'Modal Title',
  modalContent: 'Modal Content',
  primaryButtonText: 'Publish',
  onPrimaryAction,
  onCancel,
  t: i18nextTranslateStub(),
};

describe('<RulesetAppHeader/>', () => {
  it('renders correctly when open = true', () => {
    render(<ConfirmationModal {...props} />);

    expect(
      screen.getByRole('heading', {
        name: 'Modal Title',
        level: 4,
        hidden: true,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Cancel', hidden: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Publish', hidden: true })
    ).toBeInTheDocument();
  });

  it('renders correctly when open = false', () => {
    render(<ConfirmationModal {...props} open={false} />);

    expect(
      screen.queryByRole('heading', {
        name: 'Modal Title',
        level: 4,
        hidden: true,
      })
    ).not.toBeInTheDocument();

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Cancel', hidden: true })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Publish', hidden: true })
    ).not.toBeInTheDocument();
  });

  it('calls onCancel correctly', async () => {
    render(<ConfirmationModal {...props} />);

    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
      hidden: true,
    });

    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onPrimaryAction correctly', async () => {
    render(<ConfirmationModal {...props} />);

    const primaryActionButton = screen.getByRole('button', {
      name: 'Publish',
      hidden: true,
    });

    await userEvent.click(primaryActionButton);
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });
});
