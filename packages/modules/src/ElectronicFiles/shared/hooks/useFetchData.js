// @flow
import { useSelector } from 'react-redux';
import {
  useSearchInboundElectronicFileListQuery,
  useSearchOutboundElectronicFileListQuery,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import {
  selectSelectedMenuItem,
  MENU_ITEM,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  defaultFilters,
  defaultPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import type {
  GridFilters,
  GridPagination,
  ElectronicFile,
  Meta,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

type InitialData = {
  data: Array<ElectronicFile>,
  meta: Meta,
};

export type ReturnType = {
  isFileListFetching: boolean,
  isFileListLoading: boolean,
  isFileListSuccess: boolean,
  isFileListError: boolean,
  fileList: InitialData,
};

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

const useFetchData = ({
  filters = defaultFilters,
  pagination = defaultPagination,
}: {
  filters: GridFilters,
  pagination: GridPagination,
}): ReturnType => {
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  const {
    data: inboundFileList = initialData,
    isFetching: isInboundFileListFetching,
    isLoading: isInboundFileListLoading,
    isSuccess: isInboundFileListSuccess,
    isError: isInboundFileListError,
  } = useSearchInboundElectronicFileListQuery(
    {
      filters,
      pagination,
    },
    { skip: selectedMenuItem !== MENU_ITEM.inbox }
  );

  const {
    data: outboundFileList = initialData,
    isFetching: isOutboundFileListFetching,
    isLoading: isOutboundFileListLoading,
    isSuccess: isOutboundFileListSuccess,
    isError: isOutboundFileListError,
  } = useSearchOutboundElectronicFileListQuery(
    {
      filters,
      pagination,
    },
    { skip: selectedMenuItem !== MENU_ITEM.sent }
  );

  let fileList = initialData;
  let isFileListFetching = false;
  let isFileListLoading = false;
  let isFileListSuccess = false;
  let isFileListError = false;

  if (selectedMenuItem === MENU_ITEM.inbox) {
    fileList = inboundFileList;
    isFileListFetching = isInboundFileListFetching;
    isFileListLoading = isInboundFileListLoading;
    isFileListSuccess = isInboundFileListSuccess;
    isFileListError = isInboundFileListError;
  }
  if (selectedMenuItem === MENU_ITEM.sent) {
    fileList = outboundFileList;
    isFileListFetching = isOutboundFileListFetching;
    isFileListLoading = isOutboundFileListLoading;
    isFileListSuccess = isOutboundFileListSuccess;
    isFileListError = isOutboundFileListError;
  }

  return {
    isFileListFetching,
    isFileListLoading,
    isFileListSuccess,
    isFileListError,
    fileList,
  };
};

export default useFetchData;
