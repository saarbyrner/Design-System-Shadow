// @flow
import type { Node } from 'react';

import { colors } from '@kitman/common/src/variables';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

const styles = {
  tab: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    background: colors.white,
    boxShadow: `0px 1px 1px rgba(9, 30, 66, 0.25),
      0px 0px 1px rgba(9, 30, 66, 0.31)`,
    borderRadius: '3px',
    marginBottom: '10px',
    padding: '24px 0px 24px',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0px 24px',
  },
  title: {
    color: colors.grey_300,
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: '600',
    margin: '0',
    flex: '1',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 400,
  },
  actions: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'start',
  },
  filters: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '0px 24px',
  },
};

type Props = {
  children: Node,
  styles?: ObjectStyle,
};

const TabTitle = (props: Props) => {
  return <div css={[styles.title, props.styles]}>{props.children}</div>;
};

const TabSubTitle = (props: Props) => {
  return <div css={[styles.subtitle, props.styles]}>{props.children}</div>;
};

const TabActions = (props: Props) => {
  return <div css={[styles.actions, props.styles]}>{props.children}</div>;
};

const TabFilters = (props: Props) => {
  return (
    <div
      css={[styles.filters, props.styles]}
      className="planningTabLayoutFilters"
    >
      {props.children}
    </div>
  );
};

const TabContent = (props: Props) => {
  return <div css={props.styles}>{props.children}</div>;
};

const TabHeader = (props: Props) => {
  return (
    <div
      css={[styles.header, props.styles]}
      className="planningTabLayoutHeader"
    >
      {props.children}
    </div>
  );
};

const PlanningTab = (props: Props) => {
  return (
    <div css={[styles.tab, props.styles]} className="planningTabLayoutTab">
      {props.children}
    </div>
  );
};

PlanningTab.TabHeader = TabHeader;
PlanningTab.TabTitle = TabTitle;
PlanningTab.TabSubTitle = TabSubTitle;
PlanningTab.TabActions = TabActions;
PlanningTab.TabFilters = TabFilters;
PlanningTab.TabContent = TabContent;

export default PlanningTab;
