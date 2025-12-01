import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquipmentFormSection from '../EquipmentFormSection';

describe('EquipmentFormSection', () => {
  it('should render EquipmentFormSection.Title with correct text', () => {
    render(<EquipmentFormSection.Title>Jacket</EquipmentFormSection.Title>);
    expect(screen.getByText('Jacket')).toBeInTheDocument();
  });

  it('should render EquipmentFormSection.InputLabel with correct text', () => {
    render(
      <EquipmentFormSection.InputLabel>Size</EquipmentFormSection.InputLabel>
    );
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('should render EquipmentFormSection.ImageNamePreview with correct name', () => {
    const onDeleteImageMock = jest.fn();
    render(
      <EquipmentFormSection.ImageNamePreview
        name="jacket-image.jpg"
        onDeleteImage={onDeleteImageMock}
      />
    );
    expect(screen.getByText('jacket-image.jpg')).toBeInTheDocument();
  });

  it('should call onDeleteImage when delete icon is clicked', async () => {
    const onDeleteImageMock = jest.fn();
    const user = userEvent.setup();
    render(
      <EquipmentFormSection.ImageNamePreview
        name="jacket-image.jpg"
        onDeleteImage={onDeleteImageMock}
      />
    );
    await user.click(screen.getByTestId('DeleteOutlineOutlinedIcon'));
    expect(onDeleteImageMock).toHaveBeenCalledTimes(1);
  });

  it('should render EquipmentFormSection.ImagePreview with correct url', () => {
    render(
      <EquipmentFormSection.ImagePreview url="https://admin.injuryprofiler.com/image.jpg" />
    );
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      'https://admin.injuryprofiler.com/image.jpg'
    );
  });
});
