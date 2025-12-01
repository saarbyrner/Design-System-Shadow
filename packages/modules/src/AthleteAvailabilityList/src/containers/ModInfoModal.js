import { connect } from 'react-redux';
import { ModInfoModalTranslated as ModInfoModalComponent } from '../components/ModInfoModal';
import {
  closeModInfoModal,
  updateModInfoText,
  updateModInfoRtp,
  saveAthleteAvailabilityModInfo,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.modInfoModal.isModalOpen,
  athleteId: state.modInfoModal.athlete ? state.modInfoModal.athlete.id : null,
  modInfoData: state.modInfoModal.modInfoData,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeModInfoModal());
  },
  updateModInfoText: (athlete, isModalOpen) => {
    dispatch(updateModInfoText(athlete, isModalOpen));
  },
  updateModInfoRtp: (athlete, isModalOpen) => {
    dispatch(updateModInfoRtp(athlete, isModalOpen));
  },
  saveModInfo: (athleteId, modInfoData) => {
    dispatch(saveAthleteAvailabilityModInfo(athleteId, modInfoData));
  },
});

const ModInfoModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModInfoModalComponent);

export default ModInfoModal;
