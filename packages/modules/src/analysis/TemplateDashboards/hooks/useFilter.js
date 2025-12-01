// @flow
import { useDispatch, useSelector } from 'react-redux';
import { setFilter as setFilterAction } from '../redux/slices/filters';
import type { FilterKey, Filters } from '../redux/slices/filters';
import {
  getEditableTemplateDashboardFilterFactory,
  getIsPanelOpen,
} from '../redux/selectors/filters';

export default function useFilter(key: FilterKey) {
  const dispatch = useDispatch();
  const isPanelOpen = useSelector(getIsPanelOpen);
  const filter = useSelector(getEditableTemplateDashboardFilterFactory(key));
  const setFilter = (newValue: $Values<Filters>) =>
    dispatch(setFilterAction({ key, value: newValue }));

  return { isPanelOpen, filter, setFilter };
}
