// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors, zIndices } from '@kitman/common/src/variables';
import classNames from 'classnames';
import {
  Tooltip,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { ProcessedFile } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/hooks/useManageFiles';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';

type Props = {
  selectedFilesRef?: React$ElementRef<any>,
  filesToUpload?: Array<AttachedFile>,
  attachedFiles?: Array<Attachment>,
  uploadedFiles?: Array<ProcessedFile>,
  errorFileIds?: Array<string>,
  isProcessing?: boolean,
  fitContent?: boolean,
  hideTitle?: boolean,
  hideRemoveAction?: boolean,
  handleRemoveUploadedFile?: (file: File, id: string) => void,
  handleRemoveAttachedFile?: (id: number) => void,
};

const SelectedFiles = ({
  selectedFilesRef = null,
  filesToUpload = [],
  attachedFiles = [],
  uploadedFiles = [],
  errorFileIds = [],
  isProcessing = false,
  fitContent = false,
  hideTitle = false,
  hideRemoveAction = false,
  handleRemoveUploadedFile = undefined,
  handleRemoveAttachedFile = undefined,
  t,
}: I18nProps<Props>) => {
  const renderStatus = (uploaded, errored) => {
    if (isProcessing) {
      return (
        <Typography variant="body2" color="primary.main">
          {t('Processing...')}
        </Typography>
      );
    }
    if (uploaded) {
      return (
        <Typography variant="body2" color="success.main">
          {t('Processed')}
        </Typography>
      );
    }
    if (errored) {
      return (
        <Typography variant="body2" color="error">
          {t('Error! Please remove this file and try again.')}
        </Typography>
      );
    }
    return null;
  };

  const renderFile = ({
    id,
    name,
    type,
    size,
    uploaded,
    errored,
    onRemoveUploadedFile,
    onRemoveAttachedFile,
    url = null,
  }: {
    id: number | string,
    name: string,
    type: string,
    size: number,
    uploaded?: boolean,
    errored?: boolean,
    onRemoveUploadedFile?: (file: File, index: number) => void,
    onRemoveAttachedFile?: (id: number) => void,
    url?: string,
  }) => (
    <ListItem
      key={id}
      disableGutters
      secondaryAction={
        <>
          {url && (
            <Tooltip
              title={t('Preview')}
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
          {!hideRemoveAction && (
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
                onClick={url ? onRemoveAttachedFile : onRemoveUploadedFile}
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
      <ListItemText
        primary={`${name} - ${fileSizeLabel(size, true)}`}
        secondary={!url ? renderStatus(uploaded, errored) : null}
      />
    </ListItem>
  );

  if (filesToUpload.length === 0 && attachedFiles.length === 0) {
    return null;
  }

  return (
    <div ref={selectedFilesRef}>
      {!hideTitle && (
        <Typography variant="subtitle1" mt={2} fontWeight={500} gutterBottom>
          {t('Attached')}
        </Typography>
      )}
      <List dense sx={{ width: fitContent ? 'fit-content' : '100%' }}>
        {filesToUpload.map(({ id, file }) =>
          renderFile({
            id,
            name: file.name,
            type: file.type,
            size: file.size,
            uploaded: uploadedFiles
              .map((uploadedFile) => uploadedFile.fileId)
              .includes(id),
            errored: errorFileIds.includes(id),
            onRemoveUploadedFile: () =>
              handleRemoveUploadedFile(file, id.toString()),
          })
        )}
        {attachedFiles.map(
          ({ id, name, filetype, filesize, url }: Attachment) =>
            renderFile({
              id,
              name,
              type: filetype,
              size: filesize,
              onRemoveAttachedFile: () => handleRemoveAttachedFile(id),
              url,
            })
        )}
      </List>
    </div>
  );
};

export const SelectedFilesTranslated: ComponentType<Props> =
  withNamespaces()(SelectedFiles);
export default SelectedFiles;
