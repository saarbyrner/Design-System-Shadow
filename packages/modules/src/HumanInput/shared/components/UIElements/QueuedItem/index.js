// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  Box,
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Paper,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Tooltip,
} from '@kitman/playbook/components';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import zIndices from '@kitman/common/src/variables/zIndices';

type Props = {
  hideDeleteButton: ?boolean,
  queuedItem: QueuedItemType,
  onUpload: Function,
  onDelete: Function,
};

const QueuedItem = (props: I18nProps<Props>) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const statusColor = () => {
    return props.queuedItem.state === 'FAILURE' ? colors.red_100 : null;
  };

  const isImageType =
    props.queuedItem.file &&
    imageFileTypes.includes(props.queuedItem.file.fileType);
  const hasUrl = Boolean(props.queuedItem?.file?.blobUrl);

  const getUploadActions = () => {
    switch (props.queuedItem.state) {
      case 'PENDING':
        return <CircularProgress size={32} />;
      case 'SUCCESS':
        return (
          <>
            {isImageType && hasUrl && (
              <Button size="small" variant="secondary" onClick={handleOpen}>
                {props.t('View')}
              </Button>
            )}
            {!props.hideDeleteButton && (
              <IconButton aria-label="delete" onClick={props.onDelete}>
                <KitmanIcon
                  name={KITMAN_ICON_NAMES.Delete}
                  fontSize="small"
                  sx={{
                    color: statusColor(),
                  }}
                />
              </IconButton>
            )}
            <KitmanIcon
              name={KITMAN_ICON_NAMES.CheckCircle}
              sx={{
                color: colors.green_100,
              }}
            />
          </>
        );
      case 'FAILURE':
        return (
          <IconButton aria-label="delete" onClick={props.onDelete}>
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Delete}
              fontSize="small"
              sx={{
                color: statusColor(),
              }}
            />
          </IconButton>
        );
      case 'IDLE':
      default:
        return (
          <>
            {isImageType && hasUrl && (
              <Button size="small" variant="secondary" onClick={handleOpen}>
                {props.t('View')}
              </Button>
            )}
            <IconButton aria-label="delete" onClick={props.onDelete}>
              <KitmanIcon
                name={KITMAN_ICON_NAMES.Delete}
                fontSize="small"
                sx={{
                  color: statusColor(),
                }}
              />
            </IconButton>

            <IconButton
              aria-label="upload"
              variant="secondary"
              onClick={props.onUpload}
            >
              <KitmanIcon
                name={KITMAN_ICON_NAMES.FileUpload}
                fontSize="small"
                sx={{
                  color: statusColor(),
                }}
              />
            </IconButton>
          </>
        );
    }
  };

  return (
    <>
      <Paper elevation={1}>
        <ListItem>
          {isImageType ? (
            <Avatar
              variant="square"
              src={props.queuedItem.file?.blobUrl || ''}
              sx={{ mr: 1, width: 50, height: 50 }}
            />
          ) : (
            <ListItemIcon>
              <KitmanIcon
                name={KITMAN_ICON_NAMES.UploadFile}
                sx={{
                  color: statusColor(),
                }}
              />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Tooltip
                title={props.queuedItem.file?.filename}
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: zIndices.tooltip,
                    },
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: statusColor(),
                  }}
                  noWrap
                >
                  {props.queuedItem.file?.filename}
                </Typography>
              </Tooltip>
            }
            secondary={
              <Typography
                sx={{
                  display: 'inline',
                  color: statusColor(),
                }}
                component="span"
                variant="body2"
              >
                {props.queuedItem?.message}
              </Typography>
            }
            primaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
            secondaryTypographyProps={{ style: { whiteSpace: 'normal' } }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {getUploadActions()}
          </Box>
        </ListItem>
      </Paper>
      {isImageType && (
        <Dialog
          open={openModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {props.queuedItem.file.filename}
          </DialogTitle>
          <DialogContent>
            <Box
              component="img"
              sx={{
                maxHeight: { xs: 550, md: 450 },
                maxWidth: { xs: 650, md: 550 },
              }}
              alt={props.t('Avatar image')}
              src={props.queuedItem.file?.blobUrl || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="secondary" onClick={handleClose} autoFocus>
              {props.t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default QueuedItem;
export const QueuedItemTranslated = withNamespaces()(QueuedItem);
