import { render, screen } from '@testing-library/react';

import HeaderAvatar from '../HeaderAvatar';

describe('HeaderAvatar', () => {
  const props = {
    src: 'a/src',
    alt: 'an_alt',
    variant: 'small',
  };
  it('renders', () => {
    render(<HeaderAvatar {...props} />);
    expect(screen.getByRole('img', { name: `an_alt` })).toBeInTheDocument();
  });
});
