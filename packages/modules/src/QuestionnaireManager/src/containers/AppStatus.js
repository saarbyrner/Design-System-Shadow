import { connect } from 'react-redux';
import { AppStatus } from '@kitman/components';
import { hideCurrentModal } from '../actions';

const mapStateToProps = (state) => ({
  status: state.modal.status,
  message: state.modal.message,
  hideButtonText: state.modal.hideButtonText,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(hideCurrentModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStatus);
