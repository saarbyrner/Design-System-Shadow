// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { InlineAttachment } from '../../types/medical/QuestionTypes';
import { AttachmentDisplayTranslated as AttachmentDisplay } from '../../../forms/src/components/FormAttachmentsSection/AttachmentDisplay';

type Props = { inlineAttachment: InlineAttachment };

const style = {
  attachmentBlock: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    margin-top: 8px;
    margin-bottom: 16px;
    width: min-content;
    padding: 10px;
  `,
  signature: css`
    height: 70px;
    object-fit: contain;
  `,
  image: css`
    max-height: 400px;
    max-width: 800px;
    object-fit: contain;
  `,
  name: css`
    color: ${colors.grey_200};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin: 4px 0px 0px 4px;
  `,
  title: css`
    color: ${colors.grey_200};
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    margin-right: 4px;
  `,
};

const InlineAttachmentDisplay = (props: Props) => {
  if (!props.inlineAttachment?.attachment) {
    return null;
  }

  const isSignature = props.inlineAttachment.displayType === 'signature';
  const isImage = props.inlineAttachment.displayType === 'image';

  if (isSignature || isImage) {
    return (
      <div data-testid="InlineAttachmentDisplay">
        {props.inlineAttachment.title && (
          <span data-testid="InlineAttachmentDisplay|title" css={style.title}>
            {props.inlineAttachment.title}
          </span>
        )}

        {isSignature && props.inlineAttachment.signatureName && (
          <span css={style.name} data-testid="InlineAttachmentDisplay|name">
            {props.inlineAttachment.signatureName}
          </span>
        )}
        <div css={style.attachmentBlock}>
          <img
            data-testid={`InlineAttachmentDisplay|${
              isSignature ? 'signature' : 'image'
            }`}
            css={isSignature ? style.signature : style.image}
            src={props.inlineAttachment.attachment.url}
            alt={props.inlineAttachment.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div css={style.attachmentBlock}>
      <AttachmentDisplay attachment={props.inlineAttachment.attachment} />
    </div>
  );
};

export default InlineAttachmentDisplay;
