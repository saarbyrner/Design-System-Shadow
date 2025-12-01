import {
  getReceivedFromColumn,
  getSentToColumn,
  getTitleColumn,
  getAttachmentColumn,
  getAttachedToColumn,
  getAttachmentsColumn,
  getStatusColumn,
  getToggleContactFavoriteColumn,
  getCompanyNameColumn,
  getFaxNumberColumn,
  getNameColumn,
  getActionsColumn,
} from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Columns';

const mockOnAttachmentsChipClick = jest.fn();
const mockOnAttachedToChipClick = jest.fn();
const mockOnToggleContactFavorite = jest.fn();

const columns = {
  from: getReceivedFromColumn(),
  to: getSentToColumn(),
  title: getTitleColumn(),
  attachment: getAttachmentColumn(),
  attachments: getAttachmentsColumn(mockOnAttachmentsChipClick),
  attachedTo: getAttachedToColumn(mockOnAttachedToChipClick),
  status: getStatusColumn(),
  toggleContactFavorite: getToggleContactFavoriteColumn(
    mockOnToggleContactFavorite
  ),
  companyName: getCompanyNameColumn(),
  faxNumber: getFaxNumberColumn(),
  name: getNameColumn(),
  actions: getActionsColumn({ rowActions: jest.fn() }),
};

describe('Columns', () => {
  it.each(Object.keys(columns))('has a %s column', (columnKey) => {
    const columnObject = {
      field: columns[columnKey].field,
      type: columns[columnKey].type,
      headerName: columns[columnKey].headerName,
      flex: columns[columnKey].flex,
      width: columns[columnKey].width,
      visible: columns[columnKey].visible,
      sortable: columns[columnKey].sortable,
      renderCell: columns[columnKey].renderCell,
      getActions: columns[columnKey].getActions,
    };
    expect(columns[columnKey]).toEqual(columnObject);
  });
});
