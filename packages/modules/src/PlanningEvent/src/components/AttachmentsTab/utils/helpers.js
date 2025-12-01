/* eslint-disable camelcase */
// @flow
import uuid from 'uuid';
import moment from 'moment';

import { TooltipMenu, TextButton } from '@kitman/components';
import { TextCell } from '@kitman/modules/src/Medical/shared/components/MedicalDocumentsTab/components/DocumentsTableCells';
import type { EventAttachment } from '@kitman/common/src/types/Event';
import type { Style } from '@kitman/common/src/types/styles';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  createHeaderFunction,
  mapArrayToCells,
} from '../../../helpers/tableComponents';
import { deleteButtonText, downloadButtonText } from './consts';
import type { TableColumn, Attachment, CreateActions } from './types';

interface CreateColumns {
  t: Translation;
  style: Style;
}

export const createColumns = ({ t, style }: CreateColumns) => {
  const titleColumn: TableColumn = {
    Header: createHeaderFunction(t, 'Title'),
    accessor: 'titlename',
    width: 100,
    Cell: ({ value }) => {
      return <TextCell key={uuid()} value={value} />;
    },
  };

  const filenameColumn: TableColumn = {
    Header: createHeaderFunction(t, 'File Name'),
    accessor: 'filename',
    width: 100,
    Cell: ({
      row: {
        original: { url, filename, filetype },
      },
    }) => {
      return (
        <div css={style.link}>
          <a
            data-testid="Attachments|AttachmentLink"
            target="_blank"
            href={url}
            css={style.attachmentLink}
            rel="noreferrer"
          >
            <i
              css={style.fileTypeIcon}
              className={getNewContentTypeColorfulIcons(filetype)}
            />
            {filename}
          </a>
        </div>
      );
    },
  };

  const categoryColumn: TableColumn = {
    Header: createHeaderFunction(t, 'Category'),
    accessor: 'category',
    width: 100,
    Cell: ({ row }) => {
      const categoryNames = row.original.categories.map(
        (category) => category.name
      );
      return mapArrayToCells(categoryNames);
    },
  };

  const dateUploadedColumn: TableColumn = {
    Header: createHeaderFunction(t, 'Date of Document'),
    accessor: 'date_uploaded',
    width: 100,
    Cell: ({ value }) => (
      <TextCell
        key={uuid()}
        value={formatStandard({ date: moment(value), displayLongDate: true })}
      />
    ),
  };

  const actionsColumn: TableColumn = {
    Header: createHeaderFunction(t, ''),
    accessor: 'actions',
    width: 20,
    Cell: ({ value }) => (
      <TextCell key={uuid()} data-testid="FilesTable|Actions" value={value} />
    ),
  };

  return [
    titleColumn,
    filenameColumn,
    categoryColumn,
    dateUploadedColumn,
    actionsColumn,
  ];
};

const createActions = (
  { canDeleteAttachments, canDownload, onClickDelete, style }: CreateActions,
  eventAttachment: EventAttachment
) => {
  const menuItems: Array<TooltipItem> = [];

  if (canDownload) {
    menuItems.push({
      description: downloadButtonText,
      onClick: (e) => {
        e.preventDefault();
        window.location.href = eventAttachment.attachment.download_url;
      },
    });
  }
  if (canDeleteAttachments) {
    menuItems.push({
      description: deleteButtonText,
      onClick: () => onClickDelete(eventAttachment),
    });
  }

  return (
    <div css={style.actions} key={uuid()}>
      <TooltipMenu
        placement="bottom-end"
        menuItems={menuItems}
        tooltipTriggerElement={
          <TextButton iconAfter="icon-more" type="subtle" kitmanDesignSystem />
        }
        kitmanDesignSystem
      />
    </div>
  );
};

interface CreateRows {
  attachments: EventAttachment[];
  createActionsParams: CreateActions;
}

export const createRows = ({
  attachments,
  createActionsParams,
}: CreateRows): Attachment[] => {
  return attachments.map((eventAttachment) => {
    const {
      attachment: {
        id,
        filename,
        filetype,
        name,
        download_url,
        attachment_date,
      },
      event_attachment_categories,
    } = eventAttachment;
    return {
      categories: event_attachment_categories,
      filename,
      filetype,
      id,
      titlename: name,
      url: download_url,
      date_uploaded: attachment_date ?? '',
      actions: createActions(createActionsParams, eventAttachment),
    };
  });
};

export default {};
