// @flow
import { useSelector, useDispatch } from 'react-redux';
import { ImageUploadModal } from '@kitman/components';
import {
  closeChannelImageUploadModal,
  uploadConversationIcon,
} from '../actions';

export default () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.athleteChat.imageUploadModal.isOpen
  );

  return (
    isOpen && (
      <ImageUploadModal
        title="Add a channel avatar"
        onClickCloseModal={() => {
          dispatch(closeChannelImageUploadModal());
        }}
        onClickSaveImage={(file) => {
          dispatch(closeChannelImageUploadModal());
          dispatch(uploadConversationIcon(file)).catch(() => {}); // TODO: something with error
        }}
      />
    )
  );
};
