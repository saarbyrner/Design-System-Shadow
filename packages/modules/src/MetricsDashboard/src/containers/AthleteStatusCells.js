import { connect } from 'react-redux';
import AthleteStatusCells from '../components/AthleteStatusCells';

const mapStateToProps = (state) => ({
  canViewGraph: state.canViewGraph,
  groupedAthletes: !state.athletes.currentlyVisible
    ? {}
    : state.athletes.currentlyVisible,
  orderedGroup: state.athletes.groupOrderingByType[state.athletes.groupBy],
  statuses: state.statuses,
});

const mapDispatchToProps = () => ({});

const AthleteStatusCellsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AthleteStatusCells);

export default AthleteStatusCellsContainer;
