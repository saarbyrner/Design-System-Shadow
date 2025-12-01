import { connect } from 'react-redux';
import { AthleteFilters } from '@kitman/components';
import { updateFilterOptions } from '../actions';

const mapStateToProps = (state) => ({
  athletes: state.athletes.all || [],
  isExpanded: state.showDashboardFilters || false,
  selectedGroupBy: state.athletes.groupBy || 'availability',
  selectedAlarmFilters: state.athletes.alarmFilters || [],
  selectedAthleteFilters: state.athletes.athleteFilters || [],
  selectedAvailabilityFilters: state.athletes.availabilityFilters || [],
});

const mapDispatchToProps = (dispatch) => ({
  updateFilterOptions: (groupBy, alarmFilters, athleteFilters) => {
    dispatch(updateFilterOptions(groupBy, alarmFilters, athleteFilters));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AthleteFilters);
