import { useSelector, useDispatch } from 'react-redux';
import { UpdatePrivacyPolicyModalTranslated as UpdatePrivacyPolicyModal } from '../components/privacyPolicySettings/UpdatePrivacyPolicyModal';
import { closePrivacyPolicyModal, savePrivacyPolicy } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.orgSettings.security.updatePrivacyPolicyModal.isOpen
  );

  return (
    <UpdatePrivacyPolicyModal
      isOpen={isOpen}
      onClose={() => {
        dispatch(closePrivacyPolicyModal());
      }}
      onSave={() => dispatch(savePrivacyPolicy())}
      {...props}
    />
  );
};
