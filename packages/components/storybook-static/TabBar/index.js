// @flow
import type { Node } from 'react';

import { Component } from 'react';
// css is needed for compatibility.
//
// TODO: remove the following eslint-disable/enable comments once
// object-styles-always ESLint rule is run in the pipeline.
import { css } from '@emotion/react';
/* eslint-enable */
import InkTabBar from 'rc-tabs/lib/InkTabBar';
import TabContent from 'rc-tabs/lib/TabContent';
import Tabs, { TabPane } from 'rc-tabs';
import { colors, breakPoints } from '@kitman/common/src/variables';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

type TabPaneItem = {
  title: string,
  content: Node,
  key?: string,
};

export type Props = {
  customStyles?: string | ObjectStyle,
  tabPanes: Array<TabPaneItem>,
  initialTab?: ?string,
  // activeTabIndex is used in getDerivedStateFromProps but its usage isn’t
  // detected because getDerivedStateFromProps is static.
  // eslint-disable-next-line react/no-unused-prop-types
  activeTabIndex?: string,
  onClickTab?: (tabKey: string) => void,
  kitmanDesignSystem?: boolean,
  destroyInactiveTabPane?: boolean,
};

type State = {
  activeKey: string,
};

class TabBarComp extends Component<Props, State> {
  style = {
    tabBar: {
      '.rc-tabs': {
        border: '0',
        overflow: 'visible',

        '&::before': {
          backgroundColor: colors.neutral_300,
          content: '""',
          height: '2px',
          position: 'absolute',
          top: '37px' /* height of the tabs bar */,
          width: '100%',
          zIndex: 1,
        },
      },

      '.rc-tabs-bar': {
        borderBottom: 'none',
        padding: '0 5px',

        [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
          overflowX: 'auto',
          maxWidth: '100%',

          '> div': {
            display: 'inline-flex',
          },
        },
      },

      '.rc-tabs-tab': {
        padding: '15px',

        '&:hover': {
          color: colors.grey_300,
        },

        '&-active': {
          color: colors.grey_300,

          '&:hover': {
            color: colors.grey_300,
          },
        },
      },

      '.rc-tabs-ink-bar': {
        backgroundColor: colors.grey_300,
        borderRadius: '8px',
      },

      '.rc-tabs-tabpane': {
        padding: '16px 20px',
      },
    },
    tabBar_kitmanDesignSystem: {
      '.rc-tabs-bar': {
        padding: '0',
      },

      '.rc-tabs-tabpane': {
        backgroundColor: colors.background,
        padding: '16px 20px',
      },

      '.rc-tabs-tab': {
        color: colors.grey_100,
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '22px',
        padding: '7.5px 0 9.5px 0',

        '&:hover': {
          color: colors.grey_300,
        },

        '&-active': {
          color: colors.grey_300,

          '&:hover': {
            color: colors.grey_300,
          },
        },
      },

      '.rc-tabs-ink-bar': {
        backgroundColor: colors.grey_300,
      },
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      activeKey: props.initialTab ?? '0',
    };

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State): State | null {
    if (props.activeTabIndex === state.activeKey || !props.activeTabIndex) {
      return null;
    }
    return { activeKey: props.activeTabIndex };
  }

  setActiveTab = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderTabPanes(): Node {
    return this.props.tabPanes.map((tabPane, index) => (
      <TabPane
        data-testid="TabBarCompPane"
        tab={tabPane.title}
        key={tabPane.key ?? index}
      >
        {tabPane.content}
      </TabPane>
    ));
  }

  render() {
    return (
      <div
        role="tablist"
        css={
          this.props.kitmanDesignSystem
            ? [
                this.style.tabBar,
                this.style.tabBar_kitmanDesignSystem,
                // Serialize customStyles in case it’s not an object style.
                // Needed for compatibility.
                //
                // TODO: remove the following eslint-disable/enable comments
                // once object-styles-always ESLint rule is run in the
                // pipeline.
                css`
                  ${
                    /* eslint-enable */
                    this.props.customStyles
                  }
                `,

                this.props.customStyles,
              ]
            : this.style.tabBar
        }
      >
        <Tabs
          activeKey={this.state.activeKey}
          tabBarPosition="top"
          onChange={(tabKey) => {
            this.setActiveTab(tabKey);
            if (this.props.onClickTab) {
              this.props.onClickTab(tabKey);
            }
          }}
          renderTabBar={() => (
            <InkTabBar tabBarGutter={this.props.kitmanDesignSystem ? 16 : 0} />
          )}
          renderTabContent={() => <TabContent animated={false} />}
          destroyInactiveTabPane={this.props.destroyInactiveTabPane}
        >
          {this.renderTabPanes()}
        </Tabs>
      </div>
    );
  }
}

export default TabBarComp;
