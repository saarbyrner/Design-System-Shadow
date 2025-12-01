import { connect } from 'react-redux';
import AppComponent from '../components/App';
import { createNewGraph, saveGraph } from '../actions';

const mapStateToProps = (state) => ({
  isEditingDashboard: state.StaticData.isEditingDashboard,
  isEditingGraph: state.StaticData.isEditingGraph,
  graphData: state.GraphData,
  currentDashboard: state.StaticData.currentDashboard,
  appStatus: state.AppStatus.status,
});

const mapDispatchToProps = (dispatch) => ({
  createNewGraph: () => {
    dispatch(createNewGraph());
  },
  saveGraph: () => {
    dispatch(saveGraph());
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
