import moment from 'moment-timezone';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { Provider } from 'react-redux';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useSearchPastAthletesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import i18n from '@kitman/common/src/utils/i18n';
import { minimalSquadAthletes as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/searchPastAthletes';
import { GRID_ROW_FIELD_KEYS as FIELD_KEYS } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { mapSquadAthleteToOptions } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import {
  renderCell,
  renderPlayerSelect,
  renderCategoriesSelect,
  PagesCellEditor,
  FileNameCellEditor,
} from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Cells';

// Mock render functions for memoization tests
const mockPagesCellEditorRender = jest.fn();
const mockFileNameCellEditorRender = jest.fn();

// Mock the specific memoized components to track their renders
jest.mock(
  '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Cells',
  () => {
    const originalModule = jest.requireActual(
      '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Cells'
    );
    const React = jest.requireActual('react');

    return {
      ...originalModule,
      PagesCellEditor: React.memo((props) => {
        mockPagesCellEditorRender();
        return <originalModule.PagesCellEditor {...props} />;
      }),
      FileNameCellEditor: React.memo((props) => {
        mockFileNameCellEditorRender();
        return <originalModule.FileNameCellEditor {...props} />;
      }),
    };
  }
);

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useSearchPastAthletesQuery: jest.fn(),
  })
);

const mockDispatch = jest.fn();
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

setI18n(i18n);

describe('renderCell', () => {
  const onUpdateRowCallback = jest.fn();
  const players = mapSquadAthleteToOptions(squadAthletes);

  const categories = [
    { id: 1, label: 'Test category 1' },
    { id: 2, label: 'Test category 2' },
  ];

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        permissions: {
          general: {
            pastAthletes: {
              canView: true,
            },
          },
        },
      },
      error: false,
      isLoading: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletes,
      error: false,
      isLoading: false,
    });
    useSearchPastAthletesQuery.mockReturnValue({
      data: pastAthletes,
      error: false,
      isLoading: false,
    });
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    onUpdateRowCallback.mockClear();
    moment.tz.setDefault();
  });

  it('renders pages cell correctly', () => {
    const shouldShowError = false;
    const shouldDisable = false;

    render(
      renderCell(
        { id: 1, field: FIELD_KEYS.pages, row: { pages: '1-2' } },
        onUpdateRowCallback,
        shouldShowError,
        shouldDisable
      )
    );
    const input = screen.getByRole('textbox', { name: 'Pages' });
    expect(input).toHaveValue('1-2');
    expect(input).toBeEnabled();
    expect(input).toBeValid();

    fireEvent.change(input, {
      target: { value: '1-20' },
    });

    expect(onUpdateRowCallback).toHaveBeenCalledWith({
      data: { pages: '1-20' },
      rowId: 1,
    });
  });

  it('renders pages cell disabled and with error', () => {
    const shouldShowError = true;
    const shouldDisable = true;

    render(
      renderCell(
        { id: 1, field: FIELD_KEYS.pages, row: { pages: '1-2' } },
        onUpdateRowCallback,
        shouldShowError,
        shouldDisable
      )
    );
    const input = screen.getByRole('textbox', { name: 'Pages' });
    expect(input).toHaveValue('1-2');
    expect(input).toBeDisabled();
    expect(input).not.toBeValid();
  });

  describe('Memoization tests', () => {
    beforeEach(() => {
      mockPagesCellEditorRender.mockClear();
      mockFileNameCellEditorRender.mockClear();
    });

    it('PagesCellEditor does not re-render when props are shallowly equal', () => {
      const initialProps = {
        id: 1,
        value: '1-2',
        onUpdateRowCallback: jest.fn(),
        shouldShowError: false,
        shouldDisable: false,
      };

      const { rerender } = render(<PagesCellEditor {...initialProps} />);
      expect(mockPagesCellEditorRender).toHaveBeenCalledTimes(1);

      // Re-render with identical props
      rerender(<PagesCellEditor {...initialProps} />);
      expect(mockPagesCellEditorRender).toHaveBeenCalledTimes(1); // Should not re-render

      // Re-render with a different value prop
      rerender(<PagesCellEditor {...{ ...initialProps, value: '1-3' }} />);
      expect(mockPagesCellEditorRender).toHaveBeenCalledTimes(2); // Should re-render
    });

    it('FileNameCellEditor does not re-render when props are shallowly equal', () => {
      const initialProps = {
        id: 1,
        value: 'test.pdf',
        onUpdateRowCallback: jest.fn(),
        shouldShowError: false,
        shouldDisable: false,
      };

      const { rerender } = render(<FileNameCellEditor {...initialProps} />);
      expect(mockFileNameCellEditorRender).toHaveBeenCalledTimes(1);

      // Re-render with identical props
      rerender(<FileNameCellEditor {...initialProps} />);
      expect(mockFileNameCellEditorRender).toHaveBeenCalledTimes(1); // Should not re-render

      // Re-render with a different value prop
      rerender(
        <FileNameCellEditor {...{ ...initialProps, value: 'new.pdf' }} />
      );
      expect(mockFileNameCellEditorRender).toHaveBeenCalledTimes(2); // Should re-render
    });
  });

  it('renders dateOfDocument cell correctly', () => {
    const shouldShowError = false;
    const shouldDisable = false;

    render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <Provider store={storeFake({})}>
          {renderCell(
            {
              id: 1,
              field: FIELD_KEYS.dateOfDocument,
              row: { dateOfDocument: '2024-04-03T00:00:00+00:00' },
            },
            onUpdateRowCallback,
            shouldShowError,
            shouldDisable
          )}
        </Provider>
      </LocalizationProvider>
    );
    const datePicker = screen.getByRole('textbox');
    expect(datePicker).toBeInTheDocument();
    expect(datePicker).toHaveValue('03/04/2024');

    fireEvent.change(datePicker, {
      target: { value: '06/04/2024' }, // 6th April
    });

    expect(onUpdateRowCallback).toHaveBeenCalledWith({
      data: {
        dateOfDocument: '2024-04-06T00:00:00+00:00',
        hasConstraintsError: false,
      },
      rowId: 1,
    });
  });

  it('renders fileName cell correctly', () => {
    const shouldShowError = false;
    const shouldDisable = false;
    render(
      renderCell(
        {
          id: 1,
          field: FIELD_KEYS.fileName,
          row: { fileName: 'testFile.pdf' },
        },
        onUpdateRowCallback,
        shouldShowError,
        shouldDisable
      )
    );
    const input = screen.getByRole('textbox', { name: 'File name' });
    expect(input).toHaveValue('testFile.pdf');
    expect(input).toBeEnabled();
    expect(input).toBeValid();

    fireEvent.change(input, {
      target: { value: 'editedFilename.pdf' },
    });
    expect(onUpdateRowCallback).toHaveBeenCalledWith({
      data: { fileName: 'editedFilename.pdf' },
      rowId: 1,
    });
  });

  it('renders player select cell correctly', async () => {
    const user = userEvent.setup();
    const shouldShowError = false;
    const shouldDisable = false;
    const shouldShowLoading = false;

    render(
      renderPlayerSelect(
        {
          id: 1,
          field: FIELD_KEYS.player,
          row: { player: players[0] },
        },
        onUpdateRowCallback,
        players,
        shouldShowLoading,
        shouldShowError,
        shouldDisable
      )
    );

    expect(screen.getByLabelText('Player')).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Player' });
    expect(input).toHaveValue(players[0].label);
    expect(input).toBeEnabled();
    expect(input).toBeValid();

    await user.click(input);

    players.forEach((player) => {
      expect(
        screen.getAllByRole('option', { name: player.label })[0]
      ).toBeInTheDocument();
    });

    await user.click(screen.getByText(players[1].label));
    expect(onUpdateRowCallback).toHaveBeenCalledWith({
      data: { player: players[1] },
      rowId: 1,
    });
  });

  it('renders player select cell disabled and with error', () => {
    const shouldShowError = true;
    const shouldDisable = true;
    const shouldShowLoading = false;

    render(
      renderPlayerSelect(
        {
          id: 1,
          field: FIELD_KEYS.player,
          row: { player: players[0] },
        },
        onUpdateRowCallback,
        players,
        shouldShowLoading,
        shouldShowError,
        shouldDisable
      )
    );

    expect(screen.getByLabelText('Player')).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Player' });
    expect(input).toHaveValue(players[0].label);
    expect(input).toBeDisabled();
    expect(input).not.toBeValid();
  });

  it('renders categories select cell correctly', async () => {
    const user = userEvent.setup();
    const shouldShowError = false;
    const shouldDisable = false;
    const shouldShowLoading = false;

    render(
      renderCategoriesSelect(
        {
          id: 1,
          field: FIELD_KEYS.categories,
          row: { categories: [categories[0]] },
        },
        onUpdateRowCallback,
        categories,
        shouldShowLoading,
        shouldShowError,
        shouldDisable
      )
    );

    expect(screen.getByLabelText('Categories')).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Categories' });
    expect(input).toBeEnabled();
    expect(input).toBeValid();

    await user.click(input);

    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category.label })
      ).toBeInTheDocument();
    });
    await user.click(screen.getByText(categories[1].label));
    expect(onUpdateRowCallback).toHaveBeenCalledWith({
      data: { categories: [categories[0], categories[1]] }, // multiple allowed
      rowId: 1,
    });
  });

  it('renders categories select cell disabled and with error', () => {
    const shouldShowError = true;
    const shouldDisable = true;
    const shouldShowLoading = false;
    render(
      renderCategoriesSelect(
        {
          id: 1,
          field: FIELD_KEYS.categories,
          row: { categories: [categories[0]] },
        },
        onUpdateRowCallback,
        categories,
        shouldShowLoading,
        shouldShowError,
        shouldDisable
      )
    );

    expect(screen.getByLabelText('Categories')).toBeInTheDocument();
    const input = screen.getByRole('combobox', { name: 'Categories' });
    expect(input).toBeDisabled();
    expect(input).not.toBeValid();
  });
});
