import { render, screen } from '@testing-library/react';

import FormItem from '../FormItem';

const props = {
  primary: 'primary',
  secondary: 'secondary',
};

describe('<FormItem/>', () => {
  it('renders the <FormItem/>', () => {
    render(<FormItem {...props} />);

    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('secondary')).toBeInTheDocument();
  });

  it('renders the <FormItem/> with missing props', () => {
    render(<FormItem {...props} primary={null} />);

    expect(screen.getByText('secondary')).toBeInTheDocument();
  });
});
