// @flow
import type {
  User,
  SectionFormElement,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { Drawer } from '@kitman/playbook/components';
import { useSelector, useDispatch } from 'react-redux';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import {
  getIsPanelOpen,
  getPanelFormElement,
  getRegistrationProfile,
} from '../../redux/selectors/registrationRequirementsSelectors';
import { onTogglePanel } from '../../redux/slices/registrationRequirementsSlice';
import ManageSectionLayout from '../../layouts/ManageSectionLayout';
import SectionForm from './components/SectionForm';
import { ActionsTranslated as Actions } from './components/Actions';
import ApprovalForm from './components/ApprovalForm';
import { RequirementHistoryTranslated as RequirementHistory } from './components/RequirementHistory';

const ManageSectionPanel = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isOpen = useSelector(getIsPanelOpen);
  const panelElement: SectionFormElement = useSelector(getPanelFormElement);
  const profile: User = useSelector(getRegistrationProfile);

  const handleOnClose = () => {
    dispatch(onTogglePanel({ isOpen: false }));
  };

  const getProfileName = () => {
    return `${profile.firstname} ${profile.lastname}`;
  };

  const getSectionTitle = () => {
    return `${panelElement.title}`;
  };

  const renderContent = () => {
    if (!isOpen) return null;
    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={getProfileName()}
          subtitle={getSectionTitle()}
          onClose={handleOnClose}
        />
        <ManageSectionLayout.Content>
          <SectionForm />
          <RequirementHistory />
          <ApprovalForm />
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

export default ManageSectionPanel;
