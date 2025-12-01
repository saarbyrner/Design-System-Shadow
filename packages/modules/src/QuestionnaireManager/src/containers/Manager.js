import { connect } from 'react-redux';
import { ManagerTranslated as ManagerComponent } from '../components/Manager';

const mapStateToProps = (state, ownProps) => ({
  variables: state.variables.currentlyVisible || [],
  cantShowManager:
    !state.variables.currentlyVisible || !state.athletes.currentlyVisible,
  allAthletes: state.athletes.all || [],
  ...ownProps,
});

const mapDispatchToProps = () => ({});

const Manager = connect(mapStateToProps, mapDispatchToProps)(ManagerComponent);

export default Manager;
