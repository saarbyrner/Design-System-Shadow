import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import { closeModal, addTemplate } from '../actions';
import { isAUniqueTemplateName } from '../utils';

const mapStateToProps = (state) => ({
  title: i18n.t('New Dashboard'),
  label: i18n.t('Name'),
  isOpen: state.modals.addTemplateVisible,
  customValidations: [
    (value) => isAUniqueTemplateName(value, state.templates),
    (value) => containsAnEmoji(value),
  ],
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  onConfirm: (templateName) => {
    dispatch(addTemplate(templateName));
  },
});

const AddTemplateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseNameModal);

export default AddTemplateModal;
