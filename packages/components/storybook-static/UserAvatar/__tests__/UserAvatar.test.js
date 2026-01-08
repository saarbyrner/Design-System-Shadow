import { render, screen } from '@testing-library/react';
import UserAvatar from '..';

describe('<UserAvatar /> component', () => {
  const props = {
    firstname: 'Jon',
    lastname: 'Doe',
  };

  it('renders avatar image when url is present', () => {
    render(<UserAvatar {...props} url="https://example.com/avatar.jpg" />);

    const [avatar] = screen.getAllByRole('img');
    expect(avatar.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    );
  });

  it('renders initials when displayInitialsAsFallback is set and url is not present', () => {
    render(
      <UserAvatar {...props} userInitials="DK" displayInitialsAsFallback />
    );
    expect(screen.getByText('DK')).toBeInTheDocument();
  });

  it('renders initials from name when displayInitialsAsFallback is set and url is not present', () => {
    render(<UserAvatar {...props} displayInitialsAsFallback />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders fallback image when displayInitialsAsFallback is false and url is not present', () => {
    render(<UserAvatar {...props} />);

    const avatar = screen.getByRole('img');
    expect(avatar.querySelector('div')).toHaveStyle(
      `backgroundImage: url(../img/avatar_kds.svg)`
    );
  });

  it('renders statusIndicator with the correct color when statusColor is set', () => {
    render(<UserAvatar {...props} statusColor="#2a6ebb" />);

    const avatar = screen.getByRole('img');
    expect(avatar.querySelector('span')).toHaveStyle(
      `backgroundColor: #2a6ebb`
    );
  });
});
