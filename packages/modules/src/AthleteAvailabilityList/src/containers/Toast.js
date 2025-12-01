import { connect } from 'react-redux';
import { Toast as ToastComponent } from '@kitman/components';
import closeToastItem from '@kitman/components/src/Toast/actions';

const mapStateToProps = (state) => {
  return {
    items: state.fileUploadToast.fileOrder.map(
      (fileId) => state.fileUploadToast.fileMap[fileId]
    ),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickClose: (itemId) => {
    dispatch(closeToastItem(itemId));
  },
});

const Toast = connect(mapStateToProps, mapDispatchToProps)(ToastComponent);

export default Toast;
