// @flow

import Button from '@mui/material/Button';

type Props = {|
  onOpen: () => void,
  label?: string,
  disabled?: boolean,
  open?: boolean,
  id?: string,
|};

export default function AthleteSelectorTrigger({
  onOpen,
  label,
  disabled = false,
  open,
  id,
}: Props) {
  return (
    <Button
      variant="contained"
      onClick={onOpen}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open === true ? 'true' : 'false'}
      {...(id ? { 'aria-controls': id } : {})}
    >
      {label}
    </Button>
  );
}
