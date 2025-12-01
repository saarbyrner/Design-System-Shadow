// @flow
import { useRef, type ComponentType, type Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FormDocumentUploaderTranslated as FormDocumentUploader } from '@kitman/modules/src/shared/MassUpload/components/FormDocumentUploader';
import { type SetState } from '@kitman/common/src/types/react';
import { ACCEPTED_FILE_TYPES } from '@kitman/modules/src/shared/MassUpload/utils/consts';

const styles = {
  dormant: {
    container: {
      margin: '22px 0px',

      '.filepond--drop-label': {
        minHeight: '300px !important',

        label: {
          marginTop: '2px !important',
        },

        '&::before': {
          fontSize: '20px !important',
          top: '36% !important',
        },

        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  },
};

type UploadQueue = {
  attachment: ?AttachedFile,
};

type Props = {
  queueState: UploadQueue,
  onParseCSV: Function,
  onRemoveCSV: Function,
  setHasFilePondErrored: SetState<boolean>,
  setHasFilePondProcessed: SetState<boolean>,
};

const DormantState = (props: I18nProps<Props>): Node => {
  const inputFile = useRef(null);

  return (
    <div ref={inputFile} css={styles.dormant.container}>
      <FormDocumentUploader
        files={
          (props.queueState?.attachment && [props.queueState?.attachment]) || []
        }
        acceptedFileTypes={ACCEPTED_FILE_TYPES.FilePond}
        setFiles={props.onParseCSV}
        removeFile={props.onRemoveCSV}
        allowMultiple={false}
        customIdleLabel={props.t(`Accepted file types: {{acceptedFileType}}`, {
          acceptedFileType: ACCEPTED_FILE_TYPES.Text,
        })}
        customToast={{
          title: props.t('Failed to upload {{fileName}}', {
            fileName: props.queueState.attachment?.filename,
          }),
          description: props.t(
            'The file you tried to upload is not a valid {{acceptedFileType}} file. Try another file.',
            { acceptedFileType: ACCEPTED_FILE_TYPES.Text }
          ),
        }}
        setHasFilePondErrored={props.setHasFilePondErrored}
        setHasFilePondProcessed={props.setHasFilePondProcessed}
      />
    </div>
  );
};

const DormantStateTranslated: ComponentType<Props> =
  withNamespaces()(DormantState);
export default DormantStateTranslated;
