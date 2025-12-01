import { useSelector, useDispatch } from 'react-redux';
import { UpdateTermsOfUsePolicyModalTranslated as UpdateTermsOfUsePolicyModal } from '../components/termsOfUsePolicySettings/UpdateTermsOfUsePolicyModal';
import { closeTermsOfUsePolicyModal, saveTermsOfUsePolicy } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.orgSettings.legal.updateTermsOfUsePolicyModal.isOpen
  );

  return (
    <UpdateTermsOfUsePolicyModal
      isOpen={isOpen}
      onClose={() => {
        dispatch(closeTermsOfUsePolicyModal());
      }}
      onSave={() => dispatch(saveTermsOfUsePolicy())}
      {...props}
    />
  );
};
