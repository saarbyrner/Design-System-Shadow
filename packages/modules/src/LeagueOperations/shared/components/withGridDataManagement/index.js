// @flow
import {
  type GridColDef,
  type GridRowParams,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GRID_ACTIONS_COLUMN_TYPE,
} from '@mui/x-data-grid-pro';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '@kitman/common/src/variables';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { extraSmallIconSize } from '@kitman/playbook/icons/consts';
import { getBulkActionsState } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import {
  onSetSelectedLabelIds,
  onSetOriginalSelectedLabelIds,
  onSetSelectedAthleteIds,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import { ActionBarTranslated as ActionBar } from '@kitman/modules/src/LeagueOperations/shared/components/GridBulkActionBar/index';
import { useLocationHash } from '@kitman/common/src/hooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { IconButton } from '@mui/material';
import type { GridQueryParam } from '@kitman/modules/src/LeagueOperations/shared/types/common/index';
import type { Node } from 'react';
import {
  Box,
  GridActionsCellItem,
  DataGrid as MuiDataGrid,
} from '@kitman/playbook/components';
import type { ReturnType } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import { MUI_DATAGIRD_ROW_HEIGHT } from '@kitman/modules/src/LeagueOperations/shared/consts';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useManageGridData from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';

import ListLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ListLayout';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import TAB_HASHES from './utils/index';
import { onTransformColumns } from '../GridConfiguration/columns';
import type { RequestStatus } from '../../hooks/useManageGridData';

type WrapperProps<FilterShape> = {
  requestStatus: RequestStatus,
  onUpdate: ($Shape<FilterShape>) => void,
  filters: FilterShape,
};

type Props<RawDataType, TransformDataType, FilterShape> = {
  useSearchQuery: () => void,
  onTransformData: (Array<RawDataType>) => Array<TransformDataType>,
  initialFilters: FilterShape,
  title?: string,
  slots?: {
    filters?: (WrapperProps<FilterShape>) => Node,
    expandableRow?: (TransformDataType, Function) => Node,
    onGetActions?: (params: GridRowParams) => Array<GridActionsCellItem>,
    bulkAction?: string,
  },
  expandRowKey?: ?string,
  additionalRequestsState?: ?{
    isLoading: boolean,
    isError: boolean,
  },
  isFullRowClickable?: boolean,
  gridName?: string,
  enableFiltersPersistence?: boolean,
};

/**
 * A generic, stongly typed HOC for MUI DataGrid grid within League Operations.
 *
 * @param {Function} useSearchQuery RTK query hook
 * @param {Function} gridQueryParams RTK query hook for building the grid structure
 * @param {FiltersShape} initialFilters post params to be used with the query
 * @param {Function} onTransformData a function that accepts a raw data type form a service and transforms into a grid row object
 * @param {Node} slots UI elements display
 * @param {string} title The grid title
 * @param {string} expandRowKey If the slot expandableRow is provided, we must provide a key to validate on
 * @param {Object} additionalRequestsState Should we want to delay showing the content until other unrelated requests have resolved, we can this here
 * @param {boolean} isFullRowClickable When true, the pointer cursor shows when hovering over the entire row
 * @returns {Node}
 * @example
 * const TabDataTypeList = withGridDataManagement<
    MyRawDataType,
    TransformedDataType,
    MyQueryFilters
  >({
    title: 'My Title',
    useSearchQuery: useMyQuery,
    initialFilters: defaultMyQueryFilters,
    onTransformData: transformToMyDatatypeRows,
    slots: {
      filters: ({ onUpdate, filters, requestStatus }) => (
        <>
          <ElementOne/>
          <ElementTwo/>
        </>
      ),
      expandableRow: (row: TransformDataType) => {
        <>My bespoke row</>
      }
    }
  });
 */

type OverlayProps = {
  noResultsMessage: string,
};
type ResponseData = { [key: string]: any };
type RawResponseDataType = Array<ResponseData>;

const getLabelsForSelectedIds = (
  data: RawResponseDataType,
  selection: Array<number>
) => {
  const selectedRowsData: RawResponseDataType = [];

  selection.forEach((selected) => {
    const selectedRow = data.find((row) => row.id === selected);
    if (selectedRow) {
      selectedRowsData.push(selectedRow);
    }
  });

  const unionLabels = selectedRowsData.reduce(
    (acc: RawResponseDataType, selectedRowData: ResponseData) => {
      const selectedRowDataLabels = selectedRowData.labels || [];

      return [...acc, ...selectedRowDataLabels];
    },
    []
  );

  return unionLabels.reduce((acc, currentLabel) => {
    const targetLabel = acc.find((item) => item.id === currentLabel.id);

    if (!targetLabel) {
      acc.push(currentLabel);
    }
    return acc;
  }, []);
};

const NoRowsOverlay = (props: OverlayProps): Node => {
  return (
    <Box
      sx={{
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      {props.noResultsMessage}
    </Box>
  );
};

const getToggleColumn = (renderExpandToggle: Function) => {
  return {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderCell: renderExpandToggle,
  };
};

type ToggleProps = {
  isExpanded: boolean,
  onToggle: (number) => void,
};

const IconToggle = (props: ToggleProps) => {
  return (
    <IconButton aria-label="expand row" size="small" onClick={props.onToggle}>
      <KitmanIcon
        name={
          props.isExpanded
            ? KITMAN_ICON_NAMES.KeyboardArrowUpIcon
            : KITMAN_ICON_NAMES.KeyboardArrowDownIcon
        }
        fontSize={extraSmallIconSize}
      />
    </IconButton>
  );
};

const getActionColumn = (
  getActions: (params: GridRowParams) => Array<GridActionsCellItem>
): Node => {
  return {
    ...GRID_ACTIONS_COLUMN_TYPE,
    field: 'actions',
    headerName: '',
    type: 'actions',
    flex: 0,
    align: 'right',
    getActions: (params) => getActions(params),
  };
};

function withGridDataManagement<
  RawDataType,
  TransformDataType,
  FilterShape: { [key: string]: any }
>({
  useSearchQuery,
  initialFilters,
  onTransformData,
  title,
  slots,
  expandRowKey,
  additionalRequestsState,
  isFullRowClickable,
  gridName,
  enableFiltersPersistence = false,
}: Props<RawDataType, TransformDataType, FilterShape>) {
  return ({
    filterOverrides = {},
    gridQueryParams,
  }: {
    filterOverrides?: $Shape<FilterShape>,
    gridQueryParams: GridQueryParam,
  }) => {
    const dispatch = useDispatch();
    const dataGridRef = useRef();
    const [expandedRows, setExpandedRows] = useState([]);
    const locationHash = useLocationHash();
    const isPlayersTab = locationHash === TAB_HASHES.players;
    const { permissions } = usePermissions();
    const locationAssign = useLocationAssign();
    const bulkActionsState = useSelector(getBulkActionsState);
    const selectedIds = bulkActionsState?.selectedAthleteIds;

    const canManageAthletesLabels = permissions?.settings?.canAssignLabels;
    const canViewAthletesLabels = permissions?.homegrown?.canViewHomegrown;

    const toggleRowExpansion = (rowId) => {
      setExpandedRows((prevExpandedRows) => {
        if (prevExpandedRows.includes(rowId)) {
          return prevExpandedRows.filter((id) => id !== rowId);
        }
        return [...prevExpandedRows, rowId];
      });
    };

    const {
      response,
      rowIdToUserIdMap,
      actions,
      filters,
      noResultsMessage,
      columns,
      requestStatus,
    }: ReturnType<RawDataType, FilterShape> = useManageGridData<
      RawDataType,
      FilterShape
    >({
      useSearchQuery,
      gridQueryParams,
      bulkAction: slots?.bulkAction,
      initialFilters: { ...initialFilters, ...filterOverrides },
      gridName,
      enableFiltersPersistence,
    });

    if (requestStatus.isLoading || additionalRequestsState?.isLoading) {
      return <ListLayout.LoadingLayout />;
    }

    const rows: Array<TransformDataType> = response.data
      ? onTransformData(response.data)
      : [];

    const transformedColumns: Array<GridColDef> = columns
      ? onTransformColumns({
          cols: columns,
          viewLabel: canViewAthletesLabels,
          permissions,
        })
      : [];

    const renderFilters = () => {
      if (slots?.filters) {
        return (
          <ListLayout.Filters>
            {slots.filters({
              onUpdate: actions.onUpdate,
              filters,
              requestStatus,
            })}
          </ListLayout.Filters>
        );
      }
      return null;
    };

    // What does this do:
    // If the current row has a subset of items we wish to show, provided by the expandRowKey
    // We show the toggle element.
    const renderExpandToggle = (params) => {
      if (params.row?.[expandRowKey]?.length <= 1) {
        return null;
      }
      if (params.row?.[expandRowKey]) {
        return (
          <IconToggle
            isExpanded={expandedRows.includes(params.row.id)}
            onToggle={() => toggleRowExpansion(params.row.id)}
          />
        );
      }
      return null;
    };

    // If the current row has a subset of items we wish to show, provided by the expandRowKey
    // We allow for rendering of the content to display, provided via slots.
    const getDetailPanelContent = (params) => {
      if (params?.row?.[expandRowKey] && slots?.expandableRow) {
        return (
          <Box sx={{ minHeight: MUI_DATAGIRD_ROW_HEIGHT }}>
            {slots.expandableRow(params.row)}
          </Box>
        );
      }
      return null;
    };

    // only show the expand icon if the row has a subset of items we wish to show
    const getRowExpended = expandRowKey &&
      slots?.expandableRow && {
        getDetailPanelContent,
      };

    const hasFilter = Object.keys(filters).length > 0;

    const renderContent = (): Node => {
      if (
        requestStatus.isLoading ||
        requestStatus.isError ||
        additionalRequestsState?.isLoading ||
        additionalRequestsState?.isError
      ) {
        return null;
      }

      const handleOnRowClick = (params) => {
        if (params.row?.onRowClick) {
          params.row?.onRowClick();
        } else if (isFullRowClickable && params.row?.league?.href) {
          locationAssign(params.row.league.href);
        }
      };

      const buildColumns = () => {
        const combinedColumns = [
          getToggleColumn(renderExpandToggle),
          ...transformedColumns,
        ];

        if (slots?.onGetActions) {
          combinedColumns.push(getActionColumn(slots.onGetActions));
        }

        return combinedColumns;
      };

      const onRowSelectionModelChange = (selection: Array<number>) => {
        const mappedIds = selection.map((id) => ({
          id,
          userId: rowIdToUserIdMap.get(id),
        }));
        dispatch(onSetSelectedAthleteIds(mappedIds));

        const preselectedLabelsIdForSelection = getLabelsForSelectedIds(
          // $FlowFixMe as <RawDataType> does not match the declared type, and RAwDataType needs to be kept as any
          response.data,
          selection
        );

        dispatch(
          onSetOriginalSelectedLabelIds(
            preselectedLabelsIdForSelection.map((label) => label.id)
          )
        );
        dispatch(
          onSetSelectedLabelIds(
            preselectedLabelsIdForSelection.map((label) => label.id)
          )
        );
      };

      return (
        <MuiDataGrid
          rowSelection
          getRowHeight={() => 43}
          disableRowSelectionOnClick
          checkboxSelection={
            canManageAthletesLabels && slots?.bulkAction === 'athlete'
          }
          rowSelectionModel={bulkActionsState.selectedAthleteIds.map(
            ({ id }) => id
          )}
          onRowSelectionModelChange={
            canManageAthletesLabels && onRowSelectionModelChange
          }
          rows={rows}
          ref={dataGridRef}
          infiniteLoading
          pageNumber={response?.meta?.current_page - 1}
          pageSize={30}
          rowCount={rows.length}
          paginationMode="server"
          columns={buildColumns()}
          disableVirtualization
          slots={{
            detailPanelExpandIcon: ExpandMoreIcon,
            detailPanelCollapseIcon: ExpandLessIcon,
            noRowsOverlay: () => (
              <NoRowsOverlay noResultsMessage={noResultsMessage} />
            ),
          }}
          {...getRowExpended}
          getDetailPanelHeight={() => 'auto'}
          onRowClick={handleOnRowClick}
          infiniteLoadingCall={(nextPage: number) => {
            if (rows?.length) {
              actions.onScroll(nextPage);
            }
          }}
          loading={requestStatus.isFetching}
          hideFooter
          sx={{
            background: colors.white,
            '.MuiDataGrid-row--detailPanelExpanded': {
              background: colors.light_transparent_background,
            },
            '.MuiDataGrid-row': {
              cursor: isFullRowClickable ? 'pointer' : 'auto',
            },
          }}
        />
      );
    };

    return (
      <ListLayout>
        <ListLayout.Content>
          {title && (
            <ListLayout.Title withPaddingBottom={hasFilter}>
              {title}
            </ListLayout.Title>
          )}
          {selectedIds.length > 0 && isPlayersTab ? (
            <ActionBar selectedAthleteIds={selectedIds} />
          ) : (
            slots?.filters && renderFilters()
          )}
        </ListLayout.Content>
        {renderContent()}
      </ListLayout>
    );
  };
}

export default withGridDataManagement;
