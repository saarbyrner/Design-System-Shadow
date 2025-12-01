import { Box, DataGrid } from '@kitman/playbook/components';
import { useState } from 'react';
import {
  rows,
  columns,
} from '@kitman/playbook/components/wrappers/DataGrid/__tests__/DataGridTestData';
import { getPage, getDesign } from '../../utils';

const docs = {
  muiLink: 'https://mui.com/x/api/data-grid/data-grid-pro/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=216-100624&mode=design&t=UGvgdvU82QuilQbp-0',
};

export default {
  title: 'Table/Data Grid',
  render: ({ ...args }) => (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      page: getPage(docs),
    },
    design: getDesign(docs),
  },
  tags: ['autodocs'],

  argTypes: {
    rows: {
      control: 'array',
      defaultValue: rows,
      description:
        'The object of rows to display in the data grid and the total amount of items',
    },
    columns: {
      control: 'array',
      defaultValue: columns,
      description: 'The array of headers to display in the data grid',
    },
    checkboxSelection: {
      control: 'boolean',
      defaultValue: false,
      description: 'Make the grid have checkbox selection',
    },
    disableRowSelectionOnClick: {
      control: 'boolean',
      defaultValue: false,
      description: 'Disable selection on click of grid row',
    },
    gridToolBar: {
      control: 'check',
      defaultValue: [],
      options: ['enableCSV', 'enablePrint', 'showQuickFilter'],
    },
    noRowsMessage: {
      control: 'text',
      defaultValue: 'No rows',
      description: 'The message that should display when there is no rows',
    },
    pageSizeOptions: {
      control: 'array',
      defaultValue: [5, 10, 25, 50],
      description:
        'The available page sizes in pagination within the data grid (works with pagination)',
    },
    pagination: {
      control: 'boolean',
      defaultValue: true,
      description: 'Make the grid have pagination',
    },
  },
};

export const Story = {
  args: {
    rows,
    columns,
    checkboxSelection: true,
    rowSelection: true,
    disableRowSelectionOnClick: false,
    gridToolBar: [],
    leftPinnedColumns: [], // no control as initial state prop (i.e needs to be present on first render)
    noRowsMessage: 'No rows',
    pageSize: 5, // no control as initial state prop (i.e needs to be present on first render)
    pageSizeOptions: [5, 10, 25, 50],
    pagination: true,
    rightPinnedColumns: [], // no control as initial state prop (i.e needs to be present on first render)
  },
};

export const WithInfiniteLoading = () => {
  const [loading, setLoading] = useState(false);
  const [displayRows, setDisplayRows] = useState(rows.slice(0, 25));
  const [paginationModel, setPaginationModel] = useState({
    pageNumber: 0,
    pageSize: 25,
  });
  const infiniteDataLoading = (nextPage, pageSize) => {
    setLoading(true);

    return new Promise((resolve) => {
      return setTimeout(
        () =>
          resolve(
            rows.slice(
              (paginationModel.pageNumber + 1) * pageSize,
              (nextPage + 1) * pageSize
            )
          ),
        1000
      );
    }).then((newRows) => {
      setLoading(false);
      setPaginationModel((prev) => {
        return {
          ...prev,
          pageNumber: prev.pageNumber + 1,
        };
      });
      setDisplayRows((prev) => {
        return prev.concat(newRows);
      });
    });
  };

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid
        columns={columns}
        rows={displayRows}
        rowCount={rows.length}
        infiniteLoadingCall={
          rows.length !== displayRows.length ? infiniteDataLoading : null
        }
        infiniteLoading
        pageSize={paginationModel.pageSize}
        pageNumber={paginationModel.pageNumber}
        loading={loading}
      />
    </Box>
  );
};
export const NumberedPagination = () => {
  const [loading, setLoading] = useState(false);
  const [displayRows, setDisplayRows] = useState(rows.slice(0, 25));
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [paginationModel, setPaginationModel] = useState({
    pageNumber: 0,
    pageSize: 25,
  });

  const onPaginationModelChange = (selectedPage, selectedPageSize) => {
    setLoading(true);

    return new Promise((resolve) => {
      return setTimeout(
        () =>
          resolve(
            rows.slice(
              selectedPage * selectedPageSize,
              (selectedPage + 1) * selectedPageSize
            )
          ),
        1000
      );
    }).then((newRows) => {
      setLoading(false);
      setPaginationModel({
        pageSize: selectedPageSize,
        pageNumber: selectedPage,
      });
      setDisplayRows(newRows);
    });
  };

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid
        columns={columns}
        rows={displayRows}
        rowCount={rows.length}
        asyncPagination
        pageSizeOptions={[25, 50, 100]}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(perPage) => {
          setRowsPerPage(perPage);
          onPaginationModelChange(0, perPage);
        }}
        onPaginationModelChange={onPaginationModelChange}
        pageSize={paginationModel.pageSize}
        pageNumber={paginationModel.pageNumber}
        loading={loading}
      />
    </Box>
  );
};
