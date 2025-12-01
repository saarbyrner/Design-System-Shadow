// @flow
import type { ComponentType } from 'react';
import { useMemo, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import uuid from 'uuid';
import { useFlexLayout } from 'react-table';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';

import type {
  IssueOccurrenceFDetail,
  ChronicIssue,
} from '@kitman/modules/src/Medical/shared/types';
import type {
  MedicalFile,
  EntityAttachment,
  MedicalEntity,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import {
  TextLink,
  UserAvatar,
  EllipsisTooltipText,
  TooltipMenu,
  TextButton,
  Checkbox,
} from '@kitman/components';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  getContentTypeIcon,
  getNewContentTypeColorfulIcons,
} from '@kitman/common/src/utils/mediaHelper';
import getStyles from '@kitman/common/src/styles/FileTable.styles';
import {
  getDocumentSource,
  supportedEntityTypes,
} from '@kitman/modules/src/Medical/shared/components/MedicalFilesTab/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { InfiniteScrollLayoutTranslated as InfiniteScrollLayout } from '../../../InfiniteScrollLayout';
import type { ExportAttachment } from '../../../../types/medical/MedicalFile';
import DataTable from '../../../DataTable';
import {
  TextHeader,
  TextCell,
} from '../../../MedicalDocumentsTab/components/DocumentsTableCells';
import type { RequestStatus } from '../../../../types';
import { ADD_MEDICAL_FILE_BUTTON } from '../../../../constants/elementTags';

type Docs = Array<MedicalFile> | Array<EntityAttachment>;

type Props = {
  onReachingEnd: Function,
  documents: Docs,
  hasMoreDocuments: boolean,
  issueId: string | number | null,
  showPlayerColumn: boolean,
  setShowArchiveModal: Function,
  setSelectedRow: Function,
  setIsPanelOpen: Function,
  setIsEditing: Function,
  showActions: boolean,
  allAttachmentsChecked?: boolean,
  updateAllAttachments?: Function,
  exportAttachments?: Array<ExportAttachment>,
  updateAttachment?: Function,
  permissions: PermissionsType,
  requestStatus: RequestStatus,
  nextPage: number | null,
  hiddenFilters: ?Array<string>,
};

const FilesTable = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const documentsTableRef = useRef();
  const isEnhancedFlow = window.featureFlags['medical-files-tab-enhancement'];
  const sortByDocDate = window.featureFlags['medical-files-sort-by-doc-date'];

  const isFullyLoaded =
    props.requestStatus === 'SUCCESS' && !props.hasMoreDocuments;

  const dataTableStyle = {
    FilesTable: {
      height: `calc(100vh - ${
        documentsTableRef.current?.getBoundingClientRect().y ?? 0
      }px - 20px)`,
      overflowY: 'scroll',
    },
    DocumentsTableEmpty: { height: 'auto' },
  };

  const style = getStyles();

  const returnActions = (document) => {
    const menuItems: Array<TooltipItem> = [];
    const hasValidEntityType = document.entity
      ? supportedEntityTypes.includes(document.entity.entity_type) &&
        isEnhancedFlow
      : false;
    const isValid = hasValidEntityType || !isEnhancedFlow;

    const canArchive =
      props.permissions.medical.documents.canArchive && isValid;
    const canEdit =
      props.permissions.medical.documents.canEdit && !isEnhancedFlow;

    if (!isValid) return;

    if (canArchive) {
      menuItems.push({
        description: 'Archive',
        onClick: () => {
          props.setSelectedRow(document);
          props.setShowArchiveModal(true);
          trackEvent(performanceMedicineEventNames.archiveMedicalDocument, {
            ...determineMedicalLevelAndTab(),
          });
        },
      });
    }

    if (canEdit) {
      menuItems.push({
        description: 'Edit',
        onClick: () => {
          props.setIsEditing(true);
          props.setSelectedRow(document);
          props.setIsPanelOpen(true);
        },
      });
    }

    // eslint-disable-next-line consistent-return
    return (
      <div css={style.actions} key={uuid()}>
        <TooltipMenu
          placement="bottom-end"
          menuItems={menuItems}
          tooltipTriggerElement={
            <TextButton
              iconAfter="icon-more"
              type="subtle"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      </div>
    );
  };

  // TODO; why does this memo have no arguments
  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Title')} />,
        accessor: 'titlename',
        width: 110,
        Cell: ({ row }) => {
          const documentId = row.original.isDocument
            ? row.original.id
            : row.original.attachmentId;
          return (
            <div css={style.link}>
              <TextLink
                text={row.original.document.titlename}
                href={`/medical/documents/${documentId}?isV2Document=${row.original.isDocument}`}
                css={style.attachmentLink}
                kitmanDesignSystem
              />
            </div>
          );
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('File name')} />,
        accessor: 'filename',
        width: 110,
        Cell: ({ row }) => {
          return (
            <div css={style.link}>
              <a
                data-testid="Attachments|AttachmentLink"
                target="_blank"
                href={row.original.document.url}
                css={style.attachmentLink}
                rel="noreferrer"
              >
                <i
                  css={style.fileTypeIcon}
                  className={
                    isEnhancedFlow
                      ? getNewContentTypeColorfulIcons(
                          row.original.document.filetype,
                          row.original.document.filename,
                          row.original.document.isAudioFile
                        )
                      : getContentTypeIcon(row.original.document.filetype)
                  }
                />
                {row.original.document.filename}
              </a>
            </div>
          );
        },
      },
      {
        Header: () => (
          <TextHeader
            key={uuid()}
            value={
              sortByDocDate
                ? props.t('Date of Document')
                : props.t('Upload date')
            }
          />
        ),
        accessor: sortByDocDate ? 'entity_date' : 'date_uploaded',
        width: 80,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            value={DateFormatter.formatStandard({
              date: moment(value),
            })}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Category')} />,
        accessor: 'category',
        width: 100,
        Cell: ({ row }) => {
          if (
            !row.original.categories ||
            row.original.categories.length === 0
          ) {
            return <TextCell key={uuid()} value="-" />;
          }
          const categories = row.original.categories.map((category) => {
            return <TextCell key={uuid()} value={category.name} />;
          });
          return <>{categories}</>;
        },
      },
    ];

    if (props.showPlayerColumn) {
      columns.unshift({
        Header: () => <TextHeader key={uuid()} value={props.t('Player')} />,
        accessor: 'fullname',
        width: 100,
        Cell: ({ row }) => {
          return (
            <div css={style.athleteCell}>
              <div css={style.imageContainer}>
                <UserAvatar
                  url={row.original.athlete_avatar}
                  firstname={row.values.fullname}
                  displayInitialsAsFallback
                  availability={undefined}
                  size="MEDIUM"
                />
              </div>
              <div css={style.detailsContainer}>
                <TextLink
                  text={row.values.fullname}
                  href={`/medical/athletes/${row.original.athlete_id}`}
                  kitmanDesignSystem
                />
                <span css={style.position}>
                  {row.original.athlete_position}
                </span>
              </div>
            </div>
          );
        },
      });
    }

    if (window.featureFlags['export-multi-doc'] && props.showActions) {
      columns.unshift({
        Header: () => (
          <div css={style.checkbox}>
            <Checkbox
              id={uuid()}
              isChecked={
                props.allAttachmentsChecked
                  ? props.allAttachmentsChecked
                  : false
              }
              toggle={({ checked }) =>
                props.updateAllAttachments &&
                props.updateAllAttachments(checked, props.documents)
              }
              kitmanDesignSystem
              data-testid="ExportControl|Parent"
            />
          </div>
        ),
        accessor: 'exports',
        width: 25,
        Cell: ({ row }) => {
          return (
            <div css={style.checkbox}>
              <Checkbox
                id={uuid()}
                isChecked={
                  !!props.exportAttachments?.find(
                    (item) => item.id === row.original.attachmentId
                  )
                }
                toggle={({ checked }) =>
                  props.updateAttachment?.(
                    row.original.attachmentId,
                    checked,
                    row.original.document.filetype,
                    row.original.document.filename,
                    props.documents
                  )
                }
                kitmanDesignSystem
                data-testid={`Export|Child|${row.original.attachmentId}`}
              />
            </div>
          );
        },
      });
    }

    if (props.issueId === null) {
      columns.push({
        Header: () => (
          <TextHeader
            key={uuid()}
            value={props.t('Associated injury/illness')}
          />
        ),
        accessor: 'injury',
        width: 100,
        Cell: ({ row }) => {
          if (
            row.original.injuries.length === 0 &&
            (!row.original.chronics || row.original.chronics.length === 0)
          ) {
            return <TextCell key={uuid()} value="-" />;
          }
          const injuries = row.original.injuries.map(
            (occurrence: IssueOccurrenceFDetail) => {
              const issueTypePath = isEnhancedFlow
                ? getIssueTypePath(occurrence.issue_type)
                : 'injuries';
              return (
                <div css={style.link}>
                  <TextLink
                    text={getIssueTitle(occurrence, false)}
                    href={`/medical/athletes/${row.original.athlete_id}/${issueTypePath}/${occurrence.id}`}
                    kitmanDesignSystem
                  />
                </div>
              );
            }
          );
          const chronics = row.original.chronics?.map(
            (chronicIssue: ChronicIssue) => {
              return (
                <div css={style.link}>
                  <TextLink
                    text={chronicIssue.title || chronicIssue.full_pathology}
                    href={`/medical/athletes/${row.original.athlete_id}/chronic_issues/${chronicIssue.id}`}
                    kitmanDesignSystem
                  />
                </div>
              );
            }
          );

          return (
            <>
              {injuries}
              {chronics}
            </>
          );
        },
      });
    }

    if (isEnhancedFlow) {
      columns.push({
        Header: () => <TextHeader key={uuid()} value={props.t('Source')} />,
        accessor: 'source',
        width: sortByDocDate ? 100 : 150,
        Cell: ({ cell: { value } }) => {
          return value?.description ? (
            <div css={style.link}>
              <TextLink
                text={value.description}
                href={value.href}
                kitmanDesignSystem
                withHashParam={value.isChangingTab}
              />
            </div>
          ) : (
            '-'
          );
        },
      });
    }

    if (!isEnhancedFlow && !props.showPlayerColumn) {
      columns.push({
        Header: () => <TextHeader key={uuid()} value={props.t('Note')} />,
        accessor: 'note',
        width: 150,
        Cell: ({ cell: { value } }) => (
          <div css={style.note}>
            <EllipsisTooltipText content={value} displayEllipsisWidth={280} />
          </div>
        ),
      });
    }

    if (
      !props.hiddenFilters?.includes(ADD_MEDICAL_FILE_BUTTON) &&
      props.showActions &&
      window.featureFlags['medical-documents-files-area'] &&
      (props.permissions.medical.documents.canArchive ||
        props.permissions.medical.documents.canEdit)
    ) {
      columns.push({
        Header: () => <TextHeader key={uuid()} value="" />,
        accessor: 'actions',
        width: 20,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="FilesTable|Actions"
            value={value}
          />
        ),
      });
    }

    return columns;
  });

  const buildData = () => {
    return props.documents.map((document) => {
      if (document.entity) {
        // $FlowFixMe[incompatible-type] Is not distinguishing exact object types as it should: https://flow.org/en/docs/types/unions/
        const entity: MedicalEntity = document.entity;
        return {
          attachmentId: document.attachment.id,
          id: entity.id,
          fullname: entity.athlete.fullname,
          isDocument: entity.entity_type === 'document_v2',
          document: {
            titlename: document.attachment.name,
            filename: document.attachment.filename,
            filetype: document.attachment.filetype,
            isAudioFile: document.attachment.audio_file,
            url: document.attachment.url,
          },
          entity_date: entity.entity_date,
          date_uploaded: document.attachment.attachment_date,
          categories: document.attachment.medical_attachment_categories,
          injuries: [
            // Can be distinguished by issue_type
            ...(entity.illness_occurrences ? entity.illness_occurrences : []),
            ...(entity.injury_occurrences ? entity.injury_occurrences : []),
          ],
          chronics: entity.chronic_issues || [],
          // $FlowFixMe[prop-missing] Is not distinguishing exact object types as it should: https://flow.org/en/docs/types/unions/
          source: getDocumentSource(document),
          note: null, // TODO: Will later review what are we todo about annotations
          athlete_avatar: entity.athlete.avatar_url,
          athlete_id: entity.athlete.id,
          athlete_position: entity.athlete.position,
          actions: returnActions(document),
        };
      }
      return {
        attachmentId: document.attachment?.id,
        id: document.id,
        fullname: document.athlete.fullname,
        isDocument: true, // Existing Behavior
        document: {
          titlename: document.attachment.name,
          filename: document.attachment.filename,
          filetype: document.attachment.filetype,
          isAudioFile: document.attachment.audio_file,
          url: document.attachment.url,
        },
        entity_date: document.document_date,
        date_uploaded: document.document_date,
        categories: document.document_categories,
        injuries: [
          ...document.illness_occurrences,
          ...document.injury_occurrences,
        ],
        chronics: document.chronic_issues || [],
        note: document.annotation?.note_summary,
        athlete_avatar: document.athlete.avatar_url,
        athlete_id: document.athlete.id,
        athlete_position: document.athlete.position,
        actions: returnActions(document),
      };
    });
  };

  const renderTable = () => {
    return (
      <>
        <InfiniteScrollLayout
          itemsLength={props.documents.length}
          hasMore={!isFullyLoaded}
          onReachingEnd={props.onReachingEnd}
          nextPage={props.nextPage}
          scrollableTarget="FilesTable"
        >
          <DataTable
            columns={buildColumns}
            data={buildData()}
            useLayout={useFlexLayout}
            isTableEmpty={props.documents.length === 0}
          />
        </InfiniteScrollLayout>
        {props.requestStatus !== 'PENDING' &&
          isFullyLoaded &&
          props.documents.length === 0 && (
            <div
              css={style.noNoteText}
              data-testid="MedicalFilesTab|NoDocumentsText"
            >
              {props.t('No documents found')}
            </div>
          )}
      </>
    );
  };

  return (
    <div
      id="FilesTable"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={documentsTableRef}
      css={
        props.documents?.length
          ? dataTableStyle.FilesTable
          : dataTableStyle.DocumentsTableEmpty
      }
    >
      <div css={style.content}>
        <div css={style.documentsTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const FilesTableTranslated: ComponentType<Props> =
  withNamespaces()(FilesTable);
export default FilesTable;
