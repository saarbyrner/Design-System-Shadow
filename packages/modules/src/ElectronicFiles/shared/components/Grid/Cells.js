// @flow
import moment from 'moment';
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import {
  FIELD_KEY,
  type ElectronicFile,
  type ExistingContact,
  type AllocationAttribute,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import {
  Typography,
  Chip,
  Link,
  FavoriteCheckbox,
} from '@kitman/playbook/components';
import {
  renderTextContent,
  renderContact,
  renderStatus,
  renderAttachedTo,
} from '@kitman/modules/src/ElectronicFiles/shared/utils';

const buildCellContent = ({
  field,
  row,
  onAttachmentsChipClick,
  onAttachedToChipClick,
  onToggleContactFavorite,
}: {
  field: string,
  row: ElectronicFile & ExistingContact,
  onAttachedToChipClick?: (allocations: Array<AllocationAttribute>) => void,
  onAttachmentsChipClick?: (attachments: Array<Attachment>) => void,
  onToggleContactFavorite?: (id: number, checked: boolean) => void,
}): Node | Array<Node> => {
  const fontWeight =
    'viewed' in row && !row.viewed && !row.archived ? 600 : 400;

  switch (field) {
    case FIELD_KEY.received_from:
      return renderTextContent({
        content: row.received_from
          ? renderContact({
              contact: row.received_from,
              clipText: true,
            })
          : row.originating_fax_number.number,
        fontWeight,
        clipText: true,
      });
    case FIELD_KEY.sent_to:
      return row.sent_to.length !== 0
        ? renderTextContent({
            content: renderContact({
              contact: row.sent_to[0],
              clipText: true,
            }),
            fontWeight,
            clipText: true,
          })
        : renderTextContent({ fontWeight });
    case FIELD_KEY.title:
      return renderTextContent({
        content: row.title,
        fontWeight,
        clipText: true,
      });
    case FIELD_KEY.attachment:
      return row.attachment ? (
        <Link
          onClick={(e) => {
            // https://github.com/mui/mui-x/issues/891#issuecomment-863580714
            e.stopPropagation();
          }}
          href={row.attachment.url}
          target="_blank"
        >
          <Typography sx={{ fontWeight }} variant="body2">
            {i18n.t('View File')}
          </Typography>
        </Link>
      ) : (
        renderTextContent({ fontWeight })
      );
    case FIELD_KEY.attachments:
      return row.attachments.length !== 0 ? (
        <Chip
          label={
            row.attachments.length === 1
              ? i18n.t('1 attachment')
              : i18n.t('{{count}} attachments', {
                  count: row.attachments.length,
                })
          }
          clickable
          onClick={(e) => {
            // https://github.com/mui/mui-x/issues/891#issuecomment-863580714
            e.stopPropagation();
            onAttachmentsChipClick?.(row.attachments);
          }}
        />
      ) : (
        renderTextContent({ fontWeight })
      );
    case FIELD_KEY.attachedTo:
      return row.efax_allocations.length !== 0
        ? renderAttachedTo(row.efax_allocations, onAttachedToChipClick)
        : renderTextContent({ fontWeight });
    case FIELD_KEY.date:
      return renderTextContent({
        content: formatStandard({ date: moment(row.date) }),
        fontWeight,
      });
    case FIELD_KEY.delivery_status:
      return row.status
        ? renderStatus(row.status)
        : renderTextContent({ fontWeight });
    case FIELD_KEY.toggle_contact_favorite:
      return (
        <FavoriteCheckbox
          checked={!!row.favorite}
          onChange={(checked: boolean) =>
            onToggleContactFavorite?.(row.id, checked)
          }
          tooltipTitle={
            row.favorite
              ? i18n.t('Remove from favorites')
              : i18n.t('Add to favorites')
          }
        />
      );
    case FIELD_KEY.fax_number:
      return renderTextContent({
        content: row.fax_number.number,
      });
    case FIELD_KEY.name:
      return renderTextContent({
        content: `${row.first_name} ${row.last_name}`,
      });
    case FIELD_KEY.company_name:
      return renderTextContent({
        content: row.company_name,
      });
    default:
      return row[field];
  }
};

export default buildCellContent;
