import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PathologyItem from '../PathologyItem';

const props = {
  label: 'Pathology item label:',
  value: 'Pathology item value',
  withEdit: false,
  onEdit: jest.fn(),
};

describe('<PathologyItem/>', () => {
  it('renders', () => {
    render(<PathologyItem {...props} />);
    expect(screen.getByText('Pathology item label:')).toBeInTheDocument();
    expect(screen.getByText('Pathology item value')).toBeInTheDocument();
  });

  it('renders the edit button', async () => {
    render(<PathologyItem {...props} withEdit />);
    const editButton = screen.getByRole('button');
    expect(editButton).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('icon-edit');

    await userEvent.click(editButton);
    expect(props.onEdit).toHaveBeenCalled();
  });
});
