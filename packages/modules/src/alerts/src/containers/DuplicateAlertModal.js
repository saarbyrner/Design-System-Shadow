// @flow
import { connect } from 'react-redux';
import { DuplicateAlertModalTranslated as DuplicateAlertModalComponent } from '../components/duplicateAlertModal';
import { closeAlertModal, duplicateAlert, fetchSquads } from '../actions';

const mapStateToProps = (state) => ({
  isOpen: state.alerts.openModal === 'duplicate',
  alert: state.alerts.currentAlert,
  squads: state.alerts.staticData.squads.data,
  isFetchingSquads: state.alerts.staticData.squads.isLoading,
  hasSquadsErrored: state.alerts.staticData.squads.hasErrored,
  activeSquad: state.alerts.staticData.activeSquad,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch(closeAlertModal());
  },
  onSave: (squadIds) => {
    dispatch(duplicateAlert(squadIds));
  },
  fetchSquads: () => {
    dispatch(fetchSquads());
  },
});

const DuplicateAlertModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(DuplicateAlertModalComponent);

export default DuplicateAlertModal;
