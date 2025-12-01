import { connect } from 'react-redux';
import { TemplateListTranslated as TemplateList } from '../components/TemplateList';
import { FormListTranslated as FormListComponent } from '../components/FormList';
import {
  showRenameModal,
  showDuplicateModal,
  showDeleteDialogue,
  showActivateDialogue,
  openSidePanel,
  deactivateTemplate,
  setSortingParams,
  activateTemplateRequest,
  deactivateTemplateRequest,
} from '../actions';

const mapStateToProps = (state) => ({
  column: state.sorting.column,
  direction: state.sorting.direction,
});

const mapDispatchToProps = (dispatch) => ({
  rename: (id) => {
    dispatch(showRenameModal(id));
  },
  duplicate: (id) => {
    dispatch(showDuplicateModal(id));
  },
  delete: (id) => {
    dispatch(showDeleteDialogue(id));
  },
  onClickOpenSidePanel: (template, orgTimeZone) => {
    dispatch(openSidePanel(template, orgTimeZone));
  },
  toggleStatus: (template) => {
    if (window.featureFlags['athlete-forms-list']) {
      if (!template.active) {
        dispatch(activateTemplateRequest(template.id));
      } else {
        dispatch(deactivateTemplateRequest(template.id));
      }
    } else if (!template.active) {
      dispatch(showActivateDialogue(template.id));
    } else {
      dispatch(deactivateTemplate(template.id));
    }
  },
  onClickColumnSorting: (column, direction) => {
    dispatch(setSortingParams(column, direction));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateList);
export const FormList = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormListComponent);
