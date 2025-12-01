// @flow
import type { Node } from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@kitman/playbook/components/index';
import { colors } from '@kitman/common/src/variables';

const styles = {
  loading: {
    backgroundImage: `url('../../img/spinner.svg')`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '3.75rem',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    opacity: 0.4,
  },
  title: {
    color: colors.grey_300,
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
    marginBottom: '0.5rem',
  },
  header: {
    display: 'flex',
  },
  subheading: {
    color: colors.grey_300,
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: '1.22rem',
    margin: '0.75rem 0px 0.5rem 0px',
  },
  flex: {
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
  },
  divider: {
    borderTop: `solid 2px ${colors.neutral_300}`,
    width: `100%`,
    margin: `1.5rem 0`,
  },
  actions: {
    textAlign: 'right',
    position: 'absolute',
    right: 0,
    top: 0,
  },
};

type Props = {
  children: Node,
};

const CardLayout = (props: Props): Node => {
  return (
    <Card variant="outlined" sx={{ overflow: 'visible' }}>
      <CardContent sx={{ padding: '1.5rem' }}>{props.children}</CardContent>
    </Card>
  );
};

type titleProps = {
  title: string,
};

const Title = (props: titleProps): Node => {
  return (
    <Typography
      variant="h5"
      sx={{
        ...styles.title,
      }}
    >
      {props.title}
    </Typography>
  );
};

const Header = (props: Props): Node => {
  return <Typography component="div">{props.children}</Typography>;
};

const Subheading = (props: titleProps): Node => {
  return (
    <Typography
      variant="h5"
      sx={{
        ...styles.subheading,
      }}
    >
      {props.title}
    </Typography>
  );
};

const Actions = (props: Props): Node => {
  return <div css={styles.actions}>{props.children}</div>;
};

const Divider = () => <hr css={styles.divider} />;

const Flex = (props: Props): Node => {
  return <div css={styles.flex}>{props.children}</div>;
};

const Loading = () => {
  return <div css={styles.loading} />;
};

CardLayout.Loading = Loading;
CardLayout.Header = Header;
CardLayout.Title = Title;
CardLayout.Subheading = Subheading;
CardLayout.Actions = Actions;
CardLayout.Flex = Flex;
CardLayout.Divider = Divider;

export default CardLayout;
