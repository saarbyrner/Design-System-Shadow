// @flow
import { withNamespaces } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import type { I18nProps } from '@kitman/common/src/types/i18n';

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

type Props = {
  maxFileSize?: string,
  onFileAddValidationError?: Function,
  onFileAddValidationSuccess?: Function,
  onFileRemoved?: Function,
  forwardedRef?: any,
};

const ImageAttachmentArea = (props: I18nProps<Props>) => {
  return (
    <div className="imageAttachmentArea">
      <FilePond
        // $FlowFixMe Ref on a component instead of an ElementType
        ref={props.forwardedRef}
        acceptedFileTypes={[
          'image/gif',
          'image/jpeg',
          'image/jpg',
          'image/png',
        ]}
        allowMultiple={false}
        allowImagePreview
        allowDrop
        allowPaste={false}
        allowReplace={false}
        allowRevert={false}
        allowRemove
        allowProcess={false}
        instantUpload={false}
        labelMaxFileSizeExceeded={props.t('File is too large')}
        labelIdle={`
        <div class="avatarUploader__dropAreaLabel">
        <img src='/img/image.svg'/>
        <p>${props.t(
          'Drag and drop a photo here'
        )}</p>or<div class="filepond--label-action">${props.t(
          'Browse a photo from your computer'
        )}</div></div>`}
        labelFileTypeNotAllowed={props.t('File type is not supported')}
        maxFileSize={
          props.maxFileSize === undefined ? '10MB' : props.maxFileSize
        }
        maxFiles={1}
        credits={false}
        imagePreviewHeight={310}
        imagePreviewMaxFileSize="10MB"
        imagePreviewMarkupShow={false}
        onremovefile={() => {
          if (props.onFileRemoved) {
            props.onFileRemoved();
          }
        }}
        onaddfile={(error, file) => {
          if (error) {
            if (props.onFileAddValidationError) {
              props.onFileAddValidationError(error, file);
            }
            return;
          }
          if (file && props.onFileAddValidationSuccess) {
            props.onFileAddValidationSuccess(file);
          }
        }}
      />
    </div>
  );
};

export default ImageAttachmentArea;
export const ImageAttachmentAreaTranslated =
  withNamespaces()(ImageAttachmentArea);
