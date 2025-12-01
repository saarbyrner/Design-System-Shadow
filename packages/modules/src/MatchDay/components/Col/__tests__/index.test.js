import { render, screen } from '@testing-library/react';
import Col from '..';

describe('Col', () => {
  it('renders correctly', () => {
    render(<Col>Content</Col>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
