import { render, fireEvent, screen } from '@testing-library/react';
import UnlockUserModal from '../UnlockUserModal';

describe('UnlockUserModal', () => {
  it('renders and interacts with the modal', () => {
    const onCancelMock = jest.fn();
    const onUnlockMock = jest.fn();

    render(
      <UnlockUserModal isOpen onCancel={onCancelMock} onUnlock={onUnlockMock} />
    );

    const modalTitle = screen.getByText('Unlock this account');
    expect(modalTitle).toBeInTheDocument();

    const modalContent = screen.getByText(
      'This user has entered an incorrect account name or password more than 3 times.'
    );
    expect(modalContent).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const unlockButton = screen.getByText('Unlock account');
    expect(unlockButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(onCancelMock).toHaveBeenCalledTimes(1);

    fireEvent.click(unlockButton);
    expect(onUnlockMock).toHaveBeenCalledTimes(1);
  });
});
