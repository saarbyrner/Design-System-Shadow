import { useSelector, useDispatch } from 'react-redux';
import { AddIntegrationModalTranslated as AddIntegrationModal } from '../components/addIntegrationModal';
import { closeAddIntegrationModal } from '../actions';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.orgSettings.integrations.addIntegrationModal.isOpen
  );
  const availableIntegrations = useSelector(
    (state) => state.orgSettings.integrations.availableIntegrations
  );

  return (
    <AddIntegrationModal
      availableIntegrations={availableIntegrations}
      isOpen={isOpen}
      onClickCloseModal={() => {
        dispatch(closeAddIntegrationModal());
      }}
      {...props}
    />
  );
};
