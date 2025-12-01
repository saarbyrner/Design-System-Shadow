// @flow
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilter as setFileAction,
  clearFilters as clearAllFilters,
  clearCompareToFilters as clearAllCompareToFilters,
} from '../redux/slices/filters';
import type { FilterKey, FiltersValue } from '../redux/slices/filters';
import { getEditableFiltersFactory } from '../redux/selectors/filters';

const useFilter = (key: FilterKey) => {
  const dispatch = useDispatch();
  const filter = useSelector(getEditableFiltersFactory(key));
  const setFilter = (newValue: FiltersValue) =>
    dispatch(setFileAction({ key, value: newValue }));
  const clearFilters = () => dispatch(clearAllFilters());
  const clearCompareToFilters = () => dispatch(clearAllCompareToFilters());

  return { key, filter, setFilter, clearFilters, clearCompareToFilters };
};

export default useFilter;
