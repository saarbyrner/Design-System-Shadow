import { connect } from 'react-redux';
import HeaderComponent from '../components/VariableHeader';
import { toggleAthletesPerVariable } from '../actions';

const mapStateToProps = (state) => ({
  variables: state.variables.currentlyVisible || [],
  groupedAthletes: state.athletes.currentlyVisible,
  checkedVariables: state.checkedVariables,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAllAthletes: (variableId) => {
    dispatch(toggleAthletesPerVariable(variableId));
  },
});

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

export default Header;
