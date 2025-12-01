import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import { closeModal, renameTemplate, updateTemplateName } from '../actions';
import { isAUniqueTemplateName } from '../utils';

const mapStateToProps = (state) => ({
  title: i18n.t('Rename Dashboard'),
  label: i18n.t('Name'),
  isOpen: state.modals.renameTemplateVisible,
  actionButtonText: i18n.t('Rename'),
  value: state.modals.templateName,
  customValidations: [
    (value) =>
      isAUniqueTemplateName(
        value,
        state.templates,
        state.modals.templateToRename.name
      ),
    (value) => containsAnEmoji(value),
  ],
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  onConfirm: () => {
    dispatch(renameTemplate());
  },
  onChange: (value) => {
    dispatch(updateTemplateName(value));
  },
});

const RenameTemplateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseNameModal);

export default RenameTemplateModal;
