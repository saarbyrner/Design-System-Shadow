import moment from 'moment';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  getReceivedFromColumn,
  getTitleColumn,
  getAttachmentsColumn,
  getDateColumn,
  getActionsColumn,
} from '@kitman/modules/src/ElectronicFiles/shared/components/Grid/Columns';
import Grid from '@kitman/modules/src/ElectronicFiles/shared/components/Grid';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as outboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchOutboundElectronicFileList.mock';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { getRowActions } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { KitmanIcon } from '@kitman/playbook/icons';
import { GridActionsCellItem } from '@kitman/playbook/components';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockOnAttachmentsChipClick = jest.fn();
const mockOnToggleViewed = jest.fn();
const mockOnToggleArchived = jest.fn();
const mockOnUpdateContact = jest.fn();
const mockOnToggleContactsArchived = jest.fn();

const rowActions = getRowActions({
  row: inboundData.data,
  selectedMenuItem: MENU_ITEM.inbox,
  onToggleViewed: mockOnToggleViewed,
  onToggleArchived: mockOnToggleArchived,
  onUpdateContact: mockOnUpdateContact,
  onToggleContactsArchived: mockOnToggleContactsArchived,
});

const columns = [
  getReceivedFromColumn(),
  getTitleColumn(),
  getAttachmentsColumn(mockOnAttachmentsChipClick),
  getDateColumn(),
  getActionsColumn({
    rowActions: jest.fn().mockReturnValue({
      rowActionComponents: rowActions.map((rowAction) => (
        <GridActionsCellItem
          key={rowAction.id}
          label={rowAction.label}
          icon={<KitmanIcon name={rowAction.icon} />}
          onClick={rowAction.onClick}
          showInMenu
          dense
        />
      )),
    }),
  }),
];

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockOnRowClick = jest.fn();

const defaultProps = {
  loading: false,
  grid: {
    columns,
    rows: outboundData.data,
  },
  meta: {
    current_page: 1,
    total_count: 1,
  },
  onRowClick: mockOnRowClick,
  rowSelectionModel: [1, 2, 3],
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={storeFake({})}>
      <Grid {...props} />
    </Provider>
  );

describe('<Grid />', () => {
  beforeEach(() => {
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
  });

  it('renders the correct content', async () => {
    renderComponent();

    const tableHeaders = document
      .querySelector('.MuiDataGrid-columnHeaders')
      .querySelectorAll('.MuiDataGrid-columnHeaderTitle');

    expect(tableHeaders.length).toBe(columns.length);

    const tableRows = document
      .querySelector('.MuiDataGrid-root')
      .querySelectorAll('.MuiDataGrid-row');

    expect(tableRows.length).toBe(outboundData.data.length);

    const [firstRow] = tableRows;

    tableHeaders.forEach((header, index) => {
      // last column does not have headerName
      if (index === columns.length - 1) {
        return;
      }
      expect(tableHeaders[index]).toHaveTextContent(columns[index].headerName);
    });

    const data = outboundData.data;

    expect(firstRow.querySelectorAll('.MuiDataGrid-cell')[0]).toHaveTextContent(
      data[0].sent_to[0].fax_number.number
    );
    expect(firstRow.querySelectorAll('.MuiDataGrid-cell')[1]).toHaveTextContent(
      data[0].title
    );
    expect(firstRow.querySelectorAll('.MuiDataGrid-cell')[2]).toHaveTextContent(
      `${data[0].attachments.length} attachment`
    );
    expect(firstRow.querySelectorAll('.MuiDataGrid-cell')[3]).toHaveTextContent(
      formatStandard({ date: moment(data[0].date) })
    );

    expect(
      within(firstRow.querySelector('.MuiDataGrid-actionsCell')).getByTestId(
        'MoreVertIcon'
      )
    ).toBeInTheDocument();
  });

  it('renders the correct content when we have no data', async () => {
    renderComponent({
      ...defaultProps,
      grid: { rows: [], columns, emptyTableText: 'No eFiles found' },
      meta: { ...defaultProps.meta, total_count: 0 },
    });

    const tableHeaders = document
      .querySelector('.MuiDataGrid-columnHeaders')
      .querySelectorAll('.MuiDataGrid-columnHeaderTitle');

    expect(tableHeaders.length).toBe(columns.length);

    tableHeaders.forEach((header, index) => {
      // last column doesn't have headerName
      if (index === columns.length - 1) {
        return;
      }
      expect(tableHeaders[index]).toHaveTextContent(columns[index].headerName);
    });

    await Promise.resolve();
    expect(await screen.findByText('No eFiles found')).toBeInTheDocument();
  });

  it('calls onRowClick on click', async () => {
    renderComponent();

    const data = inboundData.data;

    const receivedFrom = screen.getByText(
      data[0].received_from.fax_number.number
    );

    expect(receivedFrom).toBeInTheDocument();

    await userEvent.click(receivedFrom);

    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
  });

  describe('Row actions', () => {
    it('calls mockOnToggleViewed on Mark as read/unread', async () => {
      const user = userEvent.setup();

      renderComponent();

      const firstRowActions = screen.getAllByTestId('MoreVertIcon')[0];

      expect(firstRowActions).toBeInTheDocument();

      await user.click(firstRowActions);

      const toggleViewedAction = screen.getByText('Mark as read');

      expect(toggleViewedAction).toBeInTheDocument();

      await user.click(toggleViewedAction);

      expect(mockOnToggleViewed).toHaveBeenCalledTimes(1);
    });

    it('calls mockOnToggleArchived on Archive/unarchive', async () => {
      const user = userEvent.setup();

      renderComponent();

      const firstRowActions = screen.getAllByTestId('MoreVertIcon')[0];

      expect(firstRowActions).toBeInTheDocument();

      await user.click(firstRowActions);

      const toggleArchivedAction = screen.getAllByText('Archive')[0];

      expect(toggleArchivedAction).toBeInTheDocument();

      await user.click(toggleArchivedAction);

      expect(mockOnToggleArchived).toHaveBeenCalledTimes(1);
    });

    it('calls mockOnUpdateContact on Edit', async () => {
      const user = userEvent.setup();

      renderComponent();

      const firstRowActions = screen.getAllByTestId('MoreVertIcon')[0];

      expect(firstRowActions).toBeInTheDocument();

      await user.click(firstRowActions);

      const updateContactAction = screen.getByText('Edit');

      expect(updateContactAction).toBeInTheDocument();

      await user.click(updateContactAction);

      expect(mockOnUpdateContact).toHaveBeenCalledTimes(1);
    });

    it('calls mockOnToggleContactsArchived on Archive/unarchive contacts', async () => {
      const user = userEvent.setup();

      renderComponent();

      const firstRowActions = screen.getAllByTestId('MoreVertIcon')[0];

      expect(firstRowActions).toBeInTheDocument();

      await user.click(firstRowActions);

      const toggleContactsArchivedAction = screen.getAllByText('Archive')[1];

      expect(toggleContactsArchivedAction).toBeInTheDocument();

      await user.click(toggleContactsArchivedAction);

      expect(mockOnToggleContactsArchived).toHaveBeenCalledTimes(1);
    });
  });
});
