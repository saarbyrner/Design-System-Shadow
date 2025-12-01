// @flow
import { withNamespaces } from 'react-i18next';
import { colors, zIndices } from '@kitman/common/src/variables';
import classNames from 'classnames';
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FileStatus } from '@kitman/common/src/utils/fileHelper';

export type BasicFileDetails = {
  id: number | string,
  name: string,
  type: string,
  size: number,
  url?: string,
  status?: FileStatus,
  progressPercentage?: number,
};

type Props = {
  fileDetails: BasicFileDetails,
  showFileStatus: boolean,
  handleRemoveFile?: (fileId: string) => void, // Omit to not show file removal button
  tooltipText?: string,
};

const FileDisplay = ({
  fileDetails,
  showFileStatus,
  tooltipText,
  handleRemoveFile,
  t,
}: I18nProps<Props>) => {
  const { id, name, type, size, url, status, progressPercentage } = fileDetails;

  const canRemoveFile =
    !!handleRemoveFile &&
    (!status ||
      status === 'pending' ||
      status === 'confirmed' ||
      status === 'errored');

  const renderStatus = () => {
    switch (status) {
      case 'inprogress': {
        return (
          <>
            <Typography variant="body2" color="primary.main">
              {`${t('Processing')}...`}
            </Typography>
            <Box sx={{ width: '40%' }}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
              />
            </Box>
          </>
        );
      }
      case 'uploaded': {
        return (
          <Typography variant="body2" color="primary.main">
            {`${t('Confirming')}...`}
          </Typography>
        );
      }

      case 'confirmed': {
        return (
          <Typography variant="body2" color="success.main">
            {t('Completed')}
          </Typography>
        );
      }
      case 'errored': {
        return (
          <Typography variant="body2" color="error">
            {t('Error! Please remove this file and try again.')}
          </Typography>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <ListItem
      key={id}
      disableGutters
      secondaryAction={
        <>
          {url && (
            <Tooltip
              title={tooltipText || t('Preview')}
              slotProps={{
                popper: {
                  sx: { zIndex: zIndices.toastDialog },
                },
              }}
            >
              <IconButton
                edge="end"
                size="small"
                onClick={() => window.open(url, '_blank').focus()}
                sx={{ mr: '3px' }}
              >
                <KitmanIcon
                  color="primary"
                  name={KITMAN_ICON_NAMES.OpenInNewOutlined}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          )}
          {canRemoveFile && (
            <Tooltip
              title={t('Remove')}
              slotProps={{
                popper: {
                  sx: { zIndex: zIndices.toastDialog },
                },
              }}
            >
              <IconButton
                edge="end"
                size="small"
                onClick={() => {
                  handleRemoveFile?.(id.toString());
                }}
              >
                <KitmanIcon
                  color="primary"
                  name={KITMAN_ICON_NAMES.DeleteOutline}
                />
              </IconButton>
            </Tooltip>
          )}
        </>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ width: 35, height: 35, bgcolor: colors.neutral_300 }}>
          <i className={classNames(getNewContentTypeColorfulIcons(type))} />
        </Avatar>
      </ListItemAvatar>
      <></>
      <Stack spacing={0} sx={{ width: '100%' }}>
        <Typography variant="body1" color="primary.main">
          {`${name} - ${fileSizeLabel(size, true)}`}
        </Typography>
        {showFileStatus && status && renderStatus()}
      </Stack>
    </ListItem>
  );
};

export const FileDisplayDetailsTranslated: ComponentType<Props> =
  withNamespaces()(FileDisplay);
export default FileDisplay;
