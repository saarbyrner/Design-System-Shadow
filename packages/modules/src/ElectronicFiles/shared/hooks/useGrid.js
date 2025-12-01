// @flow
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { GridRow, GridColDef } from '@mui/x-data-grid-pro';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import { selectSelectedMenuItem } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  selectPersistedFilters,
  updatePersistedFilter,
  selectPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import {
  updateOpen,
  updateAllocations,
  updateAttachments,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/dialogSlice';
import {
  FIELD_KEY,
  type GridConfig,
  type GridFilters,
  type Meta,
  type ElectronicFile,
  type AllocationAttribute,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  getReceivedFromColumn,
  getSentToColumn,
  getTitleColumn,
  getAttachmentColumn,
  getAttachmentsColumn,
  getAttachedToColumn,
  getDateColumn,
  getStatusColumn,
  getActionsColumn,
} from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Columns';
import useFetchData from '@kitman/modules/src/ElectronicFiles/shared/hooks/useFetchData';
import useRowActions from '@kitman/modules/src/ElectronicFiles/shared/hooks/useRowActions';

type InitialData = {
  data: Array<ElectronicFile>,
  meta: Meta,
};

export type ReturnType = {
  isFileListFetching: boolean,
  isFileListLoading: boolean,
  isFileListSuccess: boolean,
  isFileListError: boolean,
  onSearch: (searchString: string) => void,
  onUpdateFilter: (partialFilter: $Shape<GridFilters>) => void,
  grid: GridConfig,
  meta: Meta,
  filters: GridFilters,
};

export const getEmptyTableText = (filters: GridFilters) =>
  filters?.query?.length > 0
    ? i18n.t('No eFiles match the search criteria')
    : i18n.t('No eFiles found');

const gridId = 'electronicFilesGrid';

export const initialData: InitialData = {
  data: [],
  meta: {
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  },
};

export const columnSets = {
  inbox: [getReceivedFromColumn(), getAttachmentColumn(), getDateColumn()],
  sent: [
    getSentToColumn(),
    getTitleColumn(),
    getStatusColumn(),
    getDateColumn(),
  ],
};

const useGrid = (): ReturnType => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const persistedFilters = useSelector(selectPersistedFilters);
  const filters = persistedFilters[selectedMenuItem];
  const pagination = useSelector(selectPagination);

  const {
    fileList,
    isFileListFetching,
    isFileListLoading,
    isFileListSuccess,
    isFileListError,
  } = useFetchData({ filters, pagination });

  const onAttachedToChipClick = (allocations: Array<AllocationAttribute>) => {
    dispatch(updateAllocations(allocations));
    dispatch(updateOpen(true));
  };

  const onAttachmentsChipClick = (attachments: Array<Attachment>) => {
    dispatch(updateAttachments(attachments));
    dispatch(updateOpen(true));
  };

  const attachedToColumnIndex = 2;
  const actionsColumnIndex = 4;
  const attachmentsColumnIndex = 2;

  // add onAttachedToChipClick
  if (columnSets.inbox[attachedToColumnIndex]?.field !== FIELD_KEY.attachedTo) {
    columnSets.inbox.splice(
      attachedToColumnIndex,
      0,
      getAttachedToColumn(onAttachedToChipClick)
    );
  }

  // add useRowActions
  if (columnSets.inbox[actionsColumnIndex]?.field !== FIELD_KEY.actions) {
    columnSets.inbox.splice(
      actionsColumnIndex,
      0,
      getActionsColumn({
        rowActions: useRowActions,
      })
    );
  }

  // add onAttachmentsChipClick
  if (
    columnSets.sent[attachmentsColumnIndex]?.field !== FIELD_KEY.attachments
  ) {
    columnSets.sent.splice(
      attachmentsColumnIndex,
      0,
      getAttachmentsColumn(onAttachmentsChipClick)
    );
  }

  const columns: Array<GridColDef> = useMemo(
    () => columnSets[selectedMenuItem].filter((column) => column.visible),
    [selectedMenuItem]
  );

  const buildRowData = (files): Array<GridRow> => {
    return files;
  };

  const rows = useMemo(() => buildRowData(fileList.data), [fileList.data]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(filters),
    id: gridId,
  };

  const onUpdateFilter = (partialFilter: $Shape<GridFilters>) => {
    dispatch(updatePersistedFilter({ selectedMenuItem, partialFilter }));
  };

  const onSearch = useDebouncedCallback((searchString: string) => {
    dispatch(
      updatePersistedFilter({
        selectedMenuItem,
        partialFilter: {
          query: searchString,
        },
      })
    );
  }, 400);

  // cancel debounce on unmount
  useEffect(() => () => onSearch?.cancel?.(), [onSearch]);

  return {
    isFileListFetching,
    isFileListLoading,
    isFileListSuccess,
    isFileListError,
    onSearch,
    onUpdateFilter,
    grid,
    meta: fileList.meta,
    filters,
  };
};

export default useGrid;
