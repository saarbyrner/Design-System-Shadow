import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquipmentCell from '../EquipmentCell';

describe('EquipmentCell', () => {
  const defaultProps = {
    color: 'Red',
    imageUrl: 'url',
  };

  const renderComponent = () => {
    render(<EquipmentCell {...defaultProps} />);
  };

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByTestId('AttachFileIcon')).toBeInTheDocument();
  });

  it('shows the image when the AttachFileIcon is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const attachFileIcon = screen.getByTestId('AttachFileIcon');
    await user.click(attachFileIcon);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
