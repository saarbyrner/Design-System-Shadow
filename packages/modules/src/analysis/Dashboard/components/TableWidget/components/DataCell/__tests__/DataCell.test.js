import { render, screen } from '@testing-library/react';
import { NOT_AVAILABLE } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import colors from '@kitman/common/src/variables/colors';
import DataCell from '../index';

describe('<DataCell />', () => {
  const baseProps = {
    columnData: [
      { id: '1', value: 900 },
      { id: '2', value: 4 },
      { id: '3', value: 2936, status: 'FORBIDDEN' },
      { id: '4', value: 350, children: [{ id: 'test', value: 350 }] },
      {
        id: '5',
        value: 350,
        children: [{ id: NOT_AVAILABLE.label, value: 350 }],
      },
    ],
    id: 1,
    orderedFormattingRules: [
      {
        type: 'numeric',
        condition: 'greater_than',
        value: 899,
        color: colors.s14,
      },
      { type: 'numeric', condition: 'less_than', value: 60, color: '#3a8dee' },
    ],
    t: (key) => key,
  };

  const renderDataCell = (props = {}) => {
    const finalProps = { ...baseProps, ...props };
    return render(
      <table>
        <tbody>
          <tr>
            <DataCell {...finalProps} />
          </tr>
        </tbody>
      </table>
    );
  };

  it('renders a cell', () => {
    renderDataCell();
    expect(screen.getByRole('cell')).toBeInTheDocument();
  });

  it('shows the correct value in the cell', () => {
    renderDataCell();
    expect(screen.getByRole('cell')).toHaveTextContent('900');
  });

  it('shows the correct style for the cell', () => {
    renderDataCell();
    expect(screen.getByRole('cell')).toHaveStyle({
      background: '#dedede',
    });
  });

  it('shows the correct value in the cell when is dynamic', () => {
    renderDataCell({
      rowData: { isDynamic: true, label: 'test' },
      id: 4,
    });
    expect(screen.getByRole('cell')).toHaveTextContent('350');
  });

  it('shows the correct value in the cell when the label is "not_available"', () => {
    renderDataCell({
      rowData: { isDynamic: true, label: NOT_AVAILABLE.label },
      id: 5,
    });
    expect(screen.getByRole('cell')).toHaveTextContent(NOT_AVAILABLE.value);
  });

  it('shows the correct style for the cell when is dynamic', () => {
    renderDataCell({
      rowData: { isDynamic: true, label: 'test' },
      id: 4,
    });
    expect(screen.getByRole('cell')).toHaveStyle({
      background: colors.neutral_100,
    });
  });
});
