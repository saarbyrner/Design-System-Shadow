import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Indexes } from '../../types';
import ColorPickerModal from '../ColorPickerModal';

describe('<ColorPickerModal />', () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = () => {};
  });

  const brandingColors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
  ];

  it('renders the modal with the correct styles and the branding colors', () => {
    render(
      <ColorPickerModal
        colorPickerModalEventIndex={1}
        brandingColors={brandingColors}
      />
    );
    screen.getAllByTestId('ColorPicker|Swatch').forEach((swatch) => {
      expect(swatch).toBeInTheDocument();
    });
    screen.getAllByTestId('ColorPicker|SwatchColor').forEach((swatchColor) => {
      expect(swatchColor).toBeInTheDocument();
    });

    expect(screen.getByText('Select color')).toBeInTheDocument();
    expect(screen.getByText('Branding')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders the second tab with the correct styles and the color picker', async () => {
    const user = userEvent.setup();
    render(
      <ColorPickerModal
        colorPickerModalEventIndex={1}
        brandingColors={brandingColors}
      />
    );
    await user.click(screen.getByText('Custom'));

    expect(screen.queryByTestId('ColorPicker|Swatch')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('ColorPicker|SwatchColor')
    ).not.toBeInTheDocument();
  });

  it('calls the correct props with the correct arguments when the ‘Select’ button is clicked', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const setColorPickerModalEventIndex = jest.fn();
    render(
      <ColorPickerModal
        colorPickerModalEventIndex={1}
        setColorPickerModalEventIndex={setColorPickerModalEventIndex}
        brandingColors={brandingColors}
        onSave={onSave}
      />
    );
    await user.click(screen.getByText('Select'));

    expect(onSave).toHaveBeenCalled();
    expect(setColorPickerModalEventIndex).toHaveBeenCalledWith(Indexes.NoEvent);
  });

  it('calls ‘setColorPickerModalEventIndex’ prop with the correct argument when the ‘Cancel’ button is clicked', async () => {
    const user = userEvent.setup();
    const setColorPickerModalEventIndex = jest.fn();
    render(
      <ColorPickerModal
        colorPickerModalEventIndex={1}
        setColorPickerModalEventIndex={setColorPickerModalEventIndex}
        brandingColors={brandingColors}
      />
    );
    await user.click(screen.getByText('Cancel'));

    expect(setColorPickerModalEventIndex).toHaveBeenCalledWith(Indexes.NoEvent);
  });
});
