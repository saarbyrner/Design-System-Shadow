import { connect } from 'react-redux';
import { Toast as ToastComponent } from '@kitman/components';
import closeToastItem from '@kitman/components/src/Toast/actions';

const mapStateToProps = (state) => {
  const items = [];
  state.notesWidget.toast.fileOrder.forEach((fileId) =>
    items.push(state.notesWidget.toast.fileMap[fileId])
  );
  state.dashboard.toast.forEach((item) => items.push(item));

  return {
    items,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickClose: (itemId) => {
    dispatch(closeToastItem(itemId));
  },
});

const Toast = connect(mapStateToProps, mapDispatchToProps)(ToastComponent);

export default Toast;
