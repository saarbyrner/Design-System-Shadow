// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  FIELD_KEY,
  type GridRenderCellParams,
  type ElectronicFile,
  type ExistingContact,
  type AllocationAttribute,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { ReturnType as RowActionsReturnType } from '@kitman/modules/src/ElectronicFiles/shared/hooks/useRowActions';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import type { GridRowParams } from '@mui/x-data-grid-pro';
import buildCellContent from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Cells';

const renderCell = ({
  params,
  onAttachedToChipClick,
  onAttachmentsChipClick,
  onToggleContactFavorite,
}: {
  params: GridRenderCellParams,
  onAttachedToChipClick?: (allocations: Array<AllocationAttribute>) => void,
  onAttachmentsChipClick?: (attachments: Array<Attachment>) => void,
  onToggleContactFavorite?: (id: number, checked: boolean) => void,
}) => {
  return buildCellContent({
    field: params.field,
    row: params.row,
    onAttachedToChipClick,
    onAttachmentsChipClick,
    onToggleContactFavorite,
  });
};

export const getReceivedFromColumn = () => ({
  field: FIELD_KEY.received_from,
  headerName: i18n.t('Received from'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getSentToColumn = () => ({
  field: FIELD_KEY.sent_to,
  headerName: i18n.t('Sent to'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getTitleColumn = () => ({
  field: FIELD_KEY.title,
  headerName: i18n.t('Subject'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getAttachmentColumn = () => ({
  field: FIELD_KEY.attachment,
  headerName: i18n.t('Attachment'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getAttachmentsColumn = (
  onClick: (attachments: Array<Attachment>) => void
) => ({
  field: FIELD_KEY.attachments,
  headerName: i18n.t('Attachments'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) =>
    renderCell({ params, onAttachmentsChipClick: onClick }),
});

export const getAttachedToColumn = (
  onClick: (allocations: Array<AllocationAttribute>) => void
) => ({
  field: FIELD_KEY.attachedTo,
  headerName: i18n.t('Attached to'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) =>
    renderCell({ params, onAttachedToChipClick: onClick }),
});

export const getDateColumn = () => ({
  field: FIELD_KEY.date,
  headerName: i18n.t('Date'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getStatusColumn = () => ({
  field: FIELD_KEY.delivery_status,
  headerName: i18n.t('Status'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getToggleContactFavoriteColumn = ({
  visible = true,
  onChange,
}: {
  visible: boolean,
  onChange: (id: number, checked: boolean) => void,
}) => ({
  field: FIELD_KEY.toggle_contact_favorite,
  headerName: '',
  width: 50,
  visible,
  sortable: false,
  renderCell: (params: GridRenderCellParams) =>
    renderCell({ params, onToggleContactFavorite: onChange }),
});

export const getCompanyNameColumn = () => ({
  field: FIELD_KEY.company_name,
  headerName: i18n.t('Company name'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getFaxNumberColumn = () => ({
  field: FIELD_KEY.fax_number,
  headerName: i18n.t('Fax number'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getNameColumn = () => ({
  field: FIELD_KEY.name,
  headerName: i18n.t('Name'),
  flex: 1,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getActionsColumn = ({
  rowActions,
}: {
  rowActions: ({
    row: ElectronicFile & ExistingContact,
  }) => RowActionsReturnType,
}) => ({
  field: FIELD_KEY.actions,
  type: FIELD_KEY.actions,
  flex: 0.2,
  visible: true,
  getActions: ({ row }: GridRowParams) =>
    rowActions({ row }).rowActionComponents,
});
