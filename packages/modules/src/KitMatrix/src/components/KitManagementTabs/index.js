// @flow
import i18n from '@kitman/common/src/utils/i18n';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import KitManagement from '../KitManagement';

const KitManagementTabs = () => {
  const { permissions } = usePermissions();
  const canManageKits = permissions?.leagueGame.manageKits;

  const tabs = [
    {
      isPermitted: true,
      label: i18n.t('Active'),
      value: 'active',
      content: <KitManagement archived={false} canManageKits={canManageKits} />,
    },
    {
      isPermitted: true,
      label: i18n.t('Inactive'),
      value: 'inactive',
      content: <KitManagement archived canManageKits={canManageKits} />,
    },
  ].filter((tab) => tab.isPermitted);

  return (
    <TabContainer
      titles={tabs.map(({ isPermitted, label, value }) => ({
        isPermitted,
        label,
        value,
      }))}
      content={tabs}
    />
  );
};

export default KitManagementTabs;
