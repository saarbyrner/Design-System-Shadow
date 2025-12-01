// @flow
import { type Node, Fragment } from 'react';
import type { SerializedStyles } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';
import { TextButton } from '@kitman/components';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

const styles = {
  menu: {
    paddingTop: '4px',
    width: '100%',
    height: '100%',
  },
};

const List = (props: { children: Node, styles?: SerializedStyles }) => (
  <div css={[styles.menu, props.styles]}>{props.children}</div>
);

const groupStyles = {
  position: 'relative',
};
const Group = (props: { children: Node, styles?: SerializedStyles }) => (
  <div css={[groupStyles, props.styles]}>{props.children}</div>
);

const groupHeadingStyles = {
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px 4px',
    background: colors.white,
    borderBottom: `solid 1px ${colors.neutral_300}`,
  },
  headingActionsWrapper: {
    alignItems: 'center',
    display: 'flex',
  },
  headingActionsDivider: {
    backgroundColor: colors.grey_100,
    height: '12px',
    margin: '0 8px',
    width: '1px',
  },
  title: {
    color: colors.grey_200,
    fontWeight: 600,
    fontSize: '14px',
  },
  subTitle: {
    color: colors.grey_100,
    fontWeight: 600,
    fontSize: '12px',
  },
};

const GroupHeading = (props: {
  title: string,
  styles?: {
    heading?: ObjectStyle,
    title?: ObjectStyle,
    subTitle?: ObjectStyle,
  },
  actions?: Array<{
    label: string,
    onClick: Function,
    styles?: ObjectStyle,
  }>,
  isSubheading?: boolean,
  isSticky?: boolean,
}) => (
  <div
    css={[
      groupHeadingStyles.heading,
      props.isSticky && {
        position: 'sticky',
        top: 0,
        zIndex: 1,
      },
      props.styles?.heading,
    ]}
  >
    <div
      data-testid="List.GroupHeading|title"
      css={
        props.isSubheading
          ? [groupHeadingStyles.subTitle, props.styles?.subTitle]
          : [groupHeadingStyles.title, props.styles?.title]
      }
    >
      {props.title}
    </div>
    <div css={groupHeadingStyles.headingActionsWrapper}>
      {props.actions &&
        props.actions.length > 0 &&
        props.actions.map((action, index) => (
          <Fragment key={action.label}>
            <TextButton
              text={action.label}
              onClick={action.onClick}
              type="textOnly"
              size="small"
              kitmanDesignSystem
            />
            {index + 1 !== props.actions?.length && (
              <span css={groupHeadingStyles.headingActionsDivider} />
            )}
          </Fragment>
        ))}
    </div>
  </div>
);

const optionStyles = {
  option: {
    padding: '8px 16px',
    color: colors.grey_300,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',

    '&:hover': {
      backgroundColor: colors.neutral_300,
    },
  },
  titleContainer: {
    flex: 1,
  },
  subTitle: {
    color: colors.grey_100,
  },
};

const Option = (props: {
  title?: string,
  subTitle?: string,
  isBolder?: boolean,
  onClick?: Function,
  renderTitle?: Function,
  renderLeft?: Function,
  renderRight?: Function,
}) => {
  const renderDefaultTitle = () => (
    <>
      <span
        data-testid="List.Option|title"
        css={props.isBolder && { fontWeight: 600 }}
      >
        {props.title}
      </span>{' '}
      <span data-testid="List.Option|subTitle" css={optionStyles.subTitle}>
        {props.subTitle}
      </span>
    </>
  );

  return (
    <div
      data-testid="SquadList|Option"
      css={optionStyles.option}
      role="button"
      tabIndex={-1}
      onClick={props.onClick}
    >
      {typeof props.renderLeft === 'function' && props.renderLeft()}
      <div
        css={[
          optionStyles.titleContainer,
          typeof props.renderLeft === 'function' && { padding: '0 8px' },
        ]}
      >
        {typeof props.renderTitle === 'function' && props.renderTitle()}
        {!props.renderTitle && renderDefaultTitle()}
      </div>
      {typeof props.renderRight === 'function' && props.renderRight()}
    </div>
  );
};

List.Group = Group;
List.GroupHeading = GroupHeading;
List.Option = Option;

export default List;
