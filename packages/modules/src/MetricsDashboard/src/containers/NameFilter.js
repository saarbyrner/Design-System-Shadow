import i18n from '@kitman/common/src/utils/i18n';
import { connect } from 'react-redux';
import { setNameFilter, clearNameFilter } from '@kitman/common/src/actions';
import { FilterInput } from '@kitman/components';

const mapStateToProps = (state) => ({
  value: state.athletes.searchTerm,
  tabIndex: 1,
  placeHolder: i18n.t('#sport_specific__Search_Athletes'),
});

const mapDispatchToProps = (dispatch) => ({
  setFilter: (value) => {
    dispatch(setNameFilter(value));
  },
  clearFilter: () => {
    dispatch(clearNameFilter());
  },
});

const NameFilter = connect(mapStateToProps, mapDispatchToProps)(FilterInput);

export default NameFilter;
