// @flow

import { withNamespaces, setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { IconButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type Error = {
  messages: ?Array<string>,
  totalRows: ?number,
  skippedRows: ?number,
};

type Props = {
  value?: ?File,
  onChange: Function,
  text?: string,
  isDisabled?: boolean,
  errors?: Error,
};

setI18n(i18n);

const InputFile = (props: I18nProps<Props>) => {
  let fileInput;

  const openFileSelector = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeFile = () => {
    if (fileInput) {
      fileInput.value = '';
    }
    props.onChange(null);
  };

  const selectedFileContent = () => (
    <div className="inputFile__selectedFile">
      <span className="inputFile__selectedFileDocumentIcon icon-document" />
      <span>{props.value ? props.value.name : null}</span>
      <span
        data-testid="InputFile|RemoveFile"
        className="inputFile__selectedFileCloseIcon icon icon-close"
        onClick={removeFile}
      />
    </div>
  );

  const fileButton = () => (
    <IconButton
      icon="icon-upload"
      text={props.text || props.t('Select a file')}
      onClick={openFileSelector}
      isDisabled={!!props.isDisabled}
    />
  );

  const fileContent = () =>
    props.value ? selectedFileContent() : fileButton();

  const handleFileChange = (event) => {
    if (event.target && event.target.files[0]) {
      props.onChange(event.target.files[0]);
    }
  };

  const renderErrors = () => {
    if (
      props.errors &&
      props.errors.messages &&
      props.errors.messages.length > 0
    ) {
      const errors = props.errors.messages.map((errorMsg, index) => (
        /* eslint-disable react/no-array-index-key */
        <div className="inputFile__errorLine" key={index}>
          {errorMsg}
        </div>
        /* eslint-enable react/no-array-index-key */
      ));
      return (
        <div className="inputFile__errors" data-testid="InputFile|Errors">
          <p className="inputFile__errorTitle">
            {props.t(
              'The uploaded file contains errors and cannot be processed, no data has been added.'
            )}
          </p>
          <div className="inputFile__errorSum">
            {props.t('{{skippedRows}} of {{totalRows}} rows contain errors.', {
              skippedRows: props.errors ? props.errors.skippedRows : '',
              totalRows: props.errors ? props.errors.totalRows : '',
            })}
          </div>
          {errors}
        </div>
      );
    }
    return null;
  };

  return (
    <div data-testid="InputFile" className="inputFile__wrapper">
      <input
        name="file"
        type="file"
        className="hidden d-none"
        onChange={handleFileChange}
        ref={(el) => {
          fileInput = el;
        }}
      />

      {fileContent()}
      {renderErrors()}
    </div>
  );
};

export const InputFileTranslated = withNamespaces()(InputFile);
export default InputFile;
