import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
// eslint-disable-next-line jest/no-mocks-import
import { TABLE_DYNAMIC_ROWS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import * as useTableDataModule from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useTableData';

import ComparisonTable from '../index';

const actualUseTableData = jest.requireActual(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget/hooks/useTableData'
).default;

describe('ComparisonTable Component', () => {
  const i18nT = i18nextTranslateStub();
  const onClickAddColumnMock = jest.fn();

  const props = {
    appliedColumnDetails: [
      { id: 1, table_element: { calculation: 'mean' }, time_scope: {} },
      { id: 2, table_element: { calculation: 'mean' }, time_scope: {} },
      { id: 3, table_element: { calculation: 'mean' }, time_scope: {} },
    ],
    appliedRowDetails: [
      {
        id: 25,
        row_id: '2425',
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [8],
        },
      },
      {
        id: 123,
        row_id: '12345',
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [123],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [8, 73],
        },
      },
    ],
    isEditMode: false,
    showSummary: false,
    canManageDashboard: true,
    allSquadAthletes: [
      {
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
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
      {
        id: 73,
        name: 'Academy Squad',
      },
    ],
    onClickAddColumn: onClickAddColumnMock,
    t: i18nT,
  };

  it('renders a population column', () => {
    const { container } = renderWithStore(<ComparisonTable {...props} />);

    const table = container.getElementsByClassName('tableWidget__table');
    expect(table).toHaveLength(1);
    const tableWidgetPopulation = container.getElementsByClassName(
      'tableWidget__population'
    );
    expect(tableWidgetPopulation).toHaveLength(1);
  });

  it('renders a population row for each appliedPopulation', async () => {
    const { container } = renderWithStore(<ComparisonTable {...props} />);

    const populationRows = container.getElementsByClassName(
      'tableWidget__comparisonPopulationRow'
    );
    expect(populationRows).toHaveLength(2);

    const populationRowHeaders = container.getElementsByClassName(
      'tableWidget__rowHeader--populationName'
    );
    expect(populationRowHeaders).toHaveLength(2);
    expect(populationRowHeaders[0]).toHaveTextContent('Forward');
    expect(populationRowHeaders[1]).toHaveTextContent('Hooker');
  });

  it('renders the selected squads on the population rows', () => {
    const { container } = renderWithStore(<ComparisonTable {...props} />);

    const contextSquadHeaders = container.getElementsByClassName(
      'tableWidget__rowHeader--contextSquad'
    );
    expect(contextSquadHeaders[0]).toHaveTextContent('International Squad');
    expect(contextSquadHeaders[1]).toHaveTextContent(
      'International Squad, Academy Squad'
    );
  });

  it('does not render `tableWidget__rowHeader--disabled` when the dashboard can be managed', () => {
    const { container } = renderWithStore(
      <ComparisonTable {...props} canManageDashboard />
    );
    expect(
      container.getElementsByClassName('tableWidget__rowHeader--disabled')
        .length
    ).toEqual(0);
  });

  it('renders `tableWidget__rowHeader--disabled` when the dashboard cannot be managed', () => {
    const { container } = renderWithStore(
      <ComparisonTable {...props} canManageDashboard={false} />
    );
    expect(
      container.getElementsByClassName('tableWidget__rowHeader--disabled')
        .length
    ).toEqual(2);
  });

  describe('for the summary row', () => {
    const withSummaryProps = {
      ...props,
      showSummary: true,
    };

    it('shows the summary row if showSummary is true', () => {
      const { container } = renderWithStore(
        <ComparisonTable {...withSummaryProps} />
      );

      const summaryRows = container.getElementsByClassName(
        'tableWidget__summaryRow'
      );
      expect(summaryRows[0]).toHaveTextContent('Count: 2');
    });
  });

  it('renders a column for each appliedColumnDetail', () => {
    const { container } = renderWithStore(<ComparisonTable {...props} />);

    const columns = container.getElementsByClassName('tableWidget__column');
    expect(columns).toHaveLength(3);
  });

  it('renders the SourceSelector when isEditMode', () => {
    const editModeProps = {
      ...props,
      isEditMode: true,
    };

    const { container } = renderWithStore(
      <ComparisonTable {...editModeProps} />
    );

    const columnAddIcons = container.getElementsByClassName(
      'tableWidget__addColumn icon-add'
    );
    expect(columnAddIcons).toHaveLength(1);
    const rowAddIcons = container.getElementsByClassName(
      'tableWidget__addRow icon-add'
    );
    expect(rowAddIcons).toHaveLength(1);
  });

  describe('when rep-table-formula-columns is true', () => {
    beforeEach(() => {
      window.setFlag('rep-table-formula-columns', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-formula-columns', false);
    });

    it('calls onClickAddColumn when column source selected', async () => {
      const editModeProps = {
        ...props,
        isEditMode: true,
      };
      const user = userEvent.setup();

      renderWithStore(<ComparisonTable {...editModeProps} />);

      await waitFor(() =>
        expect(screen.getByTestId('addColumnTrigger')).toBeInTheDocument()
      );
      const addColumnTriggerElement = screen.getByTestId('addColumnTrigger');
      await user.click(addColumnTriggerElement);

      await waitFor(() => screen.getByRole('tooltip'));
      // Metric is always present
      const metricOption = await screen.findByRole('button', {
        name: 'Metric',
      });
      expect(metricOption).toBeInTheDocument();
      await user.click(metricOption);

      expect(onClickAddColumnMock).toHaveBeenCalledWith('metric', undefined);
    });

    it('calls onClickAddColumn when % baseline change formula is selected', async () => {
      const editModeProps = {
        ...props,
        isEditMode: true,
      };
      const user = userEvent.setup();

      const { container } = renderWithStore(
        <ComparisonTable {...editModeProps} />
      );

      const columnAddIcons = container.getElementsByClassName(
        'tableWidget__addColumn icon-add'
      );
      await user.click(columnAddIcons[0]);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      const formulaOption = screen.getByRole('button', { name: 'Formula' });
      await userEvent.hover(formulaOption);
      const baseLineFormula = screen.getByText('% baseline change').parentNode;
      await user.click(baseLineFormula);

      expect(onClickAddColumnMock).toHaveBeenCalledWith('formula', 2);
    });

    it('calls onClickAddColumn when Percentage formula is selected', async () => {
      const editModeProps = {
        ...props,
        isEditMode: true,
      };
      const user = userEvent.setup();

      const { container } = renderWithStore(
        <ComparisonTable {...editModeProps} />
      );

      const columnAddIcons = container.getElementsByClassName(
        'tableWidget__addColumn icon-add'
      );
      await user.click(columnAddIcons[0]);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      const formulaOption = screen.getByRole('button', { name: 'Formula' });
      await userEvent.hover(formulaOption);
      const baseLineFormula = screen.getByText('Percentage').parentNode;
      await user.click(baseLineFormula);

      expect(onClickAddColumnMock).toHaveBeenCalledWith('formula', 1);
    });
  });

  it('does not render the SourceSelector when isEditMode is false', () => {
    const editModeProps = {
      ...props,
      isEditMode: false,
    };

    const { container } = renderWithStore(
      <ComparisonTable {...editModeProps} />
    );

    const columnAddIcons = container.getElementsByClassName(
      'tableWidget__addColumn icon-add'
    );
    expect(columnAddIcons).toHaveLength(0);
    const rowAddIcons = container.getElementsByClassName(
      'tableWidget__addRow icon-add'
    );
    expect(rowAddIcons).toHaveLength(0);
  });

  describe('when FF rep-historic-reporting is on', () => {
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
    });

    it('shows the text Historical squad if historic is true in the population', () => {
      renderWithStore(
        <ComparisonTable
          {...props}
          appliedRowDetails={[
            props.appliedRowDetails[0],
            {
              ...props.appliedRowDetails[1],
              population: {
                ...props.appliedRowDetails[1].population,
                historic: true,
              },
            },
          ]}
        />
      );
      expect(screen.getByText('Historical squad')).toBeInTheDocument();
    });

    it('does not show the Historical squad text if historic is false in the population', () => {
      renderWithStore(<ComparisonTable {...props} />);
      expect(screen.queryByText('Historical squad')).not.toBeInTheDocument();
    });
  });

  describe('when rep-table-widget-dynamic-rows is true', () => {
    beforeEach(() => {
      window.setFlag('rep-table-widget-dynamic-rows', true);

      jest
        .spyOn(useTableDataModule, 'default')
        .mockImplementation((...args) => {
          const actual = actualUseTableData(...args);
          return {
            ...actual,
            dynamicRows: { 2425: ['Athlete 1', 'Athlete 2', 'Athlete 3'] },
          };
        });
    });

    afterEach(() => {
      window.setFlag('rep-table-widget-dynamic-rows', false);
      jest.clearAllMocks();
    });

    it('renders dynamic rows', async () => {
      const editModeProps = {
        ...props,
        appliedRowDetails: [
          {
            ...TABLE_DYNAMIC_ROWS[0],
            config: {
              groupings: ['squad'],
            },
          },
        ],
      };
      const user = userEvent.setup();

      const { container } = renderWithStore(
        <ComparisonTable {...editModeProps} />
      );

      const dynamicRows = container.getElementsByClassName(
        'tableWidget__comparisonPopulationRow--disabled'
      );
      expect(dynamicRows).toHaveLength(3);

      // Dynamic rows are expanded by default
      expect(screen.getByText('Athlete 1')).toBeVisible();
      expect(screen.getByText('Athlete 2')).toBeVisible();

      // Collapse dynamic rows
      await user.click(screen.getByLabelText('Expand rows'));
      expect(screen.queryByText('Athlete 1')).not.toBeInTheDocument();

      // Expand it
      await user.click(screen.getByLabelText('Expand rows'));
      expect(screen.getByText('Athlete 1')).toBeVisible();
    });
  });
});
