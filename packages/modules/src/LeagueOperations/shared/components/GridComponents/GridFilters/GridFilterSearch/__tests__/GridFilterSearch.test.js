import { render, screen, fireEvent } from '@testing-library/react';
import GridFilterSearch from '..';

jest.mock('@kitman/common/src/hooks/useDebouncedCallback', () => {
  return (cb) => cb;
});

describe('GridFilterSearch', () => {
  it('renders the input with label', () => {
    render(<GridFilterSearch label="Search Players" onChange={jest.fn()} />);

    expect(screen.getByLabelText('Search Players')).toBeInTheDocument();
  });

  it('calls onChange when input is typed into', () => {
    const onChangeMock = jest.fn();

    render(<GridFilterSearch label="Search" onChange={onChangeMock} />);

    const input = screen.getByLabelText('Search');
    fireEvent.change(input, { target: { value: 'Ronaldo' } });

    expect(onChangeMock).toHaveBeenCalledWith('Ronaldo');
  });
});
