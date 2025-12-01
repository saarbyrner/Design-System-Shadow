import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { ChooseNameModal as ChooseNameModalComponent } from '@kitman/components';
import {
  closeRenameVariableModal,
  updateRenameVariableName,
  renameModalConfirm,
} from '../actions';
import { isUniqueName } from '../utils';

const mapStateToProps = (state) => ({
  isOpen: state.injuryVariableSettings.renameVariableModal.isOpen,
  value: state.injuryVariableSettings.renameVariableModal.variableName,
  title: i18n.t('Metric name'),
  label: i18n.t('Name'),
  actionButtonText: i18n.t('Save'),
  description: i18n.t(
    'This is the name that will appear throughout the system.'
  ),
  customValidations: [
    (value) => isUniqueName(value, state.injuryVariableSettings.allVariables),
  ],
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeRenameVariableModal());
  },
  onConfirm: () => {
    dispatch(renameModalConfirm());
  },
  onChange: (variableName) => {
    dispatch(updateRenameVariableName(variableName));
  },
});

const RenameVariableModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseNameModalComponent);

export default RenameVariableModal;
