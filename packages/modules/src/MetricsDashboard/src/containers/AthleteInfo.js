import { connect } from 'react-redux';
import AthleteInfo from '../components/AthleteInfo';

const mapStateToProps = (state) => ({
  groupBy: state.athletes.groupBy,
  groupingLabels: state.groupingLabels,
  canViewAvailability: state.canViewAvailability,
  canManageAvailability: state.canManageAvailability,
  indicationTypes: state.indicationTypes,
});

const AthleteInfoContainer = connect(mapStateToProps)(AthleteInfo);

export default AthleteInfoContainer;
