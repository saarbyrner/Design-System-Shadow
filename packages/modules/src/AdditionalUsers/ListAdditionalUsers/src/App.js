// @flow
import { useMemo, useRef } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import { TabBar } from '@kitman/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { HeaderTranslated as Header } from './components/Header';
import AdditionalUsersGrid from './components/AdditionalUsersGrid';

const style = {
  listAdditionalUsersApp: css`
    background-color: ${colors.white};
    min-height: calc(100vh - 50px);
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
  `,
  tabCustomStyle: `
  .rc-tabs-bar { 
    background-color: ${colors.p06}; 
    padding: 0 24px; 
  }
`,
};

const TAB_HASHES = {
  ACTIVE: '#active',
  INACTIVE: '#inactive',
};

type Props = {};

const ListAdditionalUsersApp = (props: I18nProps<Props>) => {
  const tabs = useMemo(
    () =>
      [
        {
          title: props.t('Active'),
          content: <AdditionalUsersGrid isActive />,
          tabHash: TAB_HASHES.ACTIVE,
        },
        {
          title: props.t('Inactive'),
          content: <AdditionalUsersGrid isActive={false} />,
          tabHash: TAB_HASHES.INACTIVE,
        },
      ].map((tab, index) => ({ ...tab, tabKey: index.toString() })),
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

  return (
    <div className="listAdditionalUsersApp" css={style.listAdditionalUsersApp}>
      <Header />
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
    </div>
  );
};

export const ListAdditionalUsersAppTranslated = withNamespaces()(
  ListAdditionalUsersApp
);
export default ListAdditionalUsersApp;
