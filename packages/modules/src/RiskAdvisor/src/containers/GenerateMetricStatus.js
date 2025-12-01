import { connect } from 'react-redux';
import { AppStatus } from '@kitman/components';
import {
  hideAppStatus,
  generateMetric,
  closeRenameVariableModal,
} from '../actions';

const mapStateToProps = (state) => ({
  status: state.generateMetricStatus.status,
  message: state.generateMetricStatus.message,
  title: state.generateMetricStatus.title,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(hideAppStatus());
  },
  hideConfirmation: () => {
    dispatch(hideAppStatus());
  },
  confirmAction: () => {
    dispatch(generateMetric());
    dispatch(closeRenameVariableModal());
    dispatch(hideAppStatus());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStatus);
