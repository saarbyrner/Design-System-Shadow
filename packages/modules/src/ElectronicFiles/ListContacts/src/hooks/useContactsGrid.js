// @flow
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { GridRow, GridColDef } from '@mui/x-data-grid-pro';
import {
  useSearchContactListQuery,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import {
  selectFilters,
  selectPagination,
  updateFilter,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import {
  FIELD_KEY,
  type GridConfig,
  type ContactsGridFilters,
  type Meta,
  type ExistingContact,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  getToggleContactFavoriteColumn,
  getCompanyNameColumn,
  getFaxNumberColumn,
  getNameColumn,
  getActionsColumn,
} from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Columns';
import useRowActions from '@kitman/modules/src/ElectronicFiles/shared/hooks/useRowActions';

type InitialData = {
  data: Array<ExistingContact>,
  meta: Meta,
};

export type ReturnType = {
  isContactListFetching: boolean,
  isContactListLoading: boolean,
  isContactListSuccess: boolean,
  isContactListError: boolean,
  onSearch: (searchString: string) => void,
  onUpdateFilter: (partialFilter: $Shape<ContactsGridFilters>) => void,
  grid: GridConfig,
  meta: Meta,
  filters: ContactsGridFilters,
};

export const getEmptyTableText = (filters: ContactsGridFilters) =>
  filters.query.length > 0
    ? i18n.t('No contacts match the search criteria')
    : i18n.t('No contacts found');

const gridId = 'contactsGrid';

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

const defaultColumns = [
  getNameColumn(),
  getCompanyNameColumn(),
  getFaxNumberColumn(),
];

const useContactsGrid = (): ReturnType => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);

  const [makeContactFavorite] = useMakeContactFavoriteMutation();
  const [deleteContactFavorite] = useDeleteContactFavoriteMutation();

  const {
    data: contactList = initialData,
    isFetching: isContactListFetching,
    isLoading: isContactListLoading,
    isSuccess: isContactListSuccess,
    isError: isContactListError,
  } = useSearchContactListQuery({
    filters,
    pagination,
  });

  const onToggleContactFavorite = (id: number, checked: boolean) => {
    if (checked) {
      makeContactFavorite({ itemId: id });
    } else {
      deleteContactFavorite({ itemId: id });
    }
  };

  const toggleContactFavoriteColumnIndex = 0;
  const actionsColumnIndex = 4;

  // add onToggleContactFavorite
  if (
    !defaultColumns.some(
      (defaultColumn) =>
        defaultColumn.field === FIELD_KEY.toggle_contact_favorite
    )
  ) {
    defaultColumns.splice(
      toggleContactFavoriteColumnIndex,
      0,
      getToggleContactFavoriteColumn({
        onChange: onToggleContactFavorite,
        visible: !filters.archived,
      })
    );
  } else {
    defaultColumns[toggleContactFavoriteColumnIndex] =
      getToggleContactFavoriteColumn({
        onChange: onToggleContactFavorite,
        visible: !filters.archived,
      });
  }

  // add useRowActions
  if (
    !defaultColumns.some(
      (defaultColumn) => defaultColumn.field === FIELD_KEY.actions
    )
  ) {
    defaultColumns.splice(
      actionsColumnIndex,
      0,
      getActionsColumn({
        rowActions: useRowActions,
      })
    );
  }

  const columns: Array<GridColDef> = useMemo(
    () => defaultColumns.filter((column) => column.visible),
    [filters.archived]
  );

  const buildRowData = (contacts): Array<GridRow> => {
    return contacts;
  };

  const rows = useMemo(
    () => buildRowData(contactList.data),
    [contactList.data]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(filters),
    id: gridId,
  };

  const onUpdateFilter = (partialFilter: $Shape<ContactsGridFilters>) => {
    dispatch(updateFilter(partialFilter));
  };

  const onSearch = useDebouncedCallback((searchString: string) => {
    dispatch(
      updateFilter({
        query: searchString,
      })
    );
  }, 400);

  // cancel debounce on unmount
  useEffect(() => () => onSearch?.cancel?.(), [onSearch]);

  return {
    isContactListFetching,
    isContactListLoading,
    isContactListSuccess,
    isContactListError,
    onSearch,
    onUpdateFilter,
    grid,
    meta: contactList.meta,
    filters,
  };
};

export default useContactsGrid;
