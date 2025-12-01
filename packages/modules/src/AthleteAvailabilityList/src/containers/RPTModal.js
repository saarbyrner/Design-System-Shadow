import { connect } from 'react-redux';
import { RPTModalTranslated as RPTModalComponent } from '../components/RPTModal';
import {
  closeRTPModal,
  updateModInfoRtp,
  saveAthleteAvailabilityModInfo,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.modRTPModal.isModalOpen,
  athleteId: state.modRTPModal.athlete ? state.modRTPModal.athlete.id : null,
  modRTPData: state.modRTPModal.modRTPData,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(closeRTPModal());
  },
  updateRTP: (athlete, isModalOpen) => {
    dispatch(updateModInfoRtp(athlete, isModalOpen));
  },
  saveRTP: (athleteId, rtp) => {
    dispatch(saveAthleteAvailabilityModInfo(athleteId, { rtp }));
  },
});

const RPTModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(RPTModalComponent);

export default RPTModal;
