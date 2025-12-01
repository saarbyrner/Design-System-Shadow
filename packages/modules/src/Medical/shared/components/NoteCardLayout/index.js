// @flow
import type { Node } from 'react';

import { colors, breakPoints } from '@kitman/common/src/variables';
import { LineLoader } from '@kitman/components';

const getStyles = (
  withVerticalLayout: boolean = false,
  withBorder: boolean = false
) => ({
  content: {
    background: colors.p06,
    border: withBorder && `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
    display: 'flex',
    padding: withBorder && '24px',
    marginBottom: '8px',
    flexDirection: withVerticalLayout && 'column',
    position: 'relative',
    [`@media (max-width: ${breakPoints.tablet})`]: {
      display: 'block',
    },
  },
  loaderWrapper: {
    bottom: withVerticalLayout ? '-8px' : 0,
    height: '4px',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
  leftContent: {
    flex: 1,
    borderRight: !withVerticalLayout && `1px solid ${colors.neutral_300}`,
    borderBottom: withVerticalLayout && `1px solid ${colors.neutral_300}`,
    marginBottom: withVerticalLayout && '24px',
    paddingRight: !withVerticalLayout && '24px',
    paddingBottom: withVerticalLayout && '24px',

    [`@media (max-width: ${breakPoints.tablet})`]: {
      paddingBottom: '24px',
      borderBottom: `1px solid ${colors.neutral_300}`,
      paddingRight: 0,
      borderRight: 0,
    },
  },
  rightContent: {
    display: withVerticalLayout && 'flex',
    minWidth: !withVerticalLayout && '35%',
    maxWidth: !withVerticalLayout && '35%',
    paddingLeft: !withVerticalLayout && '24px',
    justifyContent: withVerticalLayout && 'space-between',
    color: colors.grey_300,

    '> div': {
      flex: 1,
    },

    [`@media (max-width: ${breakPoints.desktop})`]: {
      minWidth: !withVerticalLayout && '285px',
      maxWidth: !withVerticalLayout && '285px',
    },

    [`@media (max-width: ${breakPoints.tablet})`]: {
      paddingTop: '24px',
      paddingLeft: 0,
      minWidth: 0,
      maxWidth: '100%',
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'end',
    marginBottom: '16px',
  },
});

type ContentProps = {
  children: Node,
};

type Props = ContentProps & {
  withBorder?: boolean,
  withVerticalLayout?: boolean,
  isLoading?: boolean,
  id: number,
};

const LeftContent = (props: ContentProps) => {
  const styles = getStyles();
  return <div css={styles.leftContent}>{props.children}</div>;
};

const RightContent = (props: ContentProps) => {
  const styles = getStyles();
  return <div css={styles.rightContent}>{props.children}</div>;
};

const Actions = (props: ContentProps) => {
  const styles = getStyles();
  return <div css={styles.actions}>{props.children}</div>;
};

const NoteCardLayout = (props: Props) => {
  const styles = getStyles(props.withVerticalLayout, props.withBorder);

  return (
    <div
      data-testid="NoteCardLayout|Content"
      css={styles.content}
      id={props.id}
    >
      {props.isLoading && (
        <div css={styles.loaderWrapper} data-testid="NoteCardLayout|lineLoader">
          <LineLoader />
        </div>
      )}
      {props.children}
    </div>
  );
};

NoteCardLayout.LeftContent = LeftContent;
NoteCardLayout.RightContent = RightContent;
NoteCardLayout.Actions = Actions;

NoteCardLayout.defaultProps = {
  withVerticalLayout: false,
  withBorder: false,
};

export default NoteCardLayout;
