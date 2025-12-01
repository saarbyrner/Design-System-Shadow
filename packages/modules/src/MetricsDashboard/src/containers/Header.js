import { connect } from 'react-redux';
import { switchDashboard, toggleDashboardFilters } from '../actions';
import { HeaderTranslated as Header } from '../components/Header';

const mapStateToProps = (state) => ({
  athleteFilters: state.athletes.athleteFilters,
  alarmFilters: state.athletes.alarmFilters,
  groupBy: state.athletes.groupBy,
  dashboards: state.dashboards.all,
  currentDashboardId: state.dashboards.currentId,
  canManageDashboard: state.canManageDashboard,
  addedStatusCount: state.statuses.ids ? state.statuses.ids.length : 0,
  isFilterShown: state.showDashboardFilters,
  isFilteringOn:
    state.athletes.alarmFilters.length > 0 ||
    state.athletes.athleteFilters.length > 0,
});

const mapDispatchToProps = (dispatch) => ({
  switchDashboard: (dashboardId) => {
    dispatch(switchDashboard(dashboardId));
  },
  toggleDashboardFilters: (isFilterShown) => {
    dispatch(toggleDashboardFilters(isFilterShown));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
