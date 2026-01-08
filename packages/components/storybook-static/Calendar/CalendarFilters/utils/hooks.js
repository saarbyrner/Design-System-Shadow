// @flow
import { useDispatch, useSelector } from 'react-redux';

import { updateFiltersInLocalStorage } from './helpers';
import { filtersSavedInLocalStorageSet } from './consts';
import { getFilterFactory } from '../redux/selectors/filters';
import { setFilter as setFilterAction } from '../redux/slices/filters';
import type { FilterKey, FiltersValue } from '../redux/types';

export type SetFilter = (newValue: FiltersValue) => void;

export const useFilter = (filterKey: FilterKey) => {
  const dispatch = useDispatch();
  const filter = useSelector(getFilterFactory(filterKey));
  const setFilter: SetFilter = (newValue: FiltersValue) => {
    const updateAction = { key: filterKey, value: newValue };
    dispatch(setFilterAction(updateAction));
    // we don't want to save ALL filters in the local storage
    if (filtersSavedInLocalStorageSet.has(filterKey)) {
      updateFiltersInLocalStorage(updateAction);
    }
  };
  return { filter, setFilter };
};
