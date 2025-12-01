// @flow
import { connect } from 'react-redux';
import { AppStatus } from '@kitman/components';
import { hideAppStatus, deleteAlert } from '../actions';

const mapStateToProps = (state) => ({
  status: state.appStatus.status,
  message: state.appStatus.message,
  secondaryMessage: state.appStatus.secondaryMessage,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(hideAppStatus());
  },
  hideConfirmation: () => {
    dispatch(hideAppStatus());
  },
  confirmAction: () => {
    dispatch(deleteAlert());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStatus);
