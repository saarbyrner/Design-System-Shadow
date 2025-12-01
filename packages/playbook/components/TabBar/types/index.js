// @flow

import { type Node } from 'react';

export type TabItem = {
  tabKey: string,
  tabHash: string,
  title: string,
  content: Node,
};

export type TabsVariant = 'fullWidth' | 'scrollable' | 'standard';

export type CustomStyles = {
  tabBarRoot?: Object,
  tabBar?: Object,
  tabPanelsRoot?: Object,
  tabPanelRoot?: Object,
  tabPanel?: Object,
};

export interface TabPanelProps {
  value: string;
  tabHash: string;
  tabKey: string;
  children?: Node;
  customStyles?: CustomStyles;
}
