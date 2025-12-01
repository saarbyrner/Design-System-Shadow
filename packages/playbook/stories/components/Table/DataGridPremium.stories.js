// @flow
import { useState, useEffect } from 'react';
import { Box, DataGridPremium, Typography } from '@kitman/playbook/components';
import {
  type GridRowsProp,
  type GridRowSelectionModel,
  GridLinkOperator,
} from '@mui/x-data-grid-premium';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

import { baseColumns, sampleRows, allServerRows } from './utils';
import { getPage, getDesign } from '../../utils';

const docs = {
  muiLink: 'https://v7.mui.com/x/react-data-grid/getting-started/',
  figmaLink:
    'https://www.figma.com/design/111qJweoGOlBTRcmptHEf9/The-Playbook-Master?node-id=16158-95984&t=XGfJDw03bBAYGQKC-0',
};

export default {
  title: 'Table/DataGridPremium',
  component: DataGridPremium,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: getPage(docs),
      description: {
        component:
          'A wrapper around MUI DataGridPremium to simplify its API, provide defaults, and add custom features like conditional bulk actions toolbar, configurable standard toolbar buttons, and loading overlay variants. This also demonstrates native MUI DataGridPremium features.',
      },
    },
    design: getDesign(docs),
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'object',
      description: 'Array of row data objects for the grid.',
    },
    columns: {
      control: 'object',
      description: 'Array of column definition objects.',
    },
    loading: {
      control: 'boolean',
      description: 'If true, the grid shows a loading overlay.',
      defaultValue: false,
    },
    loadingVariant: {
      control: 'select',
      options: ['spinner', 'skeleton', 'linear-progress', 'none'],
      description: 'Variant of the loading overlay to display.',
      defaultValue: 'skeleton',
    },
    pageSize: {
      control: 'number',
      description:
        'Number of rows per page. Initial for client-side, current for server-side.',
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Array of page size options (e.g., [10, 25, 50]).',
    },
    pagination: {
      control: 'boolean',
      description: 'Enable pagination',
      defaultValue: true,
    },
    asyncPagination: {
      control: 'boolean',
      description: 'Enables server-side pagination mode.',
      defaultValue: false,
    },
    rowCount: {
      control: 'number',
      description: 'Total number of rows from server (for asyncPagination).',
    },
    pageNumber: {
      control: 'number',
      description: 'Current 0-indexed page (for asyncPagination).',
    },
    checkboxSelection: {
      control: 'boolean',
      description:
        "If true, checkboxes are displayed for row selection. Defaults to true if 'bulkActions' are provided.",
    },
    disableRowSelectionOnClick: { control: 'boolean', defaultValue: true },
    autoHeight: { control: 'boolean', defaultValue: false },
    height: {
      control: 'number',
      description: 'Height of the grid container when autoHeight is false.',
    },
    width: {
      control: 'text',
      description: 'Width of the grid container (e.g., "100%", "950px").',
    },
    hideFooter: {
      control: 'boolean',
      description: 'If true, the entire footer is hidden. Defaults to false.',
      defaultValue: false,
    },
    hideFooterSelectedRowCount: {
      control: 'boolean',
      description:
        'If true, the selected row count in the footer is hidden. Defaults to true if bulk actions UI is active.',
    },
    initialState: { control: 'object' },
    bulkActions: {
      control: 'object',
      description:
        'Array of BulkActionItem definitions for the bulk actions toolbar.',
    },
    excelExportOptions: {
      control: 'object',
      description: 'Options for Excel export.',
    },
    showColumnSelectorButton: {
      control: 'boolean',
      description: 'If true, shows the column selector button in the toolbar.',
      defaultValue: true,
    },
    showFilterButton: {
      control: 'boolean',
      description: 'If true, shows the filter button in the toolbar.',
      defaultValue: true,
    },
    showDensitySelectorButton: {
      control: 'boolean',
      description: 'If true, shows the density selector button in the toolbar.',
      defaultValue: true,
    },
    showExportButton: {
      control: 'boolean',
      description: 'If true, shows the export button in the toolbar.',
      defaultValue: true,
    },
    showQuickFilter: {
      control: 'boolean',
      description: 'If true, shows the quick filter input in the toolbar.',
      defaultValue: true,
    },
    rowGroupingModel: {
      control: 'object',
      description: "Controls the row grouping. Example: `['category']`",
    },
    defaultGroupingExpansionDepth: {
      control: 'number',
      description:
        'Default expansion depth for grouped rows. -1 for all, 0 for none.',
    },
    cellSelection: {
      control: 'boolean',
      description: 'If true, enables cell selection mode.',
      defaultValue: false,
    },
  },
};

const fetchServerPageData = async (
  page: number, // 0-indexed
  pageSize: number
): Promise<{ rows: GridRowsProp, totalRows: number }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedRows = allServerRows.slice(start, end);

  return { rows: paginatedRows, totalRows: allServerRows.length };
};

// Template for Server-Side Pagination
const ServerSidePaginationTemplate = (
  args: Object,
  { updateArgs }: { updateArgs: (newArgs: $Shape<any>) => void }
) => {
  // State for server-side pagination
  const [serverRows, setServerRows] = useState<GridRowsProp>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(args.pageNumber || 0);
  const [pageSize, setPageSize] = useState<number>(args.pageSize || 10);
  const [loading, setLoading] = useState<boolean>(true);

  // State for client-side selection model
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const fetchData = async (currentPage: number, currentPageSize: number) => {
    setLoading(true);
    try {
      const { rows: newRows, totalRows } = await fetchServerPageData(
        currentPage,
        currentPageSize
      );
      setServerRows(newRows);
      setRowCount(totalRows);
      setPageNumber(currentPage);
      setPageSize(currentPageSize);

      updateArgs({
        rows: newRows,
        rowCount: totalRows,
        pageNumber: currentPage,
        pageSize: currentPageSize,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch server data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaginationModelChange = (
    newPage: number,
    newPageSize: number
  ) => {
    fetchData(newPage, newPageSize);
  };

  const commonProps = {
    columns: args.columns || baseColumns,
    // For server-side, rowSelectionModel is managed independently here
    rowSelectionModel,
    onRowSelectionModelChange: (newSelectionModel) =>
      setRowSelectionModel(newSelectionModel),
    pageSizeOptions: args.pageSizeOptions || [5, 10, 20, 50], // Pass options
    // loading will be controlled by our fetchData function
    loadingVariant: args.loadingVariant || 'skeleton',
    checkboxSelection: args.checkboxSelection,
  };

  const storyLayout = args.layout || 'fullscreen';
  const calculateHeight = (storyArgs: Object, layout: string) => {
    if (storyArgs.autoHeight) return undefined;
    if (storyArgs.height) return storyArgs.height;
    return layout === 'fullscreen' ? 'calc(100vh - 80px)' : 600;
  };
  const calculatedWidth =
    args.width || (storyLayout === 'fullscreen' ? '100%' : '950px');
  const calculatedPadding = args.noPadding ? 0 : 2;
  const boxStyles = {
    height: calculateHeight(args, storyLayout),
    width: calculatedWidth,
    p: calculatedPadding,
    boxSizing: 'border-box',
  };

  return (
    <Box sx={boxStyles}>
      {args.storyTitle && !args.noTitle && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{ p: storyLayout === 'fullscreen' ? 2 : 0, mb: 1 }}
        >
          {args.storyTitle}
        </Typography>
      )}
      <DataGridPremium
        {...commonProps}
        {...args} // Spread other args from the story, like toolbar visibility etc.
        // Server-Side Pagination Props
        pagination
        rows={serverRows}
        loading={loading}
        asyncPagination
        rowCount={rowCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onAsyncPaginationModelChange={handlePaginationModelChange}
      />
    </Box>
  );
};

const Template = (
  args: Object,
  { updateArgs }: { updateArgs: (newArgs: $Shape<any>) => void }
) => {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [currentRows, setCurrentRows] = useState<GridRowsProp>(
    args.rows || sampleRows
  );

  const initialRowGroupingModel =
    args.rowGroupingModel ||
    (args.initialState &&
      args.initialState.rowGrouping &&
      args.initialState.rowGrouping.model);
  const [rowGroupingModelState, setRowGroupingModelState] = useState(
    initialRowGroupingModel
  );

  // Effect to update currentRows if args.rows changes (e.g., via Storybook controls)
  useEffect(() => {
    if (args.rows) {
      setCurrentRows(args.rows);
    }
  }, [args.rows]);

  // Effect to update rowGroupingModel if args.rowGroupingModel changes
  useEffect(() => {
    setRowGroupingModelState(args.rowGroupingModel);
  }, [args.rowGroupingModel]);

  const commonProps = {
    columns: args.columns || baseColumns,
    rowSelectionModel,
    onRowSelectionModelChange: (newSelectionModel) =>
      setRowSelectionModel(newSelectionModel),
    pageSize: args.pageSize || 10,
    pageSizeOptions: args.pageSizeOptions || [5, 10, 20, 50, 100],
    loading: args.loading || false,
    loadingVariant: args.loadingVariant || 'skeleton',
    checkboxSelection: args.checkboxSelection,
    excelExportOptions: args.excelExportOptions || { fileName: 'story-export' },
    rowGroupingModel: rowGroupingModelState,
    onRowGroupingModelChange: (newModel) => {
      setRowGroupingModelState(newModel);
      updateArgs({ rowGroupingModel: newModel });
    },
    defaultGroupingExpansionDepth:
      args.defaultGroupingExpansionDepth === undefined
        ? 0
        : args.defaultGroupingExpansionDepth,
    cellSelection: args.cellSelection,
  };

  const updateRowsForStory = (updatedRows) => {
    setCurrentRows(updatedRows); // Update internal state
    updateArgs({ rows: updatedRows }); // Update Storybook control for `rows`
  };

  let storyBulkActions = args.bulkActions;

  if (args.bulkActions && args.onBulkAction) {
    storyBulkActions = args.bulkActions.map((action) => ({
      ...action,
      onAction: (selectedIds) =>
        args.onBulkAction(
          action.key,
          selectedIds,
          currentRows,
          updateRowsForStory,
          setRowSelectionModel
        ),
    }));
  }

  const storyLayout = args.layout || 'fullscreen';

  const calculateHeight = (storyArgs: Object, layout: string) => {
    if (storyArgs.autoHeight) {
      return undefined;
    }
    if (storyArgs.height) {
      return storyArgs.height;
    }
    return layout === 'fullscreen' ? 'calc(100vh - 80px)' : 600;
  };

  const calculatedWidth =
    args.width || (storyLayout === 'fullscreen' ? '100%' : '950px');

  const calculatedPadding = args.noPadding ? 0 : 2;

  const boxStyles = {
    height: calculateHeight(args, storyLayout),
    width: calculatedWidth,
    p: calculatedPadding,
    boxSizing: 'border-box',
  };

  return (
    <Box sx={boxStyles}>
      {args.storyTitle && !args.noTitle && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{ p: storyLayout === 'fullscreen' ? 2 : 0, mb: 1 }}
        >
          {args.storyTitle}
        </Typography>
      )}
      <DataGridPremium
        {...commonProps}
        {...args}
        rows={currentRows}
        bulkActions={storyBulkActions}
      />
    </Box>
  );
};

// Stories

export const Default = {
  render: Template,
  args: {
    storyTitle: 'Default Configuration (Standard Toolbar)',
    rows: sampleRows,
    columns: baseColumns,
    height: 450,
    layout: 'centered',
    width: '950px',
    asyncPagination: false,
  },
};

export const WithBulkActions = {
  render: Template,
  args: {
    storyTitle: 'With Bulk Actions Toolbar',
    rows: [...sampleRows],
    columns: baseColumns,
    layout: 'centered',
    height: 450,
    width: '950px',
    checkboxSelection: true,
    bulkActions: [
      {
        key: 'delete',
        label: 'Delete',
        icon: <KitmanIcon name={KITMAN_ICON_NAMES.Delete} fontSize="small" />,
      },
      {
        key: 'archive',
        label: 'Archive',
        icon: (
          <KitmanIcon
            name={KITMAN_ICON_NAMES.ArchiveOutlined}
            fontSize="small"
          />
        ),
      },
    ],
    onBulkAction: (
      actionKey: string,
      selectedIds: Array<string | number>,
      currentStoryRows: GridRowsProp,
      setStoryRows: (newRows: GridRowsProp) => void,
      setStorySelectionModel: (newSelectionModel: GridRowSelectionModel) => void
    ) => {
      // eslint-disable-next-line no-alert
      alert(`Action: ${actionKey} on IDs: ${selectedIds.join(', ')}`);

      let newRows = [...currentStoryRows];

      if (actionKey === 'delete') {
        newRows = currentStoryRows.filter(
          (row) => !selectedIds.includes(row.id)
        );
      } else if (actionKey === 'archive') {
        newRows = currentStoryRows.map((row) =>
          selectedIds.includes(row.id)
            ? { ...row, status: 'Archived (Bulk)' }
            : row
        );
      }
      setStoryRows(newRows);
      setStorySelectionModel([]);
    },
    excelExportOptions: { fileName: 'bulk-action-export' },
  },
};

export const LoadingSpinner = {
  render: Template,
  args: {
    storyTitle: 'Loading State - Spinner Overlay',
    rows: [],
    columns: baseColumns,
    loading: true,
    loadingVariant: 'spinner',
    height: 300,
    layout: 'centered',
    width: '950px',
  },
};

export const LoadingSkeleton = {
  render: Template,
  args: {
    storyTitle: 'Loading State - Skeleton Overlay',
    rows: [...sampleRows],
    columns: baseColumns,
    loading: true,
    loadingVariant: 'skeleton',
    height: 500,
    layout: 'centered',
    width: '950px',
  },
};

export const LoadingLinearProgress = {
  render: Template,
  args: {
    storyTitle: 'Loading State - Linear Progress Overlay',
    rows: [...sampleRows],
    columns: baseColumns,
    loading: true,
    loadingVariant: 'linear-progress',
    layout: 'centered',
    width: '950px',
  },
};

export const LoadingNone = {
  render: Template,
  args: {
    storyTitle:
      'Loading State - No Visible Overlay (loading=true, variant=none)',
    rows: [],
    columns: baseColumns,
    loading: true,
    loadingVariant: 'none',
    layout: 'centered',
    width: '950px',
  },
};

export const CustomizedStandardToolbar = {
  render: Template,
  args: {
    storyTitle: 'Customized Standard Toolbar (No Bulk Actions)',
    rows: sampleRows,
    columns: baseColumns,
    showQuickFilter: true,
    showDensitySelectorButton: false,
    showExportButton: true,
    excelExportOptions: {
      fileName: 'custom-toolbar-export',
      includeHeaders: true,
    },
    showColumnSelectorButton: true,
    showFilterButton: false,
    layout: 'centered',
    width: '950px',
  },
};

export const MinimalStandardToolbar = {
  render: Template,
  args: {
    storyTitle: 'Minimal Standard Toolbar (QuickFilter Only)',
    rows: sampleRows,
    columns: baseColumns,
    showQuickFilter: true,
    showDensitySelectorButton: false,
    showExportButton: false,
    showColumnSelectorButton: false,
    showFilterButton: false,
    layout: 'centered',
    width: '950px',
  },
};

export const NoToolbarAtAll = {
  render: Template,
  args: {
    storyTitle: 'No Toolbar Visible',
    rows: sampleRows,
    columns: baseColumns,
    showQuickFilter: false,
    showDensitySelectorButton: false,
    showExportButton: false,
    showColumnSelectorButton: false,
    showFilterButton: false,
    layout: 'centered',
    width: '950px',
  },
};

export const WithFooterHidden = {
  render: Template,
  args: {
    storyTitle: 'Footer Completely Hidden',
    rows: sampleRows,
    columns: baseColumns,
    hideFooter: true,
    checkboxSelection: true,
    bulkActions: [{ key: 'dummy', label: 'Dummy Action' }], // To ensure bulk toolbar logic if wrapper depends on it
    layout: 'centered',
    width: '950px',
  },
};

export const ServerSidePaginationWithCustomComponent = {
  render: ServerSidePaginationTemplate,
  args: {
    storyTitle: 'Server-Side Pagination (with Custom Pagination Component)',
    columns: [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', width: 200, editable: true },
      { field: 'category', headerName: 'Category', width: 150 },
      { field: 'quantity', headerName: 'Quantity', type: 'number', width: 120 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'lastUpdated', headerName: 'Last Updated', width: 150 },
    ],
    pageNumber: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showQuickFilter: false,
    showColumnSelectorButton: true,
    showFilterButton: false,
    showDensitySelectorButton: true,
    showExportButton: false,
    height: 550,
    layout: 'centered',
    width: '950px',
  },
  argTypes: {
    rows: { control: false },
    loading: { control: false },
    rowCount: {
      control: 'number',
      description: 'Total rows from server (info only for controls)',
    },
    pageNumber: { control: 'number', description: 'Current page (0-indexed)' },
    pageSize: { control: 'number', description: 'Rows per page' },
    asyncPagination: { control: false },
    onAsyncPaginationModelChange: { action: 'onAsyncPaginationModelChange' },
    initialPageSize: { control: false },
  },
  parameters: {
    docs: {
      storyDescription:
        'Demonstrates server-side pagination. Data is fetched in pages. The grid uses `asyncPagination=true` and receives `rowCount`, `pageNumber`, `pageSize`, and an `onAsyncPaginationModelChange` callback. This should also render your custom pagination component if the `slots.pagination` logic is correctly in place in the wrapper.',
    },
  },
};

export const WithSelectedRowCountInFooter = {
  render: Template,
  args: {
    storyTitle: 'Footer Visible - Including Selected Row Count',
    rows: sampleRows,
    columns: baseColumns,
    hideFooter: false,
    hideFooterSelectedRowCount: false,
    checkboxSelection: true,
    bulkActions: [
      {
        key: 'archive',
        label: 'Archive',
        icon: (
          <KitmanIcon
            name={KITMAN_ICON_NAMES.ArchiveOutlined}
            fontSize="small"
          />
        ),
      },
    ],
    onBulkAction: (actionKey: string, selectedIds: Array<string | number>) =>
      // eslint-disable-next-line no-alert
      alert(`Action: ${actionKey} on IDs: ${selectedIds.join(', ')}`),
    layout: 'centered',
    width: '950px',
  },
};

export const PaginationCustomInitialPageSize = {
  render: Template,
  args: {
    storyTitle: 'Pagination - Custom Initial Page Size (3 rows)',
    rows: sampleRows,
    columns: baseColumns,
    pageSize: 3,
    pageSizeOptions: [3, 6, 9, 12, sampleRows.length],
    height: 370,
    layout: 'centered',
    width: '950px',
    asyncPagination: false,
  },
};

export const PaginationFewOptions = {
  render: Template,
  args: {
    storyTitle: 'Pagination - Limited Page Size Options ([10, 20])',
    rows: sampleRows,
    columns: baseColumns,
    pageSize: 10,
    pageSizeOptions: [10, 20],
    height: 550,
    layout: 'centered',
    width: '950px',
    asyncPagination: false,
  },
};

export const WithAutoHeight = {
  render: Template,
  args: {
    storyTitle: 'Grid with Auto Height (Few Rows)',
    rows: sampleRows.slice(0, 4),
    columns: baseColumns,
    autoHeight: true,
    layout: 'centered',
    width: '950px',
  },
};

export const WithAutoHeightManyRows = {
  render: Template,
  args: {
    storyTitle: 'Grid with Auto Height (Many Rows - Page Scroll)',
    rows: sampleRows,
    columns: baseColumns,
    autoHeight: true,
    // For fullscreen, the Box will try to take available height.
    // For centered, it will expand fully. Set a max-height on a parent in a real app if needed.
    layout: 'centered',
    width: '950px',
  },
};

export const ExcelExportCustomFilenameNoHeaders = {
  render: Template,
  args: {
    storyTitle: 'Excel Export - Custom Filename, No Headers',
    rows: sampleRows,
    columns: baseColumns,
    showExportButton: true,
    excelExportOptions: {
      fileName: 'inventory_data_no_headers',
      includeHeaders: false,
    },
  },
};

export const ExcelExportCustomSheetAndFields = {
  render: Template,
  args: {
    storyTitle: 'Excel Export - Custom Sheet Name & Specific Fields',
    rows: sampleRows,
    columns: baseColumns,
    showExportButton: true,
    excelExportOptions: {
      fileName: 'selected_inventory_report',
      sheetName: 'Inventory Report',
      fields: ['name', 'category', 'quantity'],
      includeHeaders: true,
    },
  },
};

export const InitialStateSortedByNameDescending = {
  render: Template,
  args: {
    storyTitle: 'Initial State - Sorted by Name (Descending)',
    rows: sampleRows,
    columns: baseColumns,
    initialState: {
      sorting: {
        sortModel: [{ field: 'name', sort: 'desc' }],
      },
    },
  },
};

export const InitialStateFilteredByCategory = {
  render: Template,
  args: {
    storyTitle: 'Initial State - Filtered by Category "Gadgets"',
    rows: sampleRows,
    columns: baseColumns,
    initialState: {
      filter: {
        filterModel: {
          items: [{ field: 'category', operator: 'equals', value: 'Gadgets' }],
        },
      },
    },
  },
};

export const InitialStatePinnedColumn = {
  render: Template,
  args: {
    storyTitle: 'Initial State - ID Column Pinned Left',
    rows: sampleRows,
    columns: baseColumns,
    initialState: {
      pinnedColumns: { left: ['id'] },
    },
  },
};

export const InitialStateMultipleConfigurations = {
  render: Template,
  args: {
    storyTitle: 'Initial State - Sorted, Filtered, and Pinned',
    rows: sampleRows,
    columns: baseColumns,
    initialState: {
      sorting: {
        sortModel: [{ field: 'quantity', sort: 'asc' }],
      },
      filter: {
        filterModel: {
          items: [
            { field: 'status', operator: 'equals', value: 'Active' },
            { field: 'quantity', operator: '>', value: '10' },
          ],
          linkOperator: GridLinkOperator?.And,
        },
      },
      pinnedColumns: { left: ['name'], right: ['quantity'] },
    },
  },
};

export const RowGroupingByCategory = {
  render: Template,
  args: {
    storyTitle: 'Row Grouping - Grouped by Category (Initially Collapsed)',
    rows: sampleRows,
    columns: baseColumns,
    rowGroupingModel: ['category'],
    defaultGroupingExpansionDepth: 0,
    height: 'calc(100vh - 100px)',
  },
};

export const RowGroupingByStatusExpanded = {
  render: Template,
  args: {
    storyTitle: 'Row Grouping - Grouped by Status (Initially Expanded)',
    rows: sampleRows,
    columns: baseColumns,
    rowGroupingModel: ['status'],
    defaultGroupingExpansionDepth: -1,
    height: 'calc(100vh - 100px)',
  },
};

export const RowGroupingMultipleLevels = {
  render: Template,
  args: {
    storyTitle: 'Row Grouping - Multi-level (Category then Status)',
    rows: sampleRows,
    columns: baseColumns,
    rowGroupingModel: ['category', 'status'],
    defaultGroupingExpansionDepth: 0,
    height: 'calc(100vh - 100px)',
  },
};

export const CellSelectionEnabled = {
  render: Template,
  args: {
    storyTitle: 'Cell Selection Enabled (Single Cell)',
    rows: sampleRows,
    columns: baseColumns,
    cellSelection: true,
    checkboxSelection: false,
    disableRowSelectionOnClick: true,
    height: 500,
    layout: 'centered',
    width: '950px',
  },
  parameters: {
    docs: {
      storyDescription:
        'Demonstrates cell selection. Click on individual cells to select them. Shift+click or Ctrl/Cmd+click can be used for range or multiple cell selection. The `cellSelection` prop enables this mode.',
    },
  },
};

export const CellAndRowSelection = {
  render: Template,
  args: {
    storyTitle: 'Cell and Row Selection Enabled',
    rows: sampleRows,
    columns: baseColumns,
    cellSelection: true,
    checkboxSelection: true,
    disableRowSelectionOnClick: false,
    height: 500,
    layout: 'centered',
    width: '950px',
  },
  parameters: {
    docs: {
      storyDescription:
        'Demonstrates having both cell selection and row selection active. Interacting with checkboxes selects rows, while direct cell clicks can select cells. Row selection on cell click depends on `disableRowSelectionOnClick`.',
    },
  },
};
