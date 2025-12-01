import { render, screen } from '@testing-library/react';
import AlertBanner from '../AlertBanner';

describe('AlertBanner component', () => {
  it('renders with the correct props', () => {
    const props = {
      bannerColor: 'red',
      iconColor: 'blue',
      iconClassName: 'icon-warning',
      bannerMessage: 'This is an alert banner.',
    };

    render(<AlertBanner {...props} />);

    expect(screen.getByTestId('AlertBannerIcon')).toBeInTheDocument();
    expect(screen.getByText('This is an alert banner.')).toBeInTheDocument();
  });
});
