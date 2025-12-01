// @flow
import type { Node } from 'react';
import type {
  User,
  StatusHistory,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer, Grid } from '@kitman/playbook/components';
import { useSelector, useDispatch } from 'react-redux';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import useRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory';
import ManageSectionLayout from '../../layouts/ManageSectionLayout';
import { getRegistrationProfile } from '../../redux/selectors/registrationRequirementsSelectors';
import { getIsPanelOpen } from '../../redux/selectors/registrationHistorySelectors';
import { onTogglePanel } from '../../redux/slices/registrationHistorySlice';
import { HistoryItemTranslated as HistoryItem } from './components/HistoryItem';

export const renderHistory = (statusHistory: Array<StatusHistory>): Node => {
  return (
    <Grid
      container
      spacing={2}
      columns={4}
      p={0}
      m={0}
      sx={{
        maxWidth: '100%',
        overflowX: 'hidden',
        whiteSpace: 'normal',
      }}
    >
      {statusHistory.map((item) => {
        return (
          <Grid item xs={12} sx={{ p: 2 }} key={item.id}>
            <HistoryItem entry={item} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const RegistrationHistoryPanel = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { history } = useRegistrationHistory();

  const isOpen = useSelector(getIsPanelOpen);
  const profile: User = useSelector(getRegistrationProfile);

  const handleOnClose = () => {
    dispatch(onTogglePanel({ isOpen: false }));
  };

  const renderTitle = () => {
    return (
      <ManageSectionLayout.Title
        title={`${profile.firstname} ${profile.lastname}`}
        subtitle={props.t('Registration history')}
        onClose={handleOnClose}
      />
    );
  };

  const renderContent = () => {
    if (!isOpen) return null;
    return (
      <ManageSectionLayout>
        {renderTitle()}
        <ManageSectionLayout.Content>
          {history?.status_history?.length > 0 &&
            renderHistory(history.status_history)}
        </ManageSectionLayout.Content>
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

export default RegistrationHistoryPanel;

export const RegistrationHistoryPanelTranslated = withNamespaces()(
  RegistrationHistoryPanel
);
