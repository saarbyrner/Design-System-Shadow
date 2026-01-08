// @flow
import type { Node } from 'react';
import { useRef, useLayoutEffect, useState } from 'react';

import { colors, breakPoints } from '@kitman/common/src/variables';

import { css } from '@emotion/react';

const styles = {
  tab: css`
    position: relative;
  `,
  getBodyStyles: (height?: string) => css`
    height: ${height} !important;
    background: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 16px;
  `,
  content: css`
    margin-top: 8px;
    overflow-y: auto;
  `,
  header: css`
    display: flex;
    flex-direction: row;
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    flex: 1;
  `,
  actions: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  `,
  filters: css`
    display: flex;
    flex-direction: row;
    gap: 8px;

    @media (max-width: ${breakPoints.desktop}) {
      flex-direction: column;
      gap: 0px;
    }
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }
    @media (max-width: ${breakPoints.desktop}) {
      width: 100%;
    }
  `,
  loading: css`
    background-image: url('../../img/spinner.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    opacity: 0.4;
  `,
};

type Props = {
  children: Node,
};

type StyleChangesProps = {
  shouldMinimizeEmptySpaces?: boolean,
};

const gridBottomMarginToHideOverflowOnBody = '21px';

const TabLayout = (props: Props): Node => {
  return <div css={styles.tab}>{props.children}</div>;
};

const Title = (props: Props): Node => {
  return <h3 css={styles.title}>{props.children}</h3>;
};

const Header = (props: Props): Node => {
  return <div css={styles.header}>{props.children}</div>;
};

const Actions = (props: Props): Node => {
  return <div css={styles.actions}>{props.children}</div>;
};

const Filters = (props: Props & StyleChangesProps): Node => {
  return (
    <div
      css={[
        styles.filters,
        props.shouldMinimizeEmptySpaces ? { minHeight: '4rem' } : '',
      ]}
    >
      {props.children}
    </div>
  );
};

const Filter = (props: Props): Node => {
  return <div css={styles.filter}>{props.children}</div>;
};

const Content = (props: Props & StyleChangesProps): Node => {
  return (
    <div
      css={[
        styles.content,
        props.shouldMinimizeEmptySpaces ? { marginTop: 0 } : '',
      ]}
    >
      {props.children}
    </div>
  );
};

type BodyProps = Props & {
  gridBottomMarginToHideOverflowOnBody?: string,
} & StyleChangesProps;

const Body = (props: BodyProps): Node => {
  const tabContainerRef = useRef();
  const [height, setHeight] = useState();

  const enforcedMaxHeight =
    props?.gridBottomMarginToHideOverflowOnBody ||
    gridBottomMarginToHideOverflowOnBody;

  useLayoutEffect(() => {
    if (tabContainerRef.current) {
      const { y } = tabContainerRef?.current?.getBoundingClientRect();
      setHeight(`calc((100vh - ${y}px) - ${enforcedMaxHeight})`);
    }
  }, [tabContainerRef, enforcedMaxHeight]);

  return (
    <div
      // $FlowIgnore[incompatible-type] ref is valid here
      ref={tabContainerRef}
      css={[
        styles.getBodyStyles(height),
        props.shouldMinimizeEmptySpaces ? { gap: 0, padding: 0 } : '',
      ]}
    >
      {props.children}
    </div>
  );
};
const Loading = () => {
  return <div css={styles.loading} data-testid="Loading" />;
};

TabLayout.Header = Header;
TabLayout.Title = Title;
TabLayout.Actions = Actions;
TabLayout.Filters = Filters;
TabLayout.Filter = Filter;
TabLayout.Body = Body;
TabLayout.Content = Content;
TabLayout.Loading = Loading;

/**
 * This will be deprecated in favour of MUI layout
 * For now, it's used in multiple places so moving to the shared directory is best
 */

export default TabLayout;
