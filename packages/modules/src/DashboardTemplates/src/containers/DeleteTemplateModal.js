import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { AppStatus } from '@kitman/components';
import { closeModal, deleteTemplate } from '../actions';

const getModalMessage = (state) =>
  state.modals.templateToDelete
    ? i18n.t('Are you sure you want to delete "{{- templateName}}"?', {
        templateName: state.modals.templateToDelete.name,
      })
    : null;

const mapStateToProps = (state) => ({
  status: state.modals.confirmDeleteVisible ? 'confirm' : null,
  message: getModalMessage(state),
  hideButtonText: i18n.t('Cancel'),
  confirmButtonText: i18n.t('Delete'),
});

const mapDispatchToProps = (dispatch) => ({
  hideConfirmation: () => {
    dispatch(closeModal());
  },
  confirmAction: () => {
    dispatch(deleteTemplate());
  },
});

const DeleteTemplateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStatus);

export default DeleteTemplateModal;
