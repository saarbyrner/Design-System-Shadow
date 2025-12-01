import { render, screen } from '@testing-library/react';

import MovementDirection from '../MovementDirection';

const props = {
  label: null,
  fromOrganisation: null,
  toOrganisation: null,
};

describe('<MovementDirection/>', () => {
  it('renders the <MovementDirection/> with incomplete props', () => {
    render(<MovementDirection {...props} />);
    expect(screen.getByTestId('ArrowForwardIosIcon')).toBeInTheDocument();
  });

  it('renders the <MovementDirection/>', () => {
    const localProps = {
      label: 'movement type label',
      fromOrganisation: { name: 'Real Madrid' },
      toOrganisation: { name: 'Treaty United' },
    };
    render(<MovementDirection {...localProps} />);
    expect(screen.getByTestId('ArrowForwardIosIcon')).toBeInTheDocument();
    expect(screen.getByText('movement type label')).toBeInTheDocument();
    expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    expect(screen.getByText('Treaty United')).toBeInTheDocument();
  });
});
