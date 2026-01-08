// @flow
import { useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { Modal, TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ImageAttachmentAreaTranslated as ImageAttachmentArea } from './ImageAttachmentArea';

export type Props = {
  title: string,
  onClickCloseModal: Function,
  onClickSaveImage: Function,
};

function ImageUploadModal(props: I18nProps<Props>) {
  const FilePondInstance = useRef(null);
  const [validImage, setValidImage] = useState(false);

  const style = {
    content: css`
      padding: 0;
      background-color: ${colors.neutral_100};
      height: ${validImage ? '400px' : '440px'};
    `,
    container: css`
      padding: 0;
    `,
    error: css`
      font-weight: 600;
      font-size: 12px;
      color: ${colors.red_100};
    `,
  };

  const closeModal = () => {
    props.onClickCloseModal();
  };

  return (
    <Modal isOpen onPressEscape={closeModal} width="large" close={closeModal}>
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
        <button
          type="button"
          onClick={closeModal}
          className="reactModal__closeBtn icon-close"
        />
      </Modal.Header>
      <Modal.Content additionalStyle={style.content}>
        <div css={style.container}>
          <ImageAttachmentArea
            t={props.t}
            name="user[avatar]"
            onFileRemoved={() => {
              setValidImage(false);
            }}
            onFileAddValidationSuccess={() => {
              setValidImage(true);
            }}
            forwardedRef={FilePondInstance}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        {validImage && (
          <>
            <TextButton
              text={props.t('Reset photo')}
              onClick={() => {
                if (FilePondInstance.current) {
                  FilePondInstance.current.removeFile();
                }
              }}
              kitmanDesignSystem
            />
            <TextButton
              isDisabled={false}
              text={props.t('Save')}
              type="primary"
              onClick={() => {
                if (FilePondInstance.current) {
                  props.onClickSaveImage(
                    FilePondInstance.current.getFile().file
                  );
                }
              }}
              kitmanDesignSystem
            />
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ImageUploadModal;
export const ImageUploadModalTranslated = withNamespaces()(ImageUploadModal);
