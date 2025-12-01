import { screen, render } from '@testing-library/react';
import { FormTitle } from '../FormTitle';

const props = {
  title: 'Registration',
};

describe('<FormTitle/>', () => {
  it('renders', () => {
    render(<FormTitle {...props} />);
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
  });
});
