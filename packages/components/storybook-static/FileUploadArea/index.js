// @flow
import { withNamespaces } from 'react-i18next';
import {
  acceptedFileTypes,
  audioFileTypes,
  docFileTypes,
  imageFileTypes,
  textFileTypes,
  videoFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';
import { FileUploadFieldTranslated as FileUploadField } from '../FileUploadField';
import TextButton from '../TextButton';
import type { Props as FileUploadFieldProps } from '../FileUploadField';

type Props = {
  ...FileUploadFieldProps,
  areaTitle?: string,
  areaTitleSubtext?: string,
  showActionButton: boolean,
  testIdPrefix: string,
  isFileError: boolean,
  acceptedFileTypeCode?: 'default' | 'diagnostics' | 'imageVideo',
  actionIcon?: string,
  onClickActionButton?: Function,
};

export const acceptedFileFormats = {
  default: acceptedFileTypes,
  diagnostics: [
    ...docFileTypes,
    ...audioFileTypes,
    ...videoFileTypes,
    ...imageFileTypes,
    ...textFileTypes,
  ],
  imageVideo: [
    ...imageFileTypes,
    ...videoFileTypes,
    'application/pdf',
    'application/mp3',
  ],
};

const FileUploadArea = (props: I18nProps<Props>) => {
  const {
    onClickActionButton,
    isFileError,
    showActionButton,
    areaTitle,
    areaTitleSubtext,
    actionIcon,
    acceptedFileTypeCode = 'default',
    testIdPrefix,
  } = props;

  const headerStyleArray = [style.attachmentsHeader];
  const fieldStyleArray = [];
  if (!showActionButton) headerStyleArray.push(style.noButtonExtraMargin);
  if (areaTitle === undefined) {
    fieldStyleArray.push(style.noHeaderRepositionTitle);
  }
  if (isFileError) fieldStyleArray.push(style.uploadedFilesError);

  return (
    <>
      <div css={style.row} data-testid={`${testIdPrefix}|FileAttachment`}>
        <div css={headerStyleArray}>
          <h3 className="kitmanHeading--L3">{areaTitle}</h3>
          <span>{areaTitleSubtext}</span>
          {showActionButton && onClickActionButton && (
            <TextButton
              onClick={() => onClickActionButton()}
              iconBefore={actionIcon}
              type="subtle"
              kitmanDesignSystem
            />
          )}
        </div>
        <div css={fieldStyleArray}>
          <FileUploadField
            {...props}
            acceptedFileTypes={
              props.acceptedFileTypes ||
              acceptedFileFormats[acceptedFileTypeCode]
            }
            kitmanDesignSystem
          />
        </div>
      </div>
    </>
  );
};

export const FileUploadAreaTranslated = withNamespaces()(FileUploadArea);
export default FileUploadArea;
