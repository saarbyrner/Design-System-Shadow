// @flow
import type { AcceptedMimeType } from '@kitman/common/src/utils/mediaHelper';
import type { Style } from '@kitman/common/src/types/styles';
import type {
  EventCategory,
  EventAttachment,
} from '@kitman/common/src/types/Event';
import type { TextContent } from '../../../types/table';

export type Attachment = {
  titlename: string,
  id: number,
  filename: string,
  url: string,
  filetype: AcceptedMimeType,
  categories: EventCategory[],
  date_uploaded: string,
};

export type TableColumn = {
  Header: () => TextContent,
  accessor: 'titlename' | 'filename' | 'category' | 'date_uploaded' | 'actions',
  width: number,
  Cell: (cellData: {
    row: { original: Attachment },
    value: any,
  }) => TextContent | React$Element<'div'>,
};

export interface CreateActions {
  canDownload: boolean;
  canDeleteAttachments: boolean;
  onClickDelete: (attachment: EventAttachment) => void;
  style: Style;
}
