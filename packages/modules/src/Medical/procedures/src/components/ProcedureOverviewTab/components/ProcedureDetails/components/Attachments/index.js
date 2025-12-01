// @flow
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { TextButton } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import AttachmentsHeader from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Attachments/AttachmentsHeader';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/Attachments/styles';

type Props = {
  onOpenAddProcedureAttachmentSidePanel: Function,
  onOpenDeleteAttachmentModal: Function,
};

const Attachments = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { procedure } = useProcedure();

  const hasAttachments = procedure?.attachments?.length > 0;
  const hasLinks = procedure?.attached_links?.length > 0;

  const procedureAttachments = procedure?.attachments.map((attachment) => (
    <li key={`${attachment.filename}_${attachment.id}`}>
      <div css={[style.attachmentContainer]}>
        <LinkTooltipCell
          data-testid="ProcedureOverviewTab|AttachmentFile"
          fileType={attachment.filetype}
          valueLimit={40}
          url={attachment.url}
          longText={attachment.filename}
          includeIcon
          isExternalLink
          target="_blank"
        />
        {window.featureFlags['remove-attachments'] &&
          permissions.medical.attachments.canRemove && (
            <TextButton
              onClick={() => {
                props.onOpenDeleteAttachmentModal(
                  attachment.filename,
                  attachment.id
                );
              }}
              iconBefore="icon-bin"
              type="subtle"
              kitmanDesignSystem
            />
          )}
      </div>

      <div
        css={[style.metadataSection, style.authorDetails]}
        data-testid="ProcedureOverviewTab|AuthorDetails"
      >
        {props.t('Created {{date}} by {{author}}', {
          date: formatStandard({
            date: moment(attachment?.attachment_date) || '--',
          }),
          author: attachment?.created_by?.fullname || '--',
          interpolation: { escapeValue: false },
        })}
      </div>
    </li>
  ));

  const procedureLinks = procedure?.attached_links?.map((link) => {
    return (
      <li key={`${link.title}_${link.id}`}>
        <LinkTooltipCell
          data-testid="ProcedureCardList|AttachmentLink"
          fileType="icon-link"
          valueLimit={40}
          url={link.uri}
          longText={link.title}
          includeIcon
          isLink
          isExternalLink
          target="_blank"
        />
        <div
          css={[style.metadataSection, style.authorDetails]}
          data-testid="AdditionalInfo|AuthorDetails"
        >
          {props.t('Created {{date}} by {{author}}', {
            date: DateFormatter.formatStandard({
              date: moment(link?.created_at) || '--',
            }),
            author: link?.created_by?.fullname || '--',
            interpolation: { escapeValue: false },
          })}
        </div>
      </li>
    );
  });

  return (
    <div data-testid="ProcedureOverviewTab|Attachments">
      <AttachmentsHeader
        t={props.t}
        onOpenAddProcedureAttachmentSidePanel={
          props.onOpenAddProcedureAttachmentSidePanel
        }
      />
      {hasAttachments && (
        <section
          css={style.attachmentsSection}
          data-testid="Attachments|CurrentAttachmentList"
        >
          <h3 css={style.sectionHeading} data-testid="Files|Heading">
            {props.t('Files')}
          </h3>

          <ol css={style.attachmentList}>{procedureAttachments}</ol>
        </section>
      )}

      {hasLinks && (
        <section
          css={style.attachmentsSection}
          data-testid="Attachments|CurrentLinksList"
        >
          <h3 css={style.sectionHeading} data-testid="Links|Heading">
            {props.t('Links')}
          </h3>

          <ol css={style.attachmentList}>{procedureLinks}</ol>
        </section>
      )}
    </div>
  );
};

export const AttachmentsTranslated: ComponentType<Props> =
  withNamespaces()(Attachments);
export default Attachments;
