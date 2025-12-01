import { render, screen } from '@testing-library/react';
import ChannelAvatar from '../ChannelAvatar';

describe('<ChannelAvatar /> component', () => {
  it('renders an image when a url is supplied', () => {
    render(
      <ChannelAvatar
        channelFriendlyName="Channel"
        url="https://some-img-url.com"
      />
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://some-img-url.com');

    expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
  });

  it('renders a fallback element when no url is supplied', () => {
    const { container } = render(
      <ChannelAvatar channelFriendlyName="Channel" />
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    const fallbackElement = container.querySelector(
      '[class*="channelAvatarFallback"]'
    );
    expect(fallbackElement).toBeInTheDocument();
  });
});
