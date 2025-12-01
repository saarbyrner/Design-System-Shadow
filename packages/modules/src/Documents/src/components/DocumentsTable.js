// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import { TrackEvent } from '@kitman/common/src/utils';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { DataGrid, TextLink } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { formatDate, localTimezone, downloadDocument } from '../utils';
import type { FormattedDocument } from '../types';

type Props = {
  documents: FormattedDocument[],
  displayDeleteModal: (documentId: number) => void,
};

const DocumentsTable = (props: I18nProps<Props>) => {
  const columns = [
    {
      id: 'name',
      content: <>{props.t('Name')}</>,
      isHeader: true,
    },
    {
      id: 'modified',
      content: <>{props.t('Last Modified')}</>,
      isHeader: true,
    },
    {
      id: 'owner',
      content: <>{props.t('Owner')}</>,
      isHeader: true,
    },
    {
      id: 'size',
      content: <>{props.t('Size')}</>,
      isHeader: true,
    },
  ];

  const rows = props.documents.map((document) => ({
    id: document.id,
    cells: [
      {
        id: `name_${document.id}`,
        content: (
          <TextLink
            text={document.name}
            href={document.url}
            target="_blank"
            kitmanDesignSystem
            isExternalLink
          />
        ),
      },
      {
        id: `modified_${document.id}`,
        content: (
          <>{formatDate(moment(document.modifiedDate).tz(localTimezone))}</>
        ),
      },
      {
        id: `owner_${document.id}`,
        content: <>{document.owner}</>,
      },
      {
        id: `size_${document.id}`,
        content: <>{fileSizeLabel(document.size, true)}</>,
      },
    ],
  }));

  const rowActions = [
    {
      id: 'download',
      text: props.t('Download'),
      onCallAction: (documentId: number) => {
        const selectedDocument = props.documents.find(
          (document) => document.id === documentId
        );
        if (!selectedDocument) return;
        TrackEvent('Organisation documents', 'Download', 'Documents');
        downloadDocument(selectedDocument.downloadUrl);
      },
    },
    {
      id: 'delete',
      text: props.t('Delete'),
      onCallAction: (documentId: number) => {
        TrackEvent('Organisation documents', 'Delete', 'Documents');
        props.displayDeleteModal(documentId);
      },
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowActions={rowActions}
      isTableEmpty={props.documents.length === 0}
      emptyTableText={props.t('No documents saved')}
      scrollOnBody
    />
  );
};

export const DocumentsTableTranslated: ComponentType<Props> =
  withNamespaces()(DocumentsTable);
export default DocumentsTable;
