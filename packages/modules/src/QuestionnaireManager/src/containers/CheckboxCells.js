import { connect } from 'react-redux';
import CheckboxCellsComponent from '../components/CheckboxCells';

const mapStateToProps = (state) => ({
  groupedAthletes: state.athletes.currentlyVisible,
  variables: state.variables.currentlyVisible || [],
});

const mapDispatchToProps = () => ({});

const CheckboxCells = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckboxCellsComponent);

export default CheckboxCells;
