// @flow
import { FormHelperText, Fade } from '@kitman/playbook/components';
import style from '@kitman/modules/src/Contacts/style';
import type {
  CreateContactFormErrors,
  ReviewContactFormErrors,
} from '../../shared/types';

type Props = {
  name: string,
  errors: CreateContactFormErrors | ReviewContactFormErrors,
};

const FieldError = ({ name, errors }: Props) => {
  if (!errors[name]) return null;

  return (
    <Fade in timeout={250}>
      <FormHelperText css={style.errorText}>{errors[name]}</FormHelperText>
    </Fade>
  );
};

export default FieldError;
