import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { containsAnEmoji } from '@kitman/common/src/utils';
import { ChooseNameModal } from '@kitman/components';
import { closeModal, duplicateTemplate, updateTemplateName } from '../actions';
import { isAUniqueTemplateName } from '../utils';

const mapStateToProps = (state) => {
  const duplicateTemplateName = state.modals.templateToDuplicate
    ? state.modals.templateToDuplicate.name
    : '';

  // Note, it's safe to output the raw template name here (`{{-  ...}}`)
  // because the name is escaped by React when displayed
  return {
    title: i18n.t("Duplicate Dashboard '{{- dashboardName}}'", {
      dashboardName: duplicateTemplateName,
    }),
    label: i18n.t('Name'),
    isOpen: state.modals.duplicateTemplateVisible,
    value: '',
    customValidations: [
      (value) => isAUniqueTemplateName(value, state.templates),
      (value) => containsAnEmoji(value),
    ],
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModal());
  },
  onConfirm: () => {
    dispatch(duplicateTemplate());
  },
  onChange: (value) => {
    dispatch(updateTemplateName(value));
  },
});

const DuplicateTemplateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseNameModal);

export default DuplicateTemplateModal;
