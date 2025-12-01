import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import TableWidget from '../index';

describe('TableWidget Component', () => {
  const onClickAddColumnMock = jest.fn();

  // NOTE: there is a very large number of props on this component
  // Only supplying what is necessary for the test
  const props = {
    // locale
    // labels
    // groups
    isLoadingAthleteData: false,
    appliedColumnDetails: [],
    appliedRowDetails: [],
    canManageDashboard: true,
    // containerType
    // columnWidthType
    hasError: false,
    isLoading: false,
    // onChangeColumnSummary
    // onChangeRowSummary
    onClickAddColumn: onClickAddColumnMock,
    // onClickAddRow
    // onClickDeleteColumn
    // onClickEditComparisonColumn
    // onClickEditLongitudinalColumn
    // onClickEditRow
    // onClickEditScorecardColumn
    // onClickFormatColumn
    // onClickFormatScorecardRow
    // onClickLockColumnPivot
    // onColumnOrderUpdated
    // onDelete
    // onDuplicate
    // onDuplicateColumn
    // onUpdateSummaryVisibility
    // onUpdateTableName
    // pivotedDateRange
    // pivotedTimePeriod
    // pivotedPopulation
    // pivotedTimePeriodLength
    // renderedByPrintBuilder
    // setColumnWidthType
    // setColumnRankingCalculation
    // setRowRankingCalculation
    // sortedColumnId
    // sortedOrder
    // onColumnSortUpdated
    showSummary: true,
    // squadAthletes
    tableContainerId: 2,
    tableName: 'Test Table',
    tableType: 'COMPARISON',
    widgetId: 1,
    t: i18nextTranslateStub(),
  };

  describe('when rep-table-formula-columns is true', () => {
    beforeEach(() => {
      window.setFlag('rep-table-formula-columns', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-formula-columns', false);
    });

    it('renders the TableWidget component with edit button', () => {
      renderWithStore(<TableWidget {...props} />);

      const editButton = screen.getByRole('button', {
        name: 'Edit Table',
      });

      expect(editButton).toBeInTheDocument();
    });

    it('renders add row and add column icons on edit', async () => {
      const user = userEvent.setup();

      renderWithStore(<TableWidget {...props} />);

      const editButton = screen.getByRole('button', {
        name: 'Edit Table',
      });
      await user.click(editButton);

      const columnAddIcons = document.getElementsByClassName(
        'tableWidget__addColumn icon-add'
      );
      expect(columnAddIcons).toHaveLength(1);
      const rowAddIcons = document.getElementsByClassName(
        'tableWidget__addRow icon-add'
      );
      expect(rowAddIcons).toHaveLength(1);
    });

    it('calls onClickAddColumn on deciding column Metric is data source', async () => {
      const user = userEvent.setup();

      renderWithStore(<TableWidget {...props} />);

      const editButton = screen.getByRole('button', {
        name: 'Edit Table',
      });
      await user.click(editButton);
      const columnAddIcons = document.getElementsByClassName(
        'tableWidget__addColumn icon-add'
      );
      await user.click(columnAddIcons[0]);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Metric' }));

      expect(onClickAddColumnMock).toHaveBeenCalledWith({
        existingTableColumns: [],
        existingTableRows: [],
        showSummary: true,
        source: 'metric',
        sourceSubtypeId: undefined,
        tableContainerId: 2,
        tableName: 'Test Table',
        tableType: 'COMPARISON',
        widgetId: 1,
      });
    });

    it('calls onClickAddColumn on deciding column Formula is data source', async () => {
      const user = userEvent.setup();

      renderWithStore(<TableWidget {...props} />);

      const editButton = screen.getByRole('button', {
        name: 'Edit Table',
      });
      await user.click(editButton);
      const columnAddIcons = document.getElementsByClassName(
        'tableWidget__addColumn icon-add'
      );
      await user.click(columnAddIcons[0]);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      const formulaOption = screen.getByRole('button', { name: 'Formula' });
      await userEvent.hover(formulaOption);
      const baseLineFormula = screen.getByText('% baseline change').parentNode;
      await user.click(baseLineFormula);

      expect(onClickAddColumnMock).toHaveBeenCalledWith({
        existingTableColumns: [],
        existingTableRows: [],
        showSummary: true,
        source: 'formula',
        sourceSubtypeId: 2,
        tableContainerId: 2,
        tableName: 'Test Table',
        tableType: 'COMPARISON',
        widgetId: 1,
      });
    });
  });

  describe('COMPARISON table type', () => {
    const emptySquadAthletesSelection = {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    };

    const baseProps = {
      appliedColumnDetails: [],
      appliedRowDetails: [],
      appliedTimeScopes: [],
      hasError: false,
      isLoading: false,
      pivotedDateRange: {
        start_date: '',
        end_date: '',
      },
      pivotedPopulation: emptySquadAthletesSelection,
      onUpdateTableName: jest.fn(),
      pivotedTimePeriod: '',
      pivotedTimePeriodLength: null,
      showSummary: true,
      squadAthletes: {
        id: 8,
        name: 'International Squad',
        position_groups: [
          {
            id: 25,
            name: 'Forward',
            positions: [
              {
                id: 123,
                name: 'Hooker',
                athletes: [],
              },
              {
                id: 456,
                name: 'Prop',
                athletes: [],
              },
            ],
          },
        ],
      },
      squads: [
        {
          id: 8,
          name: 'International Squad',
        },
      ],
      t: (key) => key,
      tableName: 'Test Table',
      tableContainerId: null,
      canManageDashboard: true,
      tableType: 'COMPARISON',
    };

    describe('when a new widget is added and there is no data', () => {
      it('renders the table name in the EditInPlace component', () => {
        renderWithStore(<TableWidget {...baseProps} />);

        expect(screen.getByText('Test Table')).toBeInTheDocument();
        const widgetMenu = document.querySelector(
          '.tableWidget__headerRightDetails'
        );
        expect(widgetMenu).toBeInTheDocument();
      });

      it('shows an edit table button', () => {
        renderWithStore(<TableWidget {...baseProps} />);

        const editButton = screen.getByRole('button', { name: 'Edit Table' });
        expect(editButton).toBeInTheDocument();
      });

      it('shows a basic table', () => {
        renderWithStore(<TableWidget {...baseProps} />);

        const tableContent = document.querySelector('.tableWidget__content');
        expect(tableContent).toBeInTheDocument();
      });
    });
  });
});
