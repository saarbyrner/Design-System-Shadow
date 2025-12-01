import { render } from '@testing-library/react';
import Table from '../index';

describe('TableWidget: <Table /> compponent', () => {
  it('renders table markup sucessfully', () => {
    const { container } = render(
      <Table>
        <Table.Column>
          <Table.BlankRow />
          <Table.Row className="tableRow">
            <Table.Cell className="tableCell">CELL TEXT</Table.Cell>
          </Table.Row>
        </Table.Column>
      </Table>
    );

    // Check for table element with correct class
    const table = container.querySelector('table.tableWidget__table');
    expect(table).toBeInTheDocument();

    // Check for blank row
    const blankRow = container.querySelector('tr.tableWidget__blankRow');
    expect(blankRow).toBeInTheDocument();

    // Check for the cell with text
    const cell = container.querySelector('td.tableCell');
    expect(cell).toHaveTextContent('CELL TEXT');

    // Check for the row with the correct class
    const row = container.querySelector('tr.tableRow');
    expect(row).toBeInTheDocument();
  });

  it('renders sortable columns', () => {
    const { container } = render(
      <Table>
        <Table.Column>
          <Table.Row className="tableRow">
            <Table.Cell className="tableCell">CELL TEXT</Table.Cell>
          </Table.Row>
        </Table.Column>

        <Table.ColumnSortable index={0}>
          <Table.Row className="tableRow">
            <Table.Cell className="tableCell">
              <Table.SortHandle />
            </Table.Cell>
          </Table.Row>
        </Table.ColumnSortable>

        <Table.ColumnSortable index={1}>
          <Table.Row className="tableRow">
            <Table.Cell className="tableCell">
              <Table.SortHandle />
            </Table.Cell>
          </Table.Row>
        </Table.ColumnSortable>
      </Table>
    );

    // Check that the table renders correctly
    const table = container.querySelector('table.tableWidget__table');
    expect(table).toBeInTheDocument();

    // Check that sortable columns are rendered
    const sortableColumns = container.querySelectorAll('tbody');
    expect(sortableColumns).toHaveLength(3); // 1 regular column + 2 sortable columns

    // Check that sort handles are rendered
    const sortHandles = container.querySelectorAll('.tableWidget__sortHandle');
    expect(sortHandles).toHaveLength(2);
  });
});
