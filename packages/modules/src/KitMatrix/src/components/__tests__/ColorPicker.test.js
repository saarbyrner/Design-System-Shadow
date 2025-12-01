import { render, fireEvent, screen } from '@testing-library/react';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  const onChangeMock = jest.fn();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    render(<ColorPicker onChange={onChangeMock} />);

    const colorPicker = screen.getByTestId('color-picker');
    const inputColor = colorPicker.querySelector('input[type="color"]');
    const customColorPicker = screen.getByTestId('custom-color-picker');

    expect(inputColor).toBeInTheDocument();
    expect(customColorPicker).toBeInTheDocument();
  });

  it('renders the default color', () => {
    render(<ColorPicker onChange={onChangeMock} />);
    const customColorPicker = screen.getByTestId('custom-color-picker');
    expect(customColorPicker).toHaveStyle('background-color: ');
  });

  it('renders the color passed in props', () => {
    render(<ColorPicker color="#000" onChange={onChangeMock} />);
    const customColorPicker = screen.getByTestId('custom-color-picker');
    expect(customColorPicker).toHaveStyle('background-color: #000');
  });

  it('calls onChange with the right color', () => {
    render(<ColorPicker onChange={onChangeMock} />);

    const colorPicker = screen.getByTestId('color-picker');
    const inputColor = colorPicker.querySelector('input[type="color"]');

    fireEvent.change(inputColor, { target: { value: '#ff0000' } });
    expect(onChangeMock).toHaveBeenCalledWith('#ff0000');
  });
});
