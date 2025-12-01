import { render, screen } from '@testing-library/react';
import AthleteAvatar from '../AthleteAvatar';

describe('AthleteAvatar component', () => {
  const props = {
    imageUrl: '/john_doe_avatar.png',
    name: 'John Doe',
  };

  it('renders correctly', () => {
    render(<AthleteAvatar {...props} />);

    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays the athlete with highlighted styles', () => {
    render(<AthleteAvatar {...props} highlighted />);

    const avatarContainer = screen.getByText('John Doe').closest('div');
    expect(avatarContainer).toHaveClass(
      'assessmentsAthleteAvatar--highlighted'
    );
  });

  it('does not have highlighted styles when highlighted prop is false', () => {
    render(<AthleteAvatar {...props} highlighted={false} />);

    const avatarContainer = screen.getByText('John Doe').closest('div');
    expect(avatarContainer).not.toHaveClass(
      'assessmentsAthleteAvatar--highlighted'
    );
  });
});
