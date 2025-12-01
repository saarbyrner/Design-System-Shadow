// @flow
import { type Node, useState } from 'react';
import { MenuItem, Menu, Stack } from '@kitman/playbook/components';

type Item = {
  label: string,
  onClick: () => void,
  isDisabled?: boolean,
};

type ControlProps = {
  id: string,
  'aria-controls': string,
  'aria-expanded': string,
  'aria-haspopup': string,
  [key: string]: any,
};

type Props = {
  id: string,
  Control: (props: ControlProps) => Node,
  items: Array<Item>,
};

const Dropdown = ({ id, items, Control }: Props): Node => {
  const menuId = `${id}-menu`;
  const [anchorElement, setAnchorElement] = useState<?HTMLElement>(null);
  const isOpen = !!anchorElement;

  const handleClick = (event: SyntheticMouseEvent<HTMLButtonElement>) =>
    setAnchorElement(event.currentTarget);
  const handleClose = () => setAnchorElement(null);

  const renderItems = () => {
    return items.map((item) => (
      <MenuItem
        key={item.label}
        disabled={item.isDisabled}
        onClick={() => {
          handleClose();
          item.onClick();
        }}
      >
        {item.label}
      </MenuItem>
    ));
  };

  return (
    <Stack>
      <Control
        id={id}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={handleClick}
      />
      <Menu
        id={menuId}
        anchorEl={anchorElement}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': menuId,
        }}
      >
        {renderItems()}
      </Menu>
    </Stack>
  );
};

export default Dropdown;
