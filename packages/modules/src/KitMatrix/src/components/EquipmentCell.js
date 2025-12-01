// @flow
import { Stack, Box, Popover } from '@kitman/playbook/components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState } from 'react';
import style from '../../style';

type Props = {
  color: string,
  imageUrl: string,
  type: string,
};

const EquipmentCell = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isKitManagementV2 = window.getFlag('league-ops-kit-management-v2');
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const renderAttachment = () => {
    return isKitManagementV2 ? (
      <Box display="flex" gap={2}>
        <AttachFileIcon
          css={{
            cursor: 'pointer',
            transform: 'rotate(30deg)',
            fontSize: '20px',
          }}
          aria-describedby={id}
          onClick={handleClick}
        />
        <span>{props.color}</span>
      </Box>
    ) : (
      <>
        <span>{props.color}</span>
        <AttachFileIcon
          css={style.attachment}
          aria-describedby={id}
          onClick={handleClick}
        />
      </>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      flex={1}
    >
      {renderAttachment()}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box p={1}>
          <img
            alt="equipment preview"
            src={props.imageUrl}
            css={style.imagePreview(props.type)}
          />
        </Box>
      </Popover>
    </Stack>
  );
};

export default EquipmentCell;
