import { render, screen } from '@testing-library/react';
import Warning from '../../../components/shared/Warning';

describe('Warning component', () => {
  const props = {
    title: 'any title',
    description: 'any description',
    children: <div>any child</div>,
  };

  it('renders', () => {
    render(<Warning {...props} />);
    expect(screen.getByText('any title')).toBeInTheDocument();
    expect(screen.getByText('any description')).toBeInTheDocument();
    expect(screen.getByText('any child')).toBeInTheDocument();
  });
});
