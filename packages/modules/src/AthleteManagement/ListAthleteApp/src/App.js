// @flow
import { useMemo, useRef, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import { TabBar } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import UserMovement from '@kitman/modules/src/UserMovement';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Header from '../../shared/components/Header';
import Actions from './components/Actions';
import { ManageAthletesTabTranslated as ManageAthletesTab } from './components/ManageAthletesTab';
import { TAB_HASHES } from './utils/consts';

type Props = {
  isAssociationAdmin: boolean,
  isLeagueStaffUser: boolean,
};

const muiAthleteManagementGridStyles = {
  '.rc-tabs-tabpane': {
    padding: 0,
  },
};

// TODO: Needs to be maintained until we have a MUI Tab layout defined
const style = {
  athleteManagement: {
    backgroundColor: colors.neutral_100,
    minHeight: 'calc(100vh - 50px)',
  },
  tabCustomStyle: {
    '.rc-tabs-bar': {
      backgroundColor: colors.p06,
      padding: '0 24px',
    },
  },
  ...(window.getFlag('manage-athletes-grid-mui') &&
    muiAthleteManagementGridStyles),
};

const ListAthletesApp = (props: I18nProps<Props>) => {
  const tabs = useMemo(
    () =>
      [
        {
          title: props.t('Active'),
          content: (
            <ManageAthletesTab
              activeStatus="ACTIVE"
              careerStatus="ACTIVE"
              isAssociationAdmin={props.isAssociationAdmin}
            />
          ),
          tabHash: TAB_HASHES.active,
          visible: true,
        },
        {
          title: props.t('Inactive'),
          content: (
            <ManageAthletesTab
              activeStatus="INACTIVE"
              careerStatus="INACTIVE"
              isAssociationAdmin={props.isAssociationAdmin}
            />
          ),
          tabHash: TAB_HASHES.inactive,
          visible: true,
        },
        {
          title: props.t('Released'),
          content: (
            <ManageAthletesTab
              activeStatus="INACTIVE"
              careerStatus="RELEASED"
              isAssociationAdmin={props.isAssociationAdmin}
            />
          ),
          tabHash: TAB_HASHES.released,
          visible: false,
        },
        {
          title: props.t('Retired'),
          content: (
            <ManageAthletesTab
              activeStatus="INACTIVE"
              careerStatus="RETIRED"
              isAssociationAdmin={props.isAssociationAdmin}
            />
          ),
          tabHash: TAB_HASHES.retired,
          visible: false,
        },
      ]
        .filter((tab) => tab.visible)
        .map((tab, index) => ({ ...tab, tabKey: index.toString() })),
    [props]
  );

  const defaultTab = useRef(
    tabs.find((tab) => tab.tabHash === window.location.hash)?.tabKey || '0'
  );

  const onClickTab = (tabKey) => {
    const tabHash = tabs.find((tabPane) => tabPane.tabKey === tabKey)?.tabHash;

    if (tabHash) {
      window.location.replace(tabHash);
    }
  };

  useEffect(() => {
    if (tabs.length > 0) {
      const defaultTabHash = tabs[0].tabHash;
      window.location.replace(defaultTabHash);
    }
  }, [tabs]);

  const renderContent = () => {
    return (
      <TabBar
        customStyles={style.tabCustomStyle}
        tabPanes={tabs.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        onClickTab={onClickTab}
        initialTab={defaultTab.current}
        destroyInactiveTabPane
        kitmanDesignSystem
      />
    );
  };

  return (
    <div css={style.athleteManagement}>
      <Header title={props.t('Manage Athletes')}>
        <Actions
          isAssociationAdmin={!props.isAssociationAdmin}
          isLeagueStaffUser={props.isLeagueStaffUser}
        />
      </Header>
      <UserMovement />
      {renderContent()}
    </div>
  );
};

export const ListAthletesAppTranslated = withNamespaces()(ListAthletesApp);
export default ListAthletesApp;
