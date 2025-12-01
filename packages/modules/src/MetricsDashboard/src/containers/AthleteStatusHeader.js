import { connect } from 'react-redux';
import { updateSort } from '../actions';
import { AthleteStatusHeaderTranslated as AthleteStatusHeader } from '../components/AthleteStatusHeader';

const mapStateToProps = (state) => ({
  statusOrder: state.statuses.ids,
  statusMap: state.statuses.byId,
  canManageDashboard: state.canManageDashboard,
  currentDashboardId: state.dashboards.currentId,
});

const mapDispatchToProps = (dispatch) => ({
  updateSort: (sortOrder, sortedBy, statusKey) => {
    dispatch(updateSort(sortOrder, sortedBy, statusKey));
  },
});

const AthleteStatusHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AthleteStatusHeader);

export default AthleteStatusHeaderContainer;
