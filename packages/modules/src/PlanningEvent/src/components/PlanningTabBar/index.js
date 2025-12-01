// @flow
import type { Node } from 'react';

import { useEffect } from 'react';
import { css } from '@emotion/react';
import InkTabBar from 'rc-tabs/lib/InkTabBar';
import TabContent from 'rc-tabs/lib/TabContent';
import Tabs, { TabPane } from 'rc-tabs';
import styles from './styles';

type TabPaneItem = {
  title: string,
  content: Node,
};

export type Props = {
  customStyles?: string,
  tabPanes: Array<TabPaneItem>,
  onClickTab?: Function,
  kitmanDesignSystem?: boolean,
  destroyInactiveTabPane?: boolean,
  activeTabKey: string,
  setActiveTabKey: Function,
  hasUnsavedChanges: boolean,
  selectedTab: string,
  setSelectedTab: Function,
  setShowPrompt: Function,
  isPromptConfirmed: boolean,
  setIsPromptConfirmed: Function,
};

export const PlanningTabBar = (props: Props) => {
  const {
    customStyles,
    tabPanes,
    onClickTab,
    kitmanDesignSystem,
    destroyInactiveTabPane,
    activeTabKey,
    setActiveTabKey,
    hasUnsavedChanges,
    selectedTab,
    setSelectedTab,
    setShowPrompt,
    isPromptConfirmed,
    setIsPromptConfirmed,
  } = props;

  const setActiveTab = (key: string) => {
    setSelectedTab(key);
    if (hasUnsavedChanges) {
      setShowPrompt(true);
    } else {
      setActiveTabKey(key);
      if (onClickTab) {
        onClickTab(key);
      }
    }
  };

  useEffect(() => {
    if (isPromptConfirmed) {
      setActiveTabKey(selectedTab);
      if (onClickTab) {
        onClickTab(selectedTab);
      }
      setIsPromptConfirmed(false);
    }
  }, [isPromptConfirmed]);

  const renderTabPanes = () => {
    return tabPanes.map((tabPane, index) => (
      /* eslint-disable react/no-array-index-key */
      // index has to be used as key to switch panes correctly
      <TabPane data-testid="TabBarCompPane" tab={tabPane.title} key={index}>
        {tabPane.content}
      </TabPane>
    ));
  };

  return (
    <div
      role="tablist"
      css={
        kitmanDesignSystem
          ? css`
              ${styles.tabBar};
              ${styles.tabBar_kitmanDesignSystem};
              ${customStyles &&
              css`
                ${customStyles}
              `}
            `
          : styles.tabBar
      }
    >
      <Tabs
        activeKey={activeTabKey}
        tabBarPosition="top"
        onChange={(tabKey) => {
          setActiveTab(tabKey);
        }}
        renderTabBar={() => (
          <InkTabBar tabBarGutter={kitmanDesignSystem ? 16 : 0} />
        )}
        renderTabContent={() => <TabContent animated={false} />}
        destroyInactiveTabPane={destroyInactiveTabPane}
      >
        {renderTabPanes()}
      </Tabs>
    </div>
  );
};

export default PlanningTabBar;
