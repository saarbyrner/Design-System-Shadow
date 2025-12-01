import { connect } from 'react-redux';
import { AppStatus } from '@kitman/components';
import { hideAppStatus } from '../actions';

const mapStateToProps = (state) => ({
  status: state.appStatus.status,
  message: state.appStatus.message,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(hideAppStatus());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStatus);
