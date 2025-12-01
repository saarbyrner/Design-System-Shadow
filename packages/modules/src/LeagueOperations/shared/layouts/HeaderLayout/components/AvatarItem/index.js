// @flow
import type { Node } from 'react';
import { Stack } from '@kitman/playbook/components/index';
import TextItem from '../TextItem';
import HeaderAvatar from '../HeaderAvatar';

type Props = {
  primary: string,
  secondary?: Node,
  src: ?string,
};

const AvatarItem = (props: Props) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ minWidth: '90px' }}
    >
      <HeaderAvatar src={props.src} alt={props.primary} variant="small" />
      <TextItem primary={props.primary} secondary={props.secondary} />
    </Stack>
  );
};

export default AvatarItem;
