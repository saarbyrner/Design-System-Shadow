import { render, screen } from '@testing-library/react';

import AvatarItem from '../AvatarItem';

describe('AvatarItem', () => {
  const props = {
    primary: 'primary',
    secondary: 'secondary',
    src: 'a/src',
  };
  it('renders', () => {
    render(<AvatarItem {...props} />);
    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('secondary')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: `primary` })).toBeInTheDocument();
  });
});
