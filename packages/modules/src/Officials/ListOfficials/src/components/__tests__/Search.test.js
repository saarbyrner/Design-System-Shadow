import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Search from '../Filters/Search';

const props = {
  searchKey: 'name',
  value: '',
  onUpdateFunction: jest.fn(),
};

describe('<Search/>', () => {
  it('renders the search filter', async () => {
    render(<Search {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Search'
    );
  });

  it('correctly calls the onUpdateFunction', async () => {
    render(<Search {...props} />);
    await userEvent.type(screen.getByRole('textbox'), `s`);
    expect(props.onUpdateFunction).toHaveBeenCalledWith({
      name: 's',
    });
  });
});
