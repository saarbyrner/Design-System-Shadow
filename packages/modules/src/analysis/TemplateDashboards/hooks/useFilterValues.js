// @flow
import { useSelector } from 'react-redux';
import type { FilterKey, Filters } from '../redux/slices/filters';
import { getMultipleTemplateDashboardsFilterFactory } from '../redux/selectors/filters';

export default function useFilterValues(keys: FilterKey[]): $Shape<Filters> {
  return useSelector(getMultipleTemplateDashboardsFilterFactory(keys));
}
