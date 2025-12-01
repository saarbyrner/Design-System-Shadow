// @flow
import { type CustomStyles } from '@kitman/playbook/components/TabBar/types';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';

type Level = 'team' | 'athlete' | 'issue';

const tabBarRootStyle = (tabHash: string) => ({
  ...(['#maintenance', '#rehab'].includes(tabHash) && {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  }),
});

const tabBarStyle = (tabHash: string) => ({
  ...(['#maintenance', '#rehab'].includes(tabHash) && {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'visible',
  }),
});

const tabPanelsRootStyle = (tabHash: string) => ({
  ...(['#maintenance', '#rehab'].includes(tabHash) && {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  }),
});

const tabPanelRootStyle = (level: Level, tabHash: string) => ({
  ...(level !== 'team' && { position: 'relative', overflow: 'auto' }),
  // $FlowIgnore Flow(exponential-spread)
  ...(['#maintenance', '#rehab'].includes(tabHash) && {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    px: 0,
    pt: convertPixelsToREM(50),
    borderTop: '1px solid',
    borderTopColor: 'divider',
  }),
});

const tabPanelStyle = (level: Level, tabHash: string) => ({
  ...(level !== 'team' && { position: 'relative', overflow: 'auto' }),
  // $FlowIgnore Flow(exponential-spread)
  ...(tabHash !== '#medications'
    ? { p: 0 }
    : { p: 2, borderTop: '1px solid', borderTopColor: 'divider' }),
  ...(['#maintenance', '#rehab'].includes(tabHash) && {
    display: 'flex',
    flex: '1',
    overflow: 'auto',
    position: 'relative',
  }),
});

export const getTabStyles = (level: Level, tabHash: string): CustomStyles => ({
  tabBarRoot: tabBarRootStyle(tabHash),
  tabBar: tabBarStyle(tabHash),
  tabPanelsRoot: tabPanelsRootStyle(tabHash),
  tabPanelRoot: tabPanelRootStyle(level, tabHash),
  tabPanel: tabPanelStyle(level, tabHash),
});
