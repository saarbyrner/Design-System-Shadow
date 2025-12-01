import { connect } from 'react-redux';
import TemplateListComponent from '../components/TemplateList';
import {
  showConfirmDeleteTemplate,
  showDuplicateModal,
  showRenameModal,
} from '../actions';

const mapStateToProps = (state) => ({
  templates: state.templates || [],
});

const mapDispatchToProps = (dispatch) => ({
  duplicate: (template) => {
    dispatch(showDuplicateModal(template));
  },
  delete: (template) => {
    dispatch(showConfirmDeleteTemplate(template));
  },
  rename: (template) => {
    dispatch(showRenameModal(template));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(TemplateListComponent);

export default App;
