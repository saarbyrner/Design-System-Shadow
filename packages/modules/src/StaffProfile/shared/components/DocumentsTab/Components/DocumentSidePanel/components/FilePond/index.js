// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { renderToString } from 'react-dom/server';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box } from '@kitman/playbook/components';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import { filePondSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import type {
  FilePondError,
  FilePondWarning,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader/types';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { maxFileSize } from '@kitman/modules/src/ElectronicFiles/shared/consts';

type Props = {
  filePondRef: React$ElementRef<any>,
  onAddFile: (file: AttachedFile) => void,
  onLoadingAttachment: (file: AttachedFile) => void,
  onWarning: (warning: FilePondWarning, files: Array<File>) => void,
  onError: (error: FilePondError) => void,
  acceptedFileTypes: Array<string>,
  maxFiles?: number,
  disabled?: boolean,
  maxFileSize: string,
  hideFilePond: boolean,
};

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);

const AttachmentFilePond = ({
  filePondRef,
  acceptedFileTypes,
  onAddFile,
  onLoadingAttachment,
  onWarning,
  onError,
  maxFiles = null,
  disabled = false,
  t,
  hideFilePond,
}: I18nProps<Props>) => {
  const getIdleLabel = () => {
    return renderToString(
      <>
        <KitmanIcon name={KITMAN_ICON_NAMES.UploadFile} />
        <p>
          <span className="filepond--label-action">{t('Click to upload')}</span>
          {t(' or drag and drop')}
        </p>
        <p>{t('SVG, PNG, JPG or GIF (max. 3MB)')}</p>
      </>
    );
  };

  return (
    <Box
      sx={{
        ...(hideFilePond ? { display: 'none' } : {}),
        ...filePondSx,
      }}
    >
      <FilePond
        disabled={disabled}
        allowFileSizeValidation
        ref={filePondRef}
        allowDrop
        dropOnPage
        instantUpload={false}
        dropValidation={false}
        allowImagePreview={false}
        allowMultiple={false}
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
        onaddfilestart={onLoadingAttachment}
      />
    </Box>
  );
};

export const AttachmentFilePondTranslated: ComponentType<Props> =
  withNamespaces()(AttachmentFilePond);
export default AttachmentFilePond;
