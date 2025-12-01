import { connect } from 'react-redux';
import { AppTranslated as AppComponent } from '../components/App';
import { fetchGraphData } from '../actions';

const mapStateToProps = (state) => ({
  graphData: state.contributingFactors.graphData,
});

const mapDispatchToProps = (dispatch) => ({
  fetchGraphData: (athleteId, injuryRiskVariableUuid, predictionTimeStamp) => {
    dispatch(
      fetchGraphData(athleteId, injuryRiskVariableUuid, predictionTimeStamp)
    );
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
