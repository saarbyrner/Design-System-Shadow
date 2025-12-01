// @flow
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/forms/src/components/FormAttachmentsSection/attachmentStyle';

// Types:
import type { ComponentType } from 'react';
import type { FormAttachment } from '@kitman/modules/src/Medical/shared/types/medical/QuestionTypes';

type Props = {
  attachment: FormAttachment,
};

const AttachmentDisplay = (props: I18nProps<Props>) => {
  return (
    <li
      css={style.attachmentItem}
      data-testid="AttachmentDisplay|AttachmentItem"
    >
      <div>
        <a
          data-testid="AttachmentDisplay|AttachmentLink"
          target="_blank"
          rel="noopener noreferrer"
          href={props.attachment.url}
          css={style.attachmentLink}
        >
          <i
            css={style.attachmentIcon}
            className={getContentTypeIcon(props.attachment.filetype)}
          />
          {props.attachment.filename}
        </a>
      </div>
      <div css={style.attachmentDetails}>
        {props.attachment.created_by && (
          <span data-testid="AttachmentDisplay|AttachedBy">
            <span css={style.detailLabel}>{props.t('Added by')}: </span>
            {props.attachment.created_by.fullname}
          </span>
        )}
        {props.attachment.attachment_date && (
          <span data-testid="AttachmentDisplay|AttachmentDate">
            <span css={style.detailLabel}>{props.t('Added on')}: </span>
            {DateFormatter.formatStandard({
              date: moment(props.attachment.attachment_date),
            })}
          </span>
        )}
      </div>
    </li>
  );
};

export const AttachmentDisplayTranslated: ComponentType<Props> =
  withNamespaces()(AttachmentDisplay);

export default AttachmentDisplay;
