import { render } from '@testing-library/react';
import FallbackCrest from '../FallbackCrest';

describe('<FallbackCrest />', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<FallbackCrest />);
    const svgElement = getByTestId('crest');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('width', '33');
    expect(svgElement).toHaveAttribute('height', '33');
  });
});
