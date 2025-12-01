// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
  section: css`
    margin-bottom: 16px;
  `,
  title: css`
    margin-bottom: 8px;
    text-transform: capitalize;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
  dualGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `,
  fileTypeIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  attachmentLink: css`
    color: ${colors.grey_300};
    font-weight: 600;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
};

type Props = {
  attachments: Array<Attachment>,
};

const Attachments = (props: I18nProps<Props>) => {
  return (
    <div css={styles.section}>
      <h4 css={styles.title}>{props.t('Files')}</h4>
      <ul css={styles.list} data-testid="Attachments|Attachments">
        {props.attachments.map((attachment) => (
          <li key={attachment.filename}>
            <a
              data-testid="Attachments|AttachmentLink"
              target="_blank"
              href={attachment.url}
              css={styles.attachmentLink}
              rel="noreferrer"
            >
              <i
                css={styles.fileTypeIcon}
                className={getContentTypeIcon(attachment.filetype)}
              />{' '}
              {attachment.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AttachmentsTranslated: ComponentType<Props> =
  withNamespaces()(Attachments);
export default Attachments;
