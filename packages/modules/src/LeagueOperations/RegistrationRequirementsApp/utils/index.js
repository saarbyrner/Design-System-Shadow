// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  RegistrationStatusEnum,
  type UserType,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

import type {
  TabTitleConfig,
  TabConfig,
} from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import {
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import TabProfileForm from '../../shared/components/Tabs/TabProfileForm';
import TabRequirements from '../../shared/components/Tabs/TabRequirements';

import ListLayout from '../../shared/layouts/ListLayout';

export const getDetailsTabTitles = ({
  permissionGroup,
  status,
  isRegistrationExternallyManaged,
}: {
  permissionGroup: string,
  status: string,
  isRegistrationExternallyManaged: boolean,
}): Array<TabTitleConfig> => {
  return [
    {
      isPermitted: true,
      label: i18n.t(`{{user}} details`, {
        user: permissionGroup,
      }),
      value: TAB_HASHES.details,
    },
    {
      isPermitted:
        status !== RegistrationStatusEnum.INCOMPLETE &&
        !isRegistrationExternallyManaged,
      label: i18n.t('Requirements'),
      value: TAB_HASHES.requirements,
    },
    {
      isPermitted: false,
      label: i18n.t('Documents'),
      value: TAB_HASHES.documents,
    },
  ].filter((tab) => tab.isPermitted);
};

export const getDetailsTabContent = ({
  permissionGroup,
  currentUserType,
  status,
  isRegistrationExternallyManaged,
}: {
  currentUserType: UserType,
  permissionGroup: string,
  status: string,
  isRegistrationExternallyManaged: boolean,
}): Array<TabConfig> => {
  const label = i18n.t(`{{user}} details`, {
    user: permissionGroup,
  });

  return [
    {
      isPermitted: true,
      label,
      value: TAB_HASHES.details,
      content: <TabProfileForm />,
    },
    {
      isPermitted: false,
      label: i18n.t('Documents'),
      value: TAB_HASHES.documents,
      content: <ListLayout.LoadingLayout />,
    },
    {
      isPermitted:
        status !== RegistrationStatusEnum.INCOMPLETE &&
        !isRegistrationExternallyManaged,
      label: i18n.t('Requirements'),
      value: TAB_HASHES.requirements,
      content: (
        <TabRequirements
          currentUserType={currentUserType}
          gridQueryParams={{
            grid: GRID_TYPES.REQUIREMENTS,
          }}
        />
      ),
    },
  ].filter((tab) => tab.isPermitted);
};
