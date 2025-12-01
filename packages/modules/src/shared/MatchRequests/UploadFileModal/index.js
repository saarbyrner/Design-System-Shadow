// @flow
import { Modal, TextButton } from '@kitman/components';
import { I18nProps, withNamespaces } from 'react-i18next';
import { useState } from 'react';
import { FileDropzoneTranslated } from '@kitman/playbook/components/FileDropzone';
import { Box, Typography } from '@kitman/playbook/components';
import {
  docFileTypes,
  imageFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (file: AttachedFile) => void,
};

const MAX_FILE_SIZE_KB = 10000;

const UploadFileModal = ({
  isOpen,
  onClose,
  onSubmit,
  t,
}: I18nProps<Props>) => {
  const [files, setFiles] = useState<File[]>([]);

  const validateFile = (file: File): string | null => {
    const fileSizeKb = file.size / 1024;

    if (fileSizeKb >= MAX_FILE_SIZE_KB) {
      return t('File too large');
    }

    return null;
  };

  const handleSubmit = () => {
    // max files to upload is 1
    const file = files[0];

    if (!file) {
      return;
    }

    onSubmit({
      file,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    setFiles([]);
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
  };

  const isAttachmentValid = files.every((file) => !validateFile(file));

  return (
    <Modal isOpen={isOpen} onPressEscape={onClose} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>
          <Typography color="text.primary" fontWeight="600" fontSize="20px">
            {t('Upload scout attachment')}
          </Typography>
        </Modal.Title>
      </Modal.Header>

      <Modal.Content sx={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <Typography sx={{ mb: '6px' }} fileSize="14" color="text.primary">
          {t('Upload one scout attachment')}
        </Typography>
        <FileDropzoneTranslated
          value={files}
          setValue={setFiles}
          maxFiles={1}
          validateFile={validateFile}
          fileTypes={[...docFileTypes, ...imageFileTypes]}
          title={
            <Box display="flex" alignItems="center" mt="16px">
              <Typography
                sx={{ textDecoration: 'underline' }}
                color="text.primary"
              >
                {t('Click to upload')}
              </Typography>
              &nbsp;
              <Typography color="text.secondary">
                {t('or drag and drop')}
              </Typography>
            </Box>
          }
          subtitle={
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt="8px"
            >
              <Typography fontSize={14} color="text.secondary">
                SVG, PNG, JPG, GIF, Word, PDF
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {t('Max file size')}: {Math.round(MAX_FILE_SIZE_KB / 1000)}mb
              </Typography>
            </Box>
          }
        />
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          text={t('Cancel')}
          onClick={handleClose}
          type="secondary"
          kitmanDesignSystem
        />
        <TextButton
          text={t('Upload')}
          type="primary"
          onClick={handleSubmit}
          kitmanDesignSystem
          isDisabled={!files.length || !isAttachmentValid}
        />
      </Modal.Footer>
    </Modal>
  );
};

export const UploadFileModalTranslated = withNamespaces()(UploadFileModal);
export default UploadFileModal;
