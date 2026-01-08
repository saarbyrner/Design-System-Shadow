// @flow
import { forwardRef, type Node } from 'react';
import { Button } from '@kitman/playbook/components';
import { KeyboardArrowDown as ArrowDropDown } from '@mui/icons-material';

type Props = {|
  children?: Node,
  setOpen: (boolean) => void,
  id?: string,
|};

export const ButtonDatePicker: any = forwardRef(function ButtonDatePicker(
  props: Props,
  ref: any
) {
  const { children, setOpen, id } = props;

  return (
    <Button
      ref={ref}
      id={id}
      onClick={() => setOpen(true)}
      variant="text"
      endIcon={<ArrowDropDown />}
    >
      {children}
    </Button>
  );
});
