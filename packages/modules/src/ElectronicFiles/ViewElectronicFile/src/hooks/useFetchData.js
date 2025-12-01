// @flow
import { useSelector } from 'react-redux';
import {
  useFetchInboundElectronicFileQuery,
  useFetchOutboundElectronicFileQuery,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import {
  selectSelectedMenuItem,
  MENU_ITEM,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { selectStateFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import type {
  ElectronicFile,
  NavMeta,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

type InitialData = {
  data: ?ElectronicFile,
  meta: NavMeta,
};

export type ReturnType = {
  isFileFetching: boolean,
  isFileLoading: boolean,
  isFileSuccess: boolean,
  isFileError: boolean,
  file: InitialData,
  error: ?any,
};

export const initialData: InitialData = {
  data: null,
  meta: {
    prev_id: null,
    next_id: null,
  },
};

const useFetchData = ({ id }: { id: number }): ReturnType => {
  const selectedMenuItem = useSelector(selectSelectedMenuItem);
  const stateFilters = useSelector(selectStateFilters);
  const filters = stateFilters[selectedMenuItem];

  const {
    data: inboundFile = initialData,
    error: inboundFileError,
    isFetching: isInboundFileFetching,
    isLoading: isInboundFileLoading,
    isSuccess: isInboundFileSuccess,
    isError: isInboundFileError,
  } = useFetchInboundElectronicFileQuery(
    {
      id,
      filters,
    },
    { skip: selectedMenuItem !== MENU_ITEM.inbox }
  );

  const {
    data: outboundFile = initialData,
    error: outboundFileError,
    isFetching: isOutboundFileFetching,
    isLoading: isOutboundFileLoading,
    isSuccess: isOutboundFileSuccess,
    isError: isOutboundFileError,
  } = useFetchOutboundElectronicFileQuery(
    {
      id,
      filters,
    },
    { skip: selectedMenuItem !== MENU_ITEM.sent }
  );

  let file = initialData;
  let error = null;
  let isFileFetching = false;
  let isFileLoading = false;
  let isFileSuccess = false;
  let isFileError = false;

  if (selectedMenuItem === MENU_ITEM.inbox) {
    file = inboundFile;
    error = inboundFileError;
    isFileFetching = isInboundFileFetching;
    isFileLoading = isInboundFileLoading;
    isFileSuccess = isInboundFileSuccess;
    isFileError = isInboundFileError;
  }
  if (selectedMenuItem === MENU_ITEM.sent) {
    file = outboundFile;
    error = outboundFileError;
    isFileFetching = isOutboundFileFetching;
    isFileLoading = isOutboundFileLoading;
    isFileSuccess = isOutboundFileSuccess;
    isFileError = isOutboundFileError;
  }

  return {
    isFileFetching,
    isFileLoading,
    isFileSuccess,
    isFileError,
    file,
    error,
  };
};

export default useFetchData;
