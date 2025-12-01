// @flow

import { withNamespaces } from 'react-i18next';
import { TextButton, Modal, FileUploadField } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { css } from '@emotion/react';
import {
  docFileTypes,
  imageFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';

type Props = {
  title?: string;
  isOpen: boolean,
  onClose: (boolean) => void,
  uploadedFile: ?AttachedFile,
  setUploadedFile: (?AttachedFile) => void,
  onUpload: (?AttachedFile) => void,
  uploadButtonText: string,
};

const SimpleAttachmentUploadModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.isOpen}
      width="x-large"
      onPressEscape={props.onClose}
      onClose={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.title ?? props.t('Upload Attachment')}</Modal.Title>
      </Modal.Header>

      <Modal.Content
        additionalStyle={css`
          margin-bottom: 10px;
        `}
      >
        <FileUploadField
          updateFiles={(files) => {
            if (files[0]?.id !== props.uploadedFile?.id)
              props.setUploadedFile(files[0]);
          }}
          acceptedFileTypes={[...docFileTypes, ...imageFileTypes]}
          kitmanDesignSystem
          maxFiles={1}
          labelIdleText={props.uploadButtonText}
        />
      </Modal.Content>

      <Modal.Footer showBorder>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.onClose}
          type="secondary"
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Upload')}
          type="primary"
          onClick={() => props.onUpload(props.uploadedFile)}
          kitmanDesignSystem
          isDisabled={!props.uploadedFile}
        />
      </Modal.Footer>
    </Modal>
  );
};

export const SimpleAttachmentUploadModalTranslated = withNamespaces()(
  SimpleAttachmentUploadModal
);
export default SimpleAttachmentUploadModal;
