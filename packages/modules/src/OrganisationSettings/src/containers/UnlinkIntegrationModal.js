import { useSelector, useDispatch } from 'react-redux';
import { UnlinkIntegrationModalTranslated as UnlinkIntegrationModal } from '../components/unlinkIntegrationModal';
import { closeUnlinkIntegrationModal, unlinkIntegration } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.orgSettings.integrations.unlinkIntegrationModal.isOpen
  );

  return (
    <UnlinkIntegrationModal
      isOpen={isOpen}
      onClickCloseModal={() => {
        dispatch(closeUnlinkIntegrationModal());
      }}
      onClickUnlink={() => dispatch(unlinkIntegration())}
      {...props}
    />
  );
};
