import { render, screen } from '@testing-library/react';
import { buildGridColumn } from '../helpers';

describe('buildGridColumn', () => {
  const valueName = 'Test Value';
  const accessor = 'testAccessor';
  const width = 100;

  it('renders Header with correct props', () => {
    render(buildGridColumn({ valueName, accessor, width }).Header());
    expect(screen.getByText(valueName)).toBeInTheDocument();
  });

  it('renders Cell with correct props', () => {
    const mockCellData = { cell: { value: 'Test Cell Value' } };
    render(buildGridColumn({ valueName, accessor, width }).Cell(mockCellData));
    expect(screen.getByText(mockCellData.cell.value)).toBeInTheDocument();
  });
});
