// @flow
import { withNamespaces } from 'react-i18next';
import { AttachmentDisplayTranslated as AttachmentDisplay } from '@kitman/modules/src/Medical/forms/src/components/FormAttachmentsSection/AttachmentDisplay';
import style from '@kitman/modules/src/Medical/forms/src/components/FormAttachmentsSection/style';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { FormAttachment } from '@kitman/modules/src/Medical/shared/types/medical/QuestionTypes';

type Props = {
  attachments: Array<FormAttachment>,
};

const FormAttachmentsSection = (props: I18nProps<Props>) => {
  return (
    <div css={style.section} data-testid="AttachmentsSection|Attachments">
      <h2 className="kitmanHeading--L2">{props.t('Attachments')}</h2>
      <div css={style.subSection}>
        <h3 className="kitmanHeading--L3">{props.t('Files')}</h3>
        {props.attachments?.map((attachment) => (
          <AttachmentDisplay
            key={`attachment-${attachment.id}`}
            attachment={attachment}
          />
        ))}
      </div>
    </div>
  );
};

export const FormAttachmentsSectionTranslated: ComponentType<Props> =
  withNamespaces()(FormAttachmentsSection);

export default FormAttachmentsSection;
