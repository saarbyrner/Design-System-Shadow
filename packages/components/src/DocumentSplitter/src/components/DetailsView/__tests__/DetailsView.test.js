import moment from 'moment-timezone';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { REDUCER_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';
import DetailsView from '@kitman/components/src/DocumentSplitter/src/components/DetailsView';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

setI18n(i18n);

const defaultProps = {
  dataRows: [
    {
      id: 1,
      pages: '1-5',
      player: { id: 1, label: 'Player 1' },
      categories: [{ id: 2, label: 'Category 2' }],
      fileName: 'Test filename',
      dateOfDocument: '2024-04-03T00:00:00+00:00',
    },
  ],
  validationResults: {},
  players: [
    { id: 1, label: 'Player 1' },
    { id: 2, label: 'Player 2' },
  ],
  documentCategories: [
    { id: 1, label: 'Category 1' },
    { id: 2, label: 'Category 2' },
  ],
  isPlayerPreselected: false,
  isFetchingPlayers: false,
  isFetchingDocumentCategories: false,
  isSaving: false,
  t: i18nextTranslateStub(),
};

const mockDispatch = jest.fn();
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const renderComponent = (props = defaultProps) =>
  render(
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
      <Provider
        store={storeFake({
          globalApi: {},
          medicalSharedApi: {
            useGetAthleteDataQuery: jest.fn(),
          },
        })}
      >
        <DetailsView {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('DetailsView', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    mockDispatch.mockClear();
  });

  it('displays rows correctly', () => {
    renderComponent();
    expect(screen.getAllByRole('columnheader').length).toBe(6);
    const expectedColumns = [
      'Pages',
      'Player',
      'Categories',
      'File name',
      'Date of document',
    ];
    expectedColumns.forEach((column) => {
      expect(
        screen.getByRole('columnheader', { name: column })
      ).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2); // Header + 1 data row

    const cellsR1 = within(rows[1]).getAllByRole('cell');
    expect(cellsR1.length).toBe(6);

    const contentValues = [
      '1-5',
      'Player 1',
      'Category 2',
      'Test filename',
      '03/04/2024',
    ];

    const pagesInput = within(cellsR1[0]).getByRole('textbox', {
      name: 'Pages',
    });
    expect(pagesInput).toHaveValue(contentValues[0]);

    const playerInput = within(cellsR1[1]).getByRole('combobox', {
      name: 'Player',
    });
    expect(playerInput).toHaveValue(contentValues[1]);

    expect(within(cellsR1[2]).getByText(contentValues[2])).toBeInTheDocument();

    const filenameInput = within(cellsR1[3]).getByRole('textbox', {
      name: 'File name',
    });
    expect(filenameInput).toHaveValue(contentValues[3]);

    const dateInput = within(cellsR1[4]).getByRole('textbox');
    expect(dateInput).toHaveValue(contentValues[4]);

    const deleteButton = within(cellsR1[5]).getByRole('menuitem', {
      name: 'Delete',
    });
    expect(deleteButton).toBeInTheDocument();
    expect(screen.queryByText('No rows')).not.toBeInTheDocument();
  });

  it('renders no rows if not rows present', () => {
    renderComponent({ ...defaultProps, dataRows: [] });

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('dispatches updateRow on editing a row', async () => {
    renderComponent();

    const user = userEvent.setup();
    const rows = screen.getAllByRole('row');
    const cellsR1 = within(rows[1]).getAllByRole('cell');
    const pagesInput = within(cellsR1[0]).getByRole('textbox', {
      name: 'Pages',
    });

    await user.type(pagesInput, '0');

    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        rowId: 1,
        data: { pages: '1-50' },
      },
      type: `${REDUCER_KEY}/updateRow`,
    });
  });

  it('dispatches addRow on pressing add another', async () => {
    renderComponent();
    const user = userEvent.setup();

    const addButton = screen.getByRole('button', {
      name: 'Add another',
    });
    await user.click(addButton);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${REDUCER_KEY}/addRow`,
    });
  });

  it('dispatches deleteRow on pressing delete action', async () => {
    renderComponent();
    const user = userEvent.setup();

    const rows = screen.getAllByRole('row');
    const cellsR1 = within(rows[1]).getAllByRole('cell');
    const deleteButton = within(cellsR1[5]).getByRole('menuitem', {
      name: 'Delete',
    });
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        rowId: 1,
      },
      type: `${REDUCER_KEY}/deleteRow`,
    });
  });
});
