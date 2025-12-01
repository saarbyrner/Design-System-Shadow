// @flow
import { useSelector, useDispatch } from 'react-redux';

import {
  getSearchText,
  getSearchStatus,
  getSearchScheduled,
} from '../redux/selectors';
import { setSearchText, setSearchStatus, setSearchScheduled } from '../actions';
import { FilterTranslated as Filter } from '../components/Filter';

function FilterContainer() {
  const dispatch = useDispatch();
  const searchText = useSelector(getSearchText);
  const searchStatus = useSelector(getSearchStatus);
  const searchScheduled = useSelector(getSearchScheduled);

  const dispatchText = (text) => {
    dispatch(setSearchText(text));
  };

  const dispatchStatus = (text) => {
    dispatch(setSearchStatus(text));
  };

  const dispatchScheduled = (text) => {
    dispatch(setSearchScheduled(text));
  };

  return (
    <Filter
      searchText={searchText}
      setSearchText={dispatchText}
      searchStatus={searchStatus}
      setSearchStatus={dispatchStatus}
      searchScheduled={searchScheduled}
      setSearchScheduled={dispatchScheduled}
    />
  );
}

export default FilterContainer;
