// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { AttachedLink } from '@kitman/common/src/types/Issues';
import moment from 'moment/moment';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/Medical/diagnostics/src/components/Attachments/styles';
import AddIssueLinksSidePanel from '@kitman/modules/src/Medical/shared/containers/AddIssueLinksSidePanel';
import AddIssueFileSidePanel from '@kitman/modules/src/Medical/shared/containers/AddIssueFileSidePanel';
import type { IssueLink } from '@kitman/modules/src/Medical/rosters/src/redux/types/actions';
import type { UnuploadedFile } from '@kitman/modules/src/Medical/shared/components/AddTreatmentSidePanel/types';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';

type Props = {
  attachedLinks: AttachedLink[],
  onSave: (string, IssueLink[]) => void,
};

const Attachments = (props: I18nProps<Props>) => {
  const { t: translate, attachedLinks, onSave } = props;

  const { isReadOnly } = useIssue();

  const [isLinksSidePanelOpen, setLinksSidePanelOpen] = useState(false);
  const [isFileSidePanelOpen, setFileSidePanelOpen] = useState(false);
  // TODO: Hook up api call to retrieve up to date files, and move this into AddIssueFilesSidePanel.
  const [localIssueFiles, setLocalIssueFiles] = useState<UnuploadedFile[]>([]);

  const renderAttachmentsHeader = () => (
    <header css={style.header}>
      <h2 className="kitmanHeading--L2">{translate('Attachments')}</h2>
      {!isReadOnly && (
        <div>
          <TooltipMenu
            tooltipTriggerElement={
              <TextButton
                text={translate('Add')}
                type="secondary"
                iconAfter="icon-chevron-down"
                kitmanDesignSystem
              />
            }
            menuItems={[
              {
                description: translate('File'),
                onClick: () => setFileSidePanelOpen(true),
              },
              {
                description: translate('Link'),
                onClick: () => setLinksSidePanelOpen(true),
              },
            ]}
            placement="bottom-start"
            appendToParent
            kitmanDesignSystem
          />
        </div>
      )}
    </header>
  );

  const renderListingFooter = (date: string, name: string) => {
    return props.t('Created {{date}} by {{author}}', {
      date: DateFormatter.formatStandard({
        date: moment(date) || '--',
      }),
      author: name || '--',
      interpolation: { escapeValue: false },
    });
  };

  const renderLinksArea = (links: AttachedLink[]) =>
    links.map((link) => (
      <div key={link.id}>
        <LinkTooltipCell
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
          {renderListingFooter(link?.created_at, link?.created_by?.fullname)}
        </div>
      </div>
    ));

  // TODO: Retrieve file url, created_at and created_by from api call link object when hooked up instead of placeholders.
  const renderFilesArea = () =>
    localIssueFiles.map((file) => (
      <div key={`${file.filename}-${file.fileSize}`}>
        <LinkTooltipCell
          fileType={file.fileType}
          valueLimit={40}
          url={file.filename}
          longText={file.filename}
          includeIcon
          isExternalLink
          target="_blank"
        />
        <div
          css={[style.metadataSection, style.authorDetails]}
          data-testid="AdditionalInfo|AuthorDetails"
        >
          {renderListingFooter(new Date().toDateString(), 'Placeholder Name')}
        </div>
      </div>
    ));

  return (
    <section css={style.section}>
      {renderAttachmentsHeader()}
      {attachedLinks.length !== 0 && (
        <section
          css={style.attachmentsSection}
          data-testid="CurrentAttatchedLinks"
        >
          <h3 className="kitmanHeading--L3" data-testid="Links|Heading">
            {translate('Links')}
          </h3>
          <ol css={style.attachmentList}>{renderLinksArea(attachedLinks)}</ol>
        </section>
      )}
      {localIssueFiles.length !== 0 && (
        <section
          css={style.attachmentsSection}
          data-testid="CurrentAttatchedFiles"
        >
          <h3 className="kitmanHeading--L3" data-testid="Files|Heading">
            {translate('Files')}
          </h3>
          <ol css={style.attachmentList}>{renderFilesArea()}</ol>
        </section>
      )}
      {isLinksSidePanelOpen && (
        <AddIssueLinksSidePanel
          isOpen={isLinksSidePanelOpen}
          onClose={() => setLinksSidePanelOpen(false)}
          onSave={onSave}
        />
      )}
      {isFileSidePanelOpen && (
        <AddIssueFileSidePanel
          files={localIssueFiles}
          onSave={(files) => setLocalIssueFiles(files)}
          isOpen={isFileSidePanelOpen}
          onClose={() => setFileSidePanelOpen(false)}
        />
      )}
    </section>
  );
};

export const AttachmentsTranslated: ComponentType<Props> =
  withNamespaces()(Attachments);
export default Attachments;
