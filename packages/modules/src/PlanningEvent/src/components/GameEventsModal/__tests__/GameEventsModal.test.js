import { render, screen, fireEvent } from '@testing-library/react';
import GameEventsModal from '..';

describe('GameEventsModal', () => {
  test('renders modal correctly', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <GameEventsModal
        isOpen
        onPressEscape={onCancel}
        onClose={onCancel}
        title="My rendered Modal"
        content="Some message content in here."
        cancelButtonText="Cancel"
        confirmButtonText="Confirm"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('My rendered Modal')).toBeInTheDocument();
    expect(
      screen.getByText('Some message content in here.')
    ).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    const confirmButton = screen.getByText('Confirm');
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    fireEvent.click(confirmButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
