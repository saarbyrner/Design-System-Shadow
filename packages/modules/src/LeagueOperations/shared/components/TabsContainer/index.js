// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { useState, useEffect } from 'react';
import { STATE_IDENTIFIER as URL_PARAMS_KEY } from '@kitman/common/src/hooks/usePersistentState';

import { TAB_HASHES } from '@kitman/modules/src/LeagueOperations/shared/consts';

import { Box, TabContext, TabList, Tab } from '@kitman/playbook/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';

import type {
  TabTitleConfig,
  TabConfig,
} from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

export const onChangeTab = ({
  newValue,
  onSetTab,
}: {
  newValue: $Values<typeof TAB_HASHES>,
  onSetTab: ($Values<typeof TAB_HASHES>) => void,
}) => {
  onSetTab(newValue);
  const newHash = `#${newValue}`;
  const searchParams = new URLSearchParams(window.location.search);
  // remove persistentState filters if any
  if (searchParams.get(URL_PARAMS_KEY)) {
    searchParams.delete(URL_PARAMS_KEY);
  }
  const newSearchParams = searchParams.toString();
  const newUrl = `${window.location.pathname}${
    newSearchParams ? `?${newSearchParams}` : ''
  }${newHash}`;
  window.history.replaceState({}, '', newUrl);
};

type Props = {
  titles: Array<TabTitleConfig>,
  content: Array<TabConfig>,
};

const TabContainer = (props: Props): Node => {
  const [tab, setTab] = useState('');

  useEffect(() => {
    const defaultTab = props?.titles[0]?.value || '';
    const hashValue = window?.location?.hash?.replace('#', '');

    // helper to set the default tab and update the URL
    const setDefaultTab = () => {
      setTab(defaultTab);
      onChangeTab({
        newValue: defaultTab,
        onSetTab: () => setTab(defaultTab),
      });
    };

    // if no hash is present, set the default tab
    if (!hashValue) {
      setDefaultTab();
      return;
    }

    // if hash is present, check if it is a valid tab value
    const isValidTab = props?.titles?.some(
      (title) => title.value === hashValue
    );
    if (isValidTab) {
      setTab(hashValue);
    } else {
      setDefaultTab();
    }
  }, []);

  if (!props?.titles || !props.content) {
    return <></>;
  }

  const renderTab = ({ label, value }) => {
    return <Tab label={label} value={value} key={`TabList${value}`} />;
  };

  const renderTabTitleList = () => {
    if (!props?.titles || props.titles.length === 0) return <></>;
    return (
      <TabList
        onChange={(event, newValue) =>
          onChangeTab({ newValue, onSetTab: () => setTab(newValue) })
        }
      >
        {props?.titles?.map(({ label, value }) => renderTab({ label, value }))}
      </TabList>
    );
  };

  const renderTabPanels = () => {
    if (!props?.content || props.content.length === 0) return <></>;
    return props?.content?.map(({ content, value }) => (
      <PageLayout.TabContent value={value} key={`TabContent_${value}`}>
        {content}
      </PageLayout.TabContent>
    ));
  };

  // Don't render TabContext until we have a valid tab value to avoid Material-UI error
  if (!tab) {
    return null;
  }

  return (
    <TabContext value={tab} key={tab}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: colors.white,
          overFlowY: 'scroll',
        }}
      >
        {renderTabTitleList()}
      </Box>
      {renderTabPanels()}
    </TabContext>
  );
};

export default TabContainer;
