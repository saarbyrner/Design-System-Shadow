import { connect } from 'react-redux';
import { AppTranslated as AppComponent } from '../components/App';
import {
  loadAthletes,
  toggleAthleteFilters,
  openInjuryUploadModal,
  getAthletesByAvailability,
} from '../actions';

const mapStateToProps = (state) => ({
  athletes: state.athletes,
  isLoading: state.athletes.isLoading,
  canManageIssues: state.issueStaticData.canManageIssues,
});

const mapDispatchToProps = (dispatch) => ({
  loadAthletes: () => {
    dispatch(loadAthletes());
  },
  toggleAthleteFilters: (isFilterShown) => {
    dispatch(toggleAthleteFilters(isFilterShown));
  },
  updateFilterOptions: (
    groupBy,
    alarmFilters,
    athleteFilters,
    availabilityFilters
  ) => {
    dispatch(
      getAthletesByAvailability(
        groupBy,
        alarmFilters,
        athleteFilters,
        availabilityFilters
      )
    );
  },
  openInjuryUploadModal: () => {
    dispatch(openInjuryUploadModal());
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
