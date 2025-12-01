import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { setGroupBy } from '@kitman/common/src/actions';
import { Dropdown } from '@kitman/components';
import groupByOptions from '@kitman/common/src/utils/groupByOptions';

const mapStateToProps = (state) => ({
  items: groupByOptions(),
  value: state.athletes.groupBy,
  label: i18n.t('Group By'),
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (option) => {
    dispatch(setGroupBy(option));
  },
});

const GroupSelector = connect(mapStateToProps, mapDispatchToProps)(Dropdown);

export default GroupSelector;
