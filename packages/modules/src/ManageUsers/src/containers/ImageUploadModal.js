import { useSelector, useDispatch } from 'react-redux';
import { ImageUploadModal } from '@kitman/components';
import { closeImageUploadModal, submitImage } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.manageUserProfileImage.imageUploadModalOpen
  );

  return (
    isOpen && (
      <ImageUploadModal
        title="Add a profile photo"
        onClickCloseModal={() => {
          dispatch(closeImageUploadModal());
        }}
        onClickSaveImage={(file) => {
          dispatch(closeImageUploadModal());
          const url = '/user_profile/avatar';
          dispatch(submitImage(file, url));
        }}
        {...props}
      />
    )
  );
};
