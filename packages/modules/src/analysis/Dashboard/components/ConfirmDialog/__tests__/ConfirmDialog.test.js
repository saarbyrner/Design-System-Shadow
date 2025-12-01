import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../index';

describe('<ConfirmDialog />', () => {
  const onSuccess = jest.fn();
  const onCancel = jest.fn();
  const props = {
    t: i18nextTranslateStub(),
    title: 'Are you sure?',
    content: 'Are you sure you want to do this action',
    buttonContent: {
      success: 'Yes',
      cancel: 'No',
    },
    isOpen: false,
    onCancel,
    onSuccess,
  };

  it('renders with the correct messages and buttons', () => {
    render(<ConfirmDialog {...props} isOpen />);

    expect(screen.queryByText(props.title)).toBeVisible();
    expect(screen.queryByText(props.content)).toBeVisible();
    expect(
      screen.queryByRole('button', { name: props.buttonContent.success })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: props.buttonContent.cancel })
    ).toBeVisible();
  });

  it('calls onSuccess when save is clicked when clicked', async () => {
    render(<ConfirmDialog {...props} isOpen />);

    expect(onSuccess).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: props.buttonContent.success })
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);

    await userEvent.click(
      screen.getByRole('button', { name: props.buttonContent.cancel })
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when save is clicked when clicked', async () => {
    render(<ConfirmDialog {...props} isOpen />);

    expect(onCancel).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: props.buttonContent.success })
    );

    expect(onCancel).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: props.buttonContent.cancel })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
