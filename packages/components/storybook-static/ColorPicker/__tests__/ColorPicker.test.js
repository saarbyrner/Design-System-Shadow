import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ColorPicker from '..';
import style from '../style';

describe('<ColorPicker />', () => {
  const originalCanvasContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = () => {};
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalCanvasContext;
  });

  it('shows a border around the swatch color when the color is white', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('ColorPicker|SwatchColor')).toHaveStyle({
      backgroundColor: '#ffffff',
      border: '1px solid #dedede',
    });
  });

  it('shows the correct styles when an initialColor is passed in', () => {
    render(<ColorPicker initialColor="#000000" />);
    expect(screen.getByTestId('ColorPicker|SwatchColor')).toHaveStyle({
      backgroundColor: '#000000',
      border: 'none',
    });
  });

  it('shows the color picker on clicking the swatch button', async () => {
    const user = userEvent.setup();
    const changeFunction = jest.fn();
    render(<ColorPicker onChange={changeFunction} />);

    const swatch = screen.getByTestId('ColorPicker|Swatch');
    await user.click(swatch);

    expect(swatch).toHaveStyle(style.swatch);

    expect(screen.getByTestId('ColorPicker|Picker')).toBeInTheDocument();
  });

  describe('when isDeleteable', () => {
    it('contains a delete div', () => {
      render(<ColorPicker isDeleteable />);
      expect(
        screen.getByTestId('ColorPicker').querySelector('#deleteColor')
      ).toBeInTheDocument();
    });
  });

  describe('when isExampleTextVisible', () => {
    it(
      'doesn’t show the color picker and calls onClick when clicked, has the' +
        ' correct styles and the example text',
      async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(<ColorPicker isExampleTextVisible onClick={onClick} />);

        const swatch = screen.getByTestId('ColorPicker|Swatch');
        await user.click(swatch);

        expect(swatch).toHaveStyle({
          ...style.swatch,
          ...style.exampleTextSwatchColor,
        });

        expect(
          screen.queryByTestId('ColorPicker|Picker')
        ).not.toBeInTheDocument();
        expect(onClick).toHaveBeenCalledTimes(1);

        expect(screen.getByTestId('ColorPicker|SwatchColor')).toHaveStyle({
          width: '3.0625rem',
          height: '2rem',
          lineHeight: '2rem',
        });
        expect(screen.getByText('Aa')).toBeInTheDocument();
      }
    );

    it('shows the color picker when clicked and isExampleTextVisible is false', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<ColorPicker onClick={onClick} />);

      await user.click(screen.getByTestId('ColorPicker|Swatch'));

      expect(screen.getByTestId('ColorPicker|Picker')).toBeInTheDocument();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('when showPickerOnly', () => {
    it('shows only the picker', () => {
      render(<ColorPicker showPickerOnly />);
      expect(screen.getByTestId('ColorPicker|Picker')).toBeInTheDocument();
      expect(
        screen.queryByTestId('ColorPicker|Swatch')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('ColorPicker|SwatchColor')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Aa')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('ColorPicker').querySelector('#deleteColor')
      ).not.toBeInTheDocument();
    });
  });
});
