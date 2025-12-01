import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GraphColours from '../index';

describe('Organisation Settings <GraphColours /> component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      fetchColours: jest.fn(),
      onUpdateColours: jest.fn(),
      palette: ['#3a8dee', '#000000', '#ffffff'],
      t: i18nextTranslateStub(),
    };
  });

  it('renders the correct intro text', () => {
    render(<GraphColours {...baseProps} />);

    expect(screen.getByText('Select graph colour palette')).toBeInTheDocument();
  });

  it('renders the ColourPalette component with the correct initial colors', () => {
    render(<GraphColours {...baseProps} />);

    // Find all color inputs rendered by the real ColourPalette component
    const colorInputs = screen.getAllByTestId('ColorPicker|SwatchColor');

    expect(colorInputs).toHaveLength(3);
    expect(colorInputs[0]).toHaveStyle({
      backgroundColor: 'rgb(58, 141, 238)', // #3a8dee
    });
    expect(colorInputs[1]).toHaveStyle({
      backgroundColor: 'rgb(0, 0, 0)', // #000000
    });
    expect(colorInputs[2]).toHaveStyle({
      backgroundColor: 'rgb(255, 255, 255)', // #ffffff
      border: '1px solid #dedede',
    });
  });

  it('calls fetchColours on initial mount', () => {
    render(<GraphColours {...baseProps} />);

    // The useEffect hook in the component should call this function once.
    expect(baseProps.fetchColours).toHaveBeenCalledTimes(1);
  });
});
