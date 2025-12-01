// @flow
import React, { useState } from 'react';
import { IconButton, Menu, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Props = {
  children: React$Node,
};

export default function GridRowActions({ children }: Props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Wrap children with injected onClick to close menu
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const originalOnClick = child.props.onClick;
      return React.cloneElement(child, {
        onClick: (event) => {
          if (originalOnClick) originalOnClick(event);
          handleClose();
        },
      });
    }
    return child;
  });

  return (
    <Box data-testid="GridRowActions">
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {wrappedChildren}
      </Menu>
    </Box>
  );
}
