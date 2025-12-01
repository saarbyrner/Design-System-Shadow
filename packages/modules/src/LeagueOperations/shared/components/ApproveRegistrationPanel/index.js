// @flow
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer } from '@kitman/playbook/components';
import { useSelector, useDispatch } from 'react-redux';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import { getRegistrationProfile } from '../../redux/selectors/registrationRequirementsSelectors';
import { getIsPanelOpen } from '../../redux/selectors/registrationApprovalSelectors';
import { onTogglePanel } from '../../redux/slices/registrationApprovalSlice';
import ManageSectionLayout from '../../layouts/ManageSectionLayout';
import RegistrationApprovalForm from './components/RegistrationApprovalForm';
import { ActionsTranslated as Actions } from './components/Actions';

const ApproveRegistrationPanel = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isOpen = useSelector(getIsPanelOpen);
  const profile: User = useSelector(getRegistrationProfile);

  const handleOnClose = () => {
    dispatch(onTogglePanel({ isOpen: false }));
  };

  const getProfileName = () => {
    return `${profile.firstname} ${profile.lastname}`;
  };

  const renderContent = () => {
    if (!isOpen) return null;
    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={getProfileName()}
          subtitle={props.t('Approve Registration')}
          onClose={handleOnClose}
        />
        <ManageSectionLayout.Content>
          <RegistrationApprovalForm />
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Actions />
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleOnClose}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};

export default ApproveRegistrationPanel;

export const ApproveRegistrationPanelTranslated = withNamespaces()(
  ApproveRegistrationPanel
);
