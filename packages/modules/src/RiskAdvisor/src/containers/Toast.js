import { connect } from 'react-redux';
import { Toast as ToastComponent } from '@kitman/components';
import closeToastItem from '@kitman/components/src/Toast/actions';

const mapStateToProps = (state) => {
  return {
    items: [state.injuryVariableSettings.toast.statusItem],
    canCloseProgress: true,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickClose: (itemId) => {
    dispatch(closeToastItem(itemId));
  },
});

const Toast = connect(mapStateToProps, mapDispatchToProps)(ToastComponent);

export default Toast;
