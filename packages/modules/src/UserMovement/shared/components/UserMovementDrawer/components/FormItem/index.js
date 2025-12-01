// @flow
import {
  Typography,
  ListItem,
  ListItemText,
} from '@kitman/playbook/components';

type Props = {
  primary: string,
  secondary: string,
};

const FormItem = (props: Props) => {
  return (
    <ListItem sx={{ px: 0 }} dense>
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {props.primary}
          </Typography>
        }
        secondary={
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {props.secondary}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default FormItem;
