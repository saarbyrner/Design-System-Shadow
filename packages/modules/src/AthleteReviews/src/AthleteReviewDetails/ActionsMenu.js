// @flow
import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@kitman/playbook/components';
import { MoreVert } from '@mui/icons-material';

type MenuItemType = { id: string, title: string, onClick: () => void };
type Props = { items: Array<MenuItemType> };

const ActionsMenu = ({ items }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ dense: true }}
      >
        {items.map((item) => (
          <MenuItem key={item.id} selected={false} onClick={item.onClick}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionsMenu;
