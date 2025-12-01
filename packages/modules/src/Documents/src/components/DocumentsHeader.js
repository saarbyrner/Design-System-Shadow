// @flow
import { useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import { TextButton, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';

type Props = {
  allowedExtensions: string[],
  onUploadDocument: (file: File) => void,
};

const DocumentsHeader = (props: I18nProps<Props>) => {
  const documentFileInputRef = useRef(null);

  return (
    <header css={styles.header}>
      <h3 css={styles.title}>{props.t('Organization Documents')}</h3>
      <div css={styles.inputWrapper}>
        <label htmlFor="input-file">Upload file:</label>
        <input
          ref={documentFileInputRef}
          id="input-file"
          type="file"
          onChange={(event) => {
            TrackEvent('Organisation documents', 'Upload', 'Documents');
            props.onUploadDocument(event.target.files[0]);
            /* It is required resetting the value of the input because if the user
          tries to upload the same document twice, the onChange event is not triggered */

            // eslint-disable-next-line no-param-reassign
            event.target.value = '';
          }}
          accept={props.allowedExtensions
            .map((extension) => `.${extension}`)
            .join(',')}
        />
      </div>
      <div css={styles.action}>
        <TextButton
          text={props.t('Upload Document')}
          type="primary"
          kitmanDesignSystem
          onClick={() => documentFileInputRef.current?.click()}
        />
      </div>
      <div css={styles.mobileAction}>
        <TooltipMenu
          placement="bottom-end"
          menuItems={[
            {
              description: props.t('Upload Document'),
              onClick: () => documentFileInputRef.current?.click(),
            },
          ]}
          tooltipTriggerElement={
            <TextButton
              iconAfter="icon-more"
              type="secondary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      </div>
    </header>
  );
};

export const DocumentsHeaderTranslated: ComponentType<Props> =
  withNamespaces()(DocumentsHeader);
export default DocumentsHeader;
