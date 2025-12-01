import { useSelector, useDispatch } from 'react-redux';
import { Toast } from '@kitman/components';
import { removeProfilePhotoToast } from '../actions';

export default () => {
  const dispatch = useDispatch();
  const toastItems = useSelector(
    (state) => state.manageUserProfileImage.toasts
  );
  return (
    <Toast
      items={toastItems || []}
      onClickClose={(toastId) => dispatch(removeProfilePhotoToast(toastId))}
      autoCloseSuccessSeconds={2}
      kitmanDesignSystem
    />
  );
};
