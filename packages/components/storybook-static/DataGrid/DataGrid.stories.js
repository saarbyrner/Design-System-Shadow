// @flow
import { useArgs } from '@storybook/client-api';
import { DataGridTranslated as DataGrid } from '.';

const mockedData = {
  columns: [],
  rows: [],
};

const TOTAL_COLUMNS = 30;
const TOTAL_ROWS = 60;

for (let i = 0; i < TOTAL_COLUMNS; i++) {
  mockedData.columns.push({ id: i, content: `metric column-${i}` });
}
for (let i = 0; i < TOTAL_ROWS; i++) {
  mockedData.rows.push({
    id: i,
    cells: [],
  });
  for (let k = 0; k < TOTAL_COLUMNS; k++) {
    mockedData.rows[i].cells.push({
      id: k,
      content: `cell-${k} row-${i}`,
    });
  }
}

export const Basic = () => {
  const [args] = useArgs();

  return <DataGrid {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  columns: mockedData.columns,
  rows: mockedData.rows,
};

export default {
  title: 'DataGrid',
  component: Basic,
  argTypes: {},
};
