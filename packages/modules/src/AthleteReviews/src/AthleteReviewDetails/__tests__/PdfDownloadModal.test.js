import { render, screen } from '@testing-library/react';
import PdfDownloadModal from '../PdfDownloadModal';

describe('PdfDownloadModal', () => {
  const dialogText = 'Sample dialog content';
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Download PDF',
    dialogContent: <>{dialogText}</>,
  };

  const renderComponent = (props = defaultProps) => {
    render(<PdfDownloadModal {...props} />);
  };

  it('should render properly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: defaultProps.title })
    ).toBeInTheDocument();
    expect(screen.getByText(dialogText)).toBeInTheDocument();
  });

  it('should trigger onClose callback when modal is closed', () => {
    renderComponent();

    expect(defaultProps.onClose).not.toHaveBeenCalled();

    defaultProps.onClose();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
