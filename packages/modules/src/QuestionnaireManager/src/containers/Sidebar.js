// @flow
import { connect } from 'react-redux';
import { toggleAllVariables } from '../actions';
import { SidebarTranslated as SidebarComponent } from '../components/Sidebar';

import type { State } from '../../types/state';

const mapStateToProps = (state: State) => ({
  groupedAthletes: state.athletes.currentlyVisible,
  variables: state.variables.currentlyVisible || [],
  checkedVariables: state.checkedVariables,
  groupingLabels: state.groupingLabels,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleAllVariables: (athleteId, variables) => {
    dispatch(toggleAllVariables(athleteId, variables));
  },
});

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);

export default Sidebar;
