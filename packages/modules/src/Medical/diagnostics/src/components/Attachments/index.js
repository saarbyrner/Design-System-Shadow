// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import { TextButton } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import { AttachmentsHeaderTranslated as AttachmentsHeader } from './AttachmentsHeader';
import style from './styles';

type Props = {
  onOpenAddDiagnosticAttachmentSidePanel: Function,
  onOpenAddDiagnosticLinkSidePanel: Function,
  onOpenDeleteAttachmentModal: Function,
};

const Attachments = (props: I18nProps<Props>) => {
  const { diagnostic } = useDiagnostic();
  const { permissions } = usePermissions();

  const hasAttachments = diagnostic?.attachments?.length > 0;
  const hasPDFs = diagnostic?.redox_pdf_results?.length > 0;

  const attachmentsComponents = diagnostic?.attachments?.map((attachment) => (
    <div key={`${attachment.filename}_${attachment.id}`}>
      <div css={[style.attachmentContainer]}>
        <LinkTooltipCell
          data-testid="DiagnosticCardList|AttachmentFile"
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
        data-testid="AdditionalInfo|AuthorDetails"
      >
        {props.t('Created {{date}} by {{author}}', {
          date: DateFormatter.formatStandard({
            date: moment(attachment?.attachment_date) || '--',
          }),
          author: attachment?.created_by?.fullname || '--',
          interpolation: { escapeValue: false },
        })}
      </div>
    </div>
  ));

  const hasLinks = diagnostic?.attached_links?.length > 0;

  const linksComponents = diagnostic?.attached_links?.map((link) => {
    return (
      <div key={`${link.title}_${link.id}`}>
        <LinkTooltipCell
          data-testid="DiagnosticCardList|AttachmentLink"
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
      </div>
    );
  });

  const pdfsComponents = diagnostic?.redox_pdf_results?.map((pdfLink) => {
    return (
      <div key={`${pdfLink.value}`}>
        <LinkTooltipCell
          key={`${pdfLink.value}`}
          data-testid="DiagnosticCardList|Link"
          fileType="link-icon"
          valueLimit={50}
          url={`data:application/octet-stream;base64,${pdfLink.value}`}
          longText={
            pdfLink?.created_at
              ? `${moment(pdfLink.created_at).format('YYYY-MM-DD-HH:MM')}-${
                  pdfLink.description
                }`
              : pdfLink?.description
          }
          includeIcon
          downloadTitle={
            pdfLink?.created_at
              ? `${moment(pdfLink.created_at).format('YYYY-MM-DD-HH:MM')}-${
                  pdfLink.description
                }`
              : pdfLink?.description
          }
        />
        <div
          css={[style.metadataSection, style.authorDetails]}
          data-testid="AdditionalInfo|AuthorDetails"
        >
          {props.t('Created {{date}} by {{author}}', {
            date: DateFormatter.formatStandard({
              date: moment(diagnostic?.created_date) || '--',
            }),
            author: 'Service User',
            interpolation: { escapeValue: false },
          })}
        </div>
      </div>
    );
  });

  return (
    <section css={style.section}>
      <AttachmentsHeader
        onOpenAddDiagnosticAttachmentSidePanel={
          props.onOpenAddDiagnosticAttachmentSidePanel
        }
        onOpenAddDiagnosticLinkSidePanel={
          props.onOpenAddDiagnosticLinkSidePanel
        }
      />
      {hasLinks && (
        <section
          css={style.attachmentsSection}
          data-testid="Links|CurrentAttachmentList"
        >
          <h3 className="kitmanHeading--L3" data-testid="Links|Heading">
            {props.t('Links')}
          </h3>

          <ol css={style.attachmentList}>{linksComponents}</ol>
        </section>
      )}

      {hasAttachments && (
        <section
          css={style.attachmentsSection}
          data-testid="Attachments|CurrentAttachmentList"
        >
          <h3 className="kitmanHeading--L3" data-testid="Files|Heading">
            {props.t('Files')}
          </h3>

          <ol css={style.attachmentList}>{attachmentsComponents}</ol>
        </section>
      )}

      {hasPDFs && (
        <section
          css={style.attachmentsSection}
          data-testid="Attachments|CurrentPDFsList"
        >
          <h3 className="kitmanHeading--L3" data-testid="Files|Heading">
            {props.t('PDFs')}
          </h3>

          <ol css={style.attachmentList}>{pdfsComponents}</ol>
        </section>
      )}
    </section>
  );
};

export const AttachmentsTranslated = withNamespaces()(Attachments);
export default Attachments;
