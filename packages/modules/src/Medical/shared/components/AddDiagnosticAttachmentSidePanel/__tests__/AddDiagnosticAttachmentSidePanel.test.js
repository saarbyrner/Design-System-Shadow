import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AddDiagnosticAttachmentSidePanel from '../index';

describe('<AddDiagnosticAttachmentSidePanel />', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the panel with the correct title when open', () => {
    render(<AddDiagnosticAttachmentSidePanel {...defaultProps} />);

    const panel = screen.getByTestId('sliding-panel');
    expect(panel).toBeInTheDocument();

    expect(
      screen.getByText('Add attachment to diagnostic')
    ).toBeInTheDocument();
  });

  it('calls the onClose callback when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();
    render(
      <AddDiagnosticAttachmentSidePanel
        {...defaultProps}
        onClose={onCloseMock}
      />
    );

    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
