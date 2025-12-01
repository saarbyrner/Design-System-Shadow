// @flow
import {
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from '@kitman/playbook/components';

type Props = {
  checked: boolean,
  permissionName: string,
  permissionKey: string,
  description: string,
  handleChange: Function,
  disabled: boolean,
};

const PermissionCheckbox = ({
  checked,
  handleChange,
  permissionName,
  permissionKey,
  description,
  disabled = false,
}: Props) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            name={permissionKey}
            disabled={disabled}
          />
        }
        label={permissionName}
      />
      <FormHelperText sx={{ pl: 4 }}>{description}</FormHelperText>
    </>
  );
};

export default PermissionCheckbox;
