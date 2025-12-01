import { connect } from 'react-redux';
import AlarmsEditor from './AlarmsEditor';

const modalComponents = {
  alarms: AlarmsEditor,
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) {
    return null;
  }

  const SpecificModal = modalComponents[modalType];
  return <SpecificModal {...modalProps} />;
};

const mapStateToProps = (state) => ({
  modalType: state.modal.modalType,
  modalProps: state.modal.modalProps,
});

export default connect(mapStateToProps)(ModalRoot);
