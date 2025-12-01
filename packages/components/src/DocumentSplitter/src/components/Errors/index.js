// @flow
import uuid from 'uuid';
import { List, ListItem, FormHelperText } from '@kitman/playbook/components';

type Props = {
  errors?: ?Array<string>,
  wrapInHelperText?: boolean,
};

const Errors = ({ errors, wrapInHelperText = false }: Props) => {
  if (!errors) {
    return null;
  }

  const renderError = (error: string) => (
    <ListItem key={uuid()} dense disablePadding sx={{ lineHeight: 'inherit' }}>
      {error}
    </ListItem>
  );

  return (
    <List dense disablePadding>
      {errors?.map((error) => {
        return wrapInHelperText ? (
          <FormHelperText key={uuid()} error margin="dense">
            {renderError(error)}
          </FormHelperText>
        ) : (
          renderError(error)
        );
      })}
    </List>
  );
};

export default Errors;
