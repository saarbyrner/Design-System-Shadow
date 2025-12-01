import { connect } from 'react-redux';
import { InjuryUploadModalTranslated as InjuryUploadModalComponent } from '../components/InjuryUploadModal';
import {
  closeInjuryUploadModal,
  updateInjuryUploadFile,
  saveUploadInjury,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.injuryUploadModal.isModalOpen,
  file: state.injuryUploadModal.file,
  errors: state.injuryUploadModal.errors,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeInjuryUploadModal());
  },
  updateFile: (file) => {
    dispatch(updateInjuryUploadFile(file));
  },
  saveUploadInjury: (file, trackEvent) => {
    dispatch(saveUploadInjury(file, trackEvent));
  },
});

const InjuryUploadModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(InjuryUploadModalComponent);

export default InjuryUploadModal;
