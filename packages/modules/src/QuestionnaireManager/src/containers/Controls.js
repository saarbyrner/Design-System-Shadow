import { connect } from 'react-redux';
import {
  setNameFilter,
  setGroupBy,
  clearNameFilter,
} from '@kitman/common/src/actions';
import { ControlsTranslated as ControlsComponent } from '../components/Controls';
import {
  setPlatform,
  setSquadFilter,
  setMassInput,
  setShowWarningMessage,
} from '../actions';

const mapStateToProps = (state, ownProps) => ({
  templateName: state.templateData.name,
  searchTerm: state.athletes.searchTerm,
  groupBy: state.athletes.groupBy,
  platform: state.variables.selectedPlatform,
  platformOptions: state.variablePlatforms,
  selectedSquad:
    state.athletes.squadFilter === null ? 'all' : state.athletes.squadFilter,
  showWarningMessage: state.templateData.show_warning_message,
  squadOptions: state.squadOptions.squads,
  isMassInput: state.templateData.mass_input,
  ...ownProps,
});
const mapDispatchToProps = (dispatch) => ({
  setFilter: (value) => {
    dispatch(setNameFilter(value));
  },
  clearFilter: () => {
    dispatch(clearNameFilter());
  },
  setGroupBy: (groupBy) => {
    dispatch(setGroupBy(groupBy));
  },
  setSquadFilter: (squad) => {
    // if the squad filter is set to all, we don't want to filter by a squad id called 'all',
    // because it doesn't exist. So we set the squad filter to null
    const squadFilter = squad === 'all' ? null : squad;
    dispatch(setSquadFilter(squadFilter));
  },
  setPlatform: (platform) => {
    dispatch(setPlatform(platform));
  },
  setMassInput: (value) => {
    dispatch(setMassInput(value));
  },
  setShowWarningMessage: (value) => {
    dispatch(setShowWarningMessage(value));
  },
});

const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsComponent);

export default Controls;
