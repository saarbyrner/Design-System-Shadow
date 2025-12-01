// @flow
import { renderToString } from 'react-dom/server';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useTheme } from '@mui/material/styles';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box, Typography, Alert } from '@kitman/playbook/components';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import type {
  FilePondError,
  FilePondWarning,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import {
  maxFileSize,
  maxNumberOfFiles,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { filePondSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';

type Props = {
  filePondRef: React$ElementRef<any>,
  onAddFile: (file: AttachedFile) => void,
  onWarning: (error: FilePondWarning, files: Array<File>) => void,
  onError: (error: FilePondError) => void,
  acceptedFileTypes: Array<string>,
  maxFiles?: number,
  disabled?: boolean,
};

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);

const FilePondInstance = ({
  filePondRef,
  acceptedFileTypes,
  onAddFile,
  onWarning,
  onError,
  maxFiles = null,
  t,
}: I18nProps<Props>) => {
  const theme = useTheme();
  const totalFilesSelected =
    filePondRef.current && filePondRef.current.getFiles
      ? filePondRef.current.getFiles().length
      : 0;

  const getIdleLabel = () => {
    return renderToString(
      <>
        <KitmanIcon name={KITMAN_ICON_NAMES.UploadFile} />
        <Typography fontFamily={theme.typography.fontFamily}>
          <span className="filepond--label-action">{t('Click to upload')}</span>
          {t(' or drag and drop')}
        </Typography>
        <Typography fontFamily={theme.typography.fontFamily}>
          {t(
            `(max file size: {{maxFileSize}}, max files: {{maxNumberOfFiles}})`,
            {
              maxFileSize,
              maxNumberOfFiles,
            }
          )}
        </Typography>
      </>
    );
  };

  const renderMaxFilesReachedWarning = () => (
    <Box>
      <Alert severity="warning">
        {t(
          `The maximum number of files allowed ({{maxNumberOfFiles}}) has been reached.`,
          { maxNumberOfFiles }
        )}
      </Alert>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          ...filePondSx,
          ...(totalFilesSelected === maxFiles && { display: 'none' }),
        }}
      >
        <FilePond
          ref={filePondRef}
          allowDrop
          dropOnPage
          allowMultiple
          instantUpload={false}
          dropValidation={false}
          allowImagePreview={false}
          removeFilesWithErrors
          acceptedFileTypes={acceptedFileTypes}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}
          labelIdle={getIdleLabel()}
          onaddfile={(error, file) => {
            if (error) {
              onError(error);
              filePondRef.current?.removeFile(file);
            } else {
              onAddFile(file);
            }
          }}
          onwarning={onWarning}
        />
      </Box>
      {totalFilesSelected === maxFiles && renderMaxFilesReachedWarning()}
    </>
  );
};

export const FilePondInstanceTranslated: ComponentType<Props> =
  withNamespaces()(FilePondInstance);
export default FilePondInstance;
