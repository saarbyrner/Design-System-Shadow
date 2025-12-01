import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColourPalette from '..';

describe('<ColourPalette />', () => {
  const originalCanvasContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = () => {};
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalCanvasContext;
  });

  const props = {
    header: 'Test Palette',
    onUpdateColours: jest.fn(),
    palette: ['#3a8dee', '#cfa96c', '#ffffff'],
  };

  it('renders the correct amount of color pickers based on the length of the palette prop', () => {
    render(<ColourPalette {...props} />);
    expect(screen.getAllByTestId('ColorPicker')).toHaveLength(3);
  });

  it('calls the correct callback when a color picker has been deleted', async () => {
    render(<ColourPalette {...props} min={2} />);
    const [firstColorPicker] = screen.getAllByTestId('ColorPicker');

    const deleteIcon = firstColorPicker.querySelector('.icon-close');
    await userEvent.click(deleteIcon);

    await waitFor(() => {
      expect(props.onUpdateColours).toHaveBeenCalledWith([
        '#cfa96c',
        '#ffffff',
      ]);
    });
  });

  it('does not call the onUpdateColours callback when delete is clicked and the palette is at min', async () => {
    render(<ColourPalette {...props} min={3} />);
    const [firstColorPicker] = screen.getAllByTestId('ColorPicker');

    const deleteIcon = firstColorPicker.querySelector('.icon-close');
    await userEvent.click(deleteIcon);

    await waitFor(() => {
      expect(props.onUpdateColours).not.toHaveBeenCalled();
    });
  });

  it('renders an add button', () => {
    render(<ColourPalette {...props} />);
    expect(
      screen
        .getByTestId('ColourPalette')
        .querySelector('.colourPalette__addPicker')
    ).toBeInTheDocument();
  });

  it('does not render the add button if the palette is at the max', () => {
    render(<ColourPalette {...props} max={3} />);
    expect(
      screen
        .getByTestId('ColourPalette')
        .querySelector('.colourPalette__addPicker')
    ).not.toBeInTheDocument();
  });

  it('adds the default colour to the palette when defaultColour is set', async () => {
    render(<ColourPalette {...props} defaultColour="#444444" />);

    const addPicker = screen
      .getByTestId('ColourPalette')
      .querySelector('.colourPalette__addPicker');
    await userEvent.click(addPicker);

    expect(props.onUpdateColours).toHaveBeenCalledWith([
      '#3a8dee',
      '#cfa96c',
      '#ffffff',
      '#444444',
    ]);
  });
});
