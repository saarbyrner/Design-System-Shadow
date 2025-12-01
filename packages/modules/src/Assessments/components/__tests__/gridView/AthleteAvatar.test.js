import { render, screen } from '@testing-library/react';
import AthleteAvatar from '../../gridView/AthleteAvatar';

describe('AthleteAvatar component', () => {
  const baseProps = {
    imageUrl: '/john_doe_avatar.png',
    name: 'John Doe',
  };

  it('renders the athlete avatar and name correctly', () => {
    render(<AthleteAvatar {...baseProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'John Doe' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/john_doe_avatar.png');
  });

  it('applies a highlight class when the highlighted prop is true', () => {
    const { container } = render(<AthleteAvatar {...baseProps} highlighted />);

    expect(container.firstChild).toHaveClass(
      'assessmentsAthleteAvatar--highlighted'
    );
  });
});
