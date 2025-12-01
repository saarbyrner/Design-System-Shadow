// @flow
import { createElement } from 'react';
import TabBarComp from '.';
import type { Props } from '.';

export default {
  title: 'TabBar',
  component: TabBarComp,
};

export const Basic = (inputArgs: Props) => {
  return <TabBarComp {...inputArgs} />;
};

Basic.args = {
  kitmanDesignSystem: true,
  tabPanes: [
    {
      title: 'Tab 1',
      content: createElement('div', { id: 'div1' }, 'tab 1 content'),
    },
    {
      title: 'Tab 2',
      content: createElement('div', { id: 'div2' }, 'tab 2 content'),
    },
    {
      title: 'Tab 3',
      content: createElement('div', { id: 'div3' }, 'tab 3 content'),
    },
    {
      title: 'Tab 4',
      content: createElement('div', { id: 'div4' }, 'tab 4 content'),
    },
  ],
};
