import { connect } from 'react-redux';
import { DataSourcePanelTranslated as DataSourcePanelComponent } from '../components/dataSourcePanel';
import { toggleDataSourcePanel, saveDataSources } from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.injuryVariableSettings.dataSourcePanel.isOpen,
  excludedSources:
    state.injuryVariableSettings.currentVariable.excluded_sources,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDataSourcePanel: () => {
    dispatch(toggleDataSourcePanel());
  },
  onSaveDataSources: (excludedSources) => {
    dispatch(saveDataSources(excludedSources));
  },
});

const DataSourcePanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSourcePanelComponent);

export default DataSourcePanel;
