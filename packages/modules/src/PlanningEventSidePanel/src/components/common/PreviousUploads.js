// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import type { ComponentType } from 'react';

import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import { TextButton } from '@kitman/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../style';
import type { AttachmentDeleteType } from '../utils/types';
import type { EventFormData } from '../../types';
import { ATTACHMENT_DELETE_TYPE } from '../utils/enum-likes';

type Props = {
  event: EventFormData | Object,
  onOpenDeleteAttachmentModal: ({
    title: string,
    id: number,
    type: AttachmentDeleteType,
  }) => void,
};

export type TranslatedProps = I18nProps<Props>;

const PreviousUploads = (props: TranslatedProps) => {
  const confirmedAttachments = props.event.attachments?.filter(
    (eventAttachment) => eventAttachment.attachment?.confirmed === true
  );

  return (
    <>
      {confirmedAttachments?.length ? (
        <div data-testid="PreviousUploads|Attachments">
          <div css={style.headingSecondaryText}>{props.t('Attachments')}</div>
          <div css={style.uploadedFiles}>
            {confirmedAttachments?.map((eventAttachment) => (
              <div css={style.upload} key={eventAttachment.id}>
                <div>
                  <i
                    className={classNames(
                      getNewContentTypeColorfulIcons(
                        eventAttachment.attachment?.filetype
                      )
                    )}
                    css={style.icons}
                  />
                </div>
                <div>
                  <a
                    href={eventAttachment.attachment?.download_url}
                    css={style.attachments}
                    rel="noreferrer"
                  >
                    {eventAttachment.attachment?.name ||
                      eventAttachment.attachment?.filename}
                    {' - '}
                    {fileSizeLabel(eventAttachment.attachment?.filesize)}
                  </a>
                  <p>
                    <i>
                      Categories:{' '}
                      {eventAttachment.event_attachment_categories
                        ?.map((category) => category?.name)
                        .join(', ')}
                    </i>
                  </p>
                </div>
                <div
                  key={eventAttachment.attachment?.filename}
                  css={style.trashBin}
                >
                  <TextButton
                    onClick={() => {
                      const displayName =
                        eventAttachment.attachment?.name ||
                        eventAttachment.attachment?.filename;
                      props.onOpenDeleteAttachmentModal({
                        title: displayName,
                        id: eventAttachment.attachment?.id,
                        type: ATTACHMENT_DELETE_TYPE.ATTACHMENT,
                      });
                    }}
                    iconBefore="icon-bin"
                    type="subtle"
                    kitmanDesignSystem
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {props.event.attached_links?.length ? (
        <div data-testid="PreviousUploads|Links">
          <div css={style.headingSecondaryText}>{props.t('Links')}</div>
          {props.event?.attached_links?.map((eventLink) => (
            <div css={style.upload} key={eventLink.id}>
              <div>
                <i className="icon-link" css={style.icons} />
              </div>
              <div>
                <a
                  target="_blank"
                  href={eventLink.attached_link?.uri}
                  css={style.attachments}
                  rel="noreferrer"
                >
                  {eventLink.attached_link?.title}
                </a>
                <p>
                  <i>
                    Categories:{' '}
                    {eventLink.event_attachment_categories
                      ?.map((category) => category?.name)
                      .join(', ')}
                  </i>
                </p>
              </div>
              <div css={style.trashBin} data-testid="AttachedLink|BinIcon">
                <TextButton
                  onClick={() =>
                    props.onOpenDeleteAttachmentModal({
                      title: eventLink.attached_link.title ?? '',
                      id: eventLink.attached_link.id,
                      type: ATTACHMENT_DELETE_TYPE.ATTACHED_LINK,
                    })
                  }
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export const PreviousUploadsTranslated: ComponentType<Props> =
  withNamespaces()(PreviousUploads);
export default PreviousUploads;
