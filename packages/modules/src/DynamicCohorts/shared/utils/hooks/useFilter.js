// @flow
import { useDispatch, useSelector } from 'react-redux';
import type { FilterKey, FiltersValue, SetFilterFunctionType } from '../types';

export type SetFilter = (newValue: FiltersValue) => void;

export const useFilter = (
  filterKey: FilterKey,
  stateKey: string,
  setFilterAction: SetFilterFunctionType
) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state[stateKey].filters[filterKey]);

  const setFilter: SetFilter = (newValue: FiltersValue) => {
    const updateAction = { key: filterKey, value: newValue };
    dispatch(setFilterAction(updateAction));
  };

  return { filter, setFilter };
};
