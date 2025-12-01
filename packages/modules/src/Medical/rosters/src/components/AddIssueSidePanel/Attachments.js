// @flow
import { css } from '@emotion/react';
import { NoteAttachmentTranslated as NoteAttachment } from './NoteAttachment';
import type { DiagnosisAttachments } from '../../../types';

type Props = {
  setAllowCreateIssue: Function,
  onRemoveAdditionalAnnotation: Function,
  onUpdateAnnotationContent: Function,
  onUpdateAnnotationVisibility: Function,
  onAddAttachment: Function,
  onSelectAnnotationFiles: Function,
  selectedAttachments: Array<DiagnosisAttachments>,
  uploadQueuedAttachments: boolean,
  areAnnotationsInvalid: boolean,
};

const style = {
  section: css`
    padding: 0 24px;
  `,
  attachmentSection: css`
    margin-top: 16px;
    padding: 0 24px;
  `,
  row: css`
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  `,
};

const Attachments = (props: Props) => {
  const renderAttachments = (attachment, index) => {
    if (attachment.type === 'NOTE') {
      return (
        <NoteAttachment
          attachment={attachment}
          onRemove={() => props.onRemoveAdditionalAnnotation(index)}
          onUpdateContent={(value) =>
            props.onUpdateAnnotationContent(index, value)
          }
          onUpdateVisibility={(value) =>
            props.onUpdateAnnotationVisibility(index, value)
          }
          onAddAttachment={(files) => props.onAddAttachment(index, files)}
          onSelectFiles={(files) => props.onSelectAnnotationFiles(index, files)}
          uploadQueuedAttachments={props.uploadQueuedAttachments}
          setAllowCreateIssue={props.setAllowCreateIssue}
          areAnnotationsInvalid={props.areAnnotationsInvalid}
        />
      );
    }
    return null;
  };

  return (
    <>
      {props.selectedAttachments.map((attachment, index) => (
        <div key={attachment.id} css={[style.section, style.attachmentSection]}>
          {renderAttachments(attachment, index)}
        </div>
      ))}
    </>
  );
};

export default Attachments;
