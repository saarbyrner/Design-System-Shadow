import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AddDiagnosticLinkSidePanel from '../index';

describe('<AddDiagnosticLinkSidePanel />', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the side panel with the correct title and input fields', () => {
    render(<AddDiagnosticLinkSidePanel {...defaultProps} />);

    // Find the panel by its test ID, which is a reliable fallback when a 'dialog' role is missing.
    expect(screen.getByTestId('sliding-panel')).toBeInTheDocument();

    // Find the title by its visible text.
    expect(screen.getByText('Add link to diagnostic')).toBeInTheDocument();

    // Find form fields by their associated label text. This is the best practice.
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link/i)).toBeInTheDocument();
  });

  it('calls the onClose callback when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn(); // Use a fresh mock for this specific test
    render(
      <AddDiagnosticLinkSidePanel {...defaultProps} onClose={onCloseMock} />
    );

    // Find the close button by its test ID, as it has no accessible name.
    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
