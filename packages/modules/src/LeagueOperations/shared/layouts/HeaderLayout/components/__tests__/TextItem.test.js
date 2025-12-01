import { render, screen } from '@testing-library/react';

import TextItem from '../TextItem';

describe('TextItem', () => {
  const props = {
    primary: 'primary',
    secondary: 'secondary',
  };
  it('renders', () => {
    render(<TextItem {...props} />);
    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('secondary')).toBeInTheDocument();
  });
});
