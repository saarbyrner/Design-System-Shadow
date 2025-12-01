import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import { closeModal, renameTemplateRequest } from '../actions';
import { isAUniqueTemplateName } from '../utils';

const mapStateToProps = (state) => {
  const currentTemplateName = state.templates[state.modals.templateId]
    ? state.templates[state.modals.templateId].name
    : '';
  return {
    title: i18n.t('Rename Form'),
    label: i18n.t('Name'),
    actionButtonText: i18n.t('Rename'),
    isOpen: state.modals.renameTemplateVisible,
    value: currentTemplateName,
    customValidations: [
      (value) =>
        isAUniqueTemplateName(value, state.templates, currentTemplateName),
      (value) => containsAnEmoji(value),
    ],
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  onConfirm: (value) => {
    dispatch(renameTemplateRequest(value));
  },
});

const RenameTemplateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseNameModal);

export default RenameTemplateModal;
