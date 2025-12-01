// @flow
import type { Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { Box, TabPanel } from '@kitman/playbook/components';
import {
  APP_BAR_HEIGHT,
  TITLE_BAR_HEIGHT,
  TABS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';

type Props = {
  children: Node,
  // eslint-disable-next-line react/no-unused-prop-types
  withTabs?: boolean,
};

type HeaderProps = Props & {
  headerOffset?: number,
};

const Header = ({
  headerOffset = 0,
  withTabs = false,
  children,
}: HeaderProps): Node => {
  return (
    <Box
      sx={{
        pb: 1,
        background: colors.white,
        minHeight: `${TITLE_BAR_HEIGHT - headerOffset}px`,
        borderBottom: withTabs ? 0 : 1,
        borderColor: colors.grey_disabled,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      {children}
    </Box>
  );
};

const Content = (props: Props): Node => {
  return (
    <Box
      sx={{
        height: `calc(100vh - ${APP_BAR_HEIGHT + TITLE_BAR_HEIGHT}px)`,
        flexGrow: 1,
        background: colors.white,
        overflowY: 'hidden',
        position: 'relative',
      }}
    >
      {props.children}
    </Box>
  );
};

type TabProps = Props & {
  value: string,
};

const TabContent = (props: TabProps): Node => {
  return (
    <TabPanel
      value={props.value}
      key={props.value}
      sx={{
        overflowY: 'auto',
        height: `calc(100vh - ${
          APP_BAR_HEIGHT + TITLE_BAR_HEIGHT + TABS_HEIGHT
        }px)`,
        background: colors.background,
        p: 0,
      }}
    >
      {props.children}
    </TabPanel>
  );
};

const PageLayout = (props: Props): Node => {
  const headerHeight = useAppHeaderHeight();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        height: `calc(100dvh - ${headerHeight}px)`,
        background: colors.background,
      }}
    >
      {props.children}
    </Box>
  );
};

const Loading = () => {
  return <FormLayout.Loading />;
};

PageLayout.Header = Header;
PageLayout.Content = Content;
PageLayout.TabContent = TabContent;
PageLayout.Loading = Loading;

export default PageLayout;
