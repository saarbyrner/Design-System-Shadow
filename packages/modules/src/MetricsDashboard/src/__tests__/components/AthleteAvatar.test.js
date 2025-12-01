import { render } from '@testing-library/react';
import AthleteAvatar from '../../components/AthleteAvatar';

describe('<AthleteAvatar/>', () => {
  const baseProps = {
    image: 'avatar.jpg',
    url: '/athletes/123',
    alt: 'Image Alt Text',
  };

  it('renders', () => {
    const { container } = render(<AthleteAvatar {...baseProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies provided image, url and alt props', () => {
    const override = { ...baseProps, image: '/path/to/athlete-image.jpg' };
    const { container } = render(<AthleteAvatar {...override} />);
    const anchor = container.querySelector('a.athleteAvatar');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/athletes/123');
    expect(anchor).toHaveAttribute('alt', baseProps.alt);
    expect(anchor).toHaveStyle({
      backgroundImage: 'url(/path/to/athlete-image.jpg)',
    });
  });
});
