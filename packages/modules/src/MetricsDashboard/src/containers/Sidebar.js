import { connect } from 'react-redux';
import { SidebarTranslated as Sidebar } from '../components/Sidebar';

const mapStateToProps = (state) => ({
  groupedAthletes: !state.athletes.currentlyVisible
    ? {}
    : state.athletes.currentlyVisible,
  orderedGroup: state.athletes.groupOrderingByType[state.athletes.groupBy],
  groupingLabels: state.groupingLabels,
});

const SidebarContainer = connect(mapStateToProps)(Sidebar);

export default SidebarContainer;
