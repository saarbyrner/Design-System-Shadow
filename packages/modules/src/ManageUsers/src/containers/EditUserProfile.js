import { connect } from 'react-redux';
import { EditUserProfileTranslated as EditUserProfileComponent } from '../components/editUserProfile';
import {
  saveUserFormStarted,
  saveUserFormSuccess,
  saveUserFormFailure,
  openImageUploadModal,
} from '../actions';

const mapStateToProps = (state) => ({
  currentUser: state.manageUsers.currentUser,
  photoUploadStatus: state.manageUserProfileImage.status,
});

const mapDispatchToProps = (dispatch) => ({
  saveUserFormStarted: () => {
    dispatch(saveUserFormStarted());
  },
  saveUserFormSuccess: () => {
    dispatch(saveUserFormSuccess());
  },
  saveUserFormFailure: () => {
    dispatch(saveUserFormFailure());
  },
  onOpenImageUploadModal: () => {
    dispatch(openImageUploadModal());
  },
});

const EditUserProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserProfileComponent);

export default EditUserProfile;
