import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import ComparisonColumn from '../ComparisonColumn';

jest.mock('../../ColumnHeader/ColumnHeader', () => ({
  ColumnHeaderTranslated: ({ columnName }) => (
    <div data-testid="column-header">{columnName}</div>
  ),
}));

jest.mock('../../DataCell', () => ({
  DataCellTranslated: ({ isLoading, rowData }) => (
    <td data-testid="data-cell" data-loading={isLoading}>
      {rowData?.label || 'data-cell'}
    </td>
  ),
}));

describe('ComparisonColumn Component', () => {
  const defaultProps = {
    calculation: 'sum',
    appliedRowDetails: [],
    dateSettings: {
      time_period: 'this_season',
      time_period_length: null,
      time_period_length_offset: null,
      start_time: null,
      end_time: null,
    },
    data: [],
    formattingRules: [],
    id: 999,
    isSorted: false,
    metricDetails: {
      key_name: 'kitman|training_session_rpe',
      unit: '',
    },
    name: 'RPE',
    showSummary: true,
    summaryCalculation: '',
    t: (key) => key,
  };

  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <table>
          <tbody>
            <ComparisonColumn {...defaultProps} {...props} />
          </tbody>
        </table>
      </I18nextProvider>
    );
  };

  describe('the session/date row', () => {
    it('renders a session/date row', () => {
      renderComponent({ dataStatus: 'SUCCESS' });

      expect(screen.getByText('This Season')).toBeInTheDocument();
    });

    it('renders the correct text when last x days with an offset', () => {
      const dateSettings = {
        ...defaultProps.dateSettings,
        time_period: 'last_x_days',
        time_period_length: 5,
        time_period_length_offset: 37,
      };

      renderComponent({ dataStatus: 'SUCCESS', dateSettings });

      expect(screen.getByText('Last 37 - 42 days')).toBeInTheDocument();
    });

    it('renders the correct text when last x events is present', () => {
      const dateSettings = {
        ...defaultProps.dateSettings,
        time_period: 'last_x_events',
        time_period_length: 5,
      };

      renderComponent({ dataStatus: 'SUCCESS', dateSettings });

      expect(screen.getByText('Last 5 events')).toBeInTheDocument();
    });

    it('renders the correct text when last x events and offset is present', () => {
      const dateSettings = {
        ...defaultProps.dateSettings,
        time_period: 'last_x_events',
        time_period_length: 5,
        time_period_length_offset: 5,
      };

      renderComponent({ dataStatus: 'SUCCESS', dateSettings });

      expect(screen.getByText('Last 5 - 10 events')).toBeInTheDocument();
    });
  });

  it('renders a header row', () => {
    renderComponent({ dataStatus: 'SUCCESS' });

    const headerRow = document.querySelector('.tableWidget__columnHeader');
    expect(headerRow).toBeInTheDocument();
  });

  it('renders caching loader when status is "CACHING"', () => {
    renderComponent({ dataStatus: 'CACHING' });

    const cachingLoader = screen.getByTestId('caching-loader');
    expect(cachingLoader).toBeInTheDocument();
  });

  it('renders loading cells', () => {
    const appliedRowDetails = [
      { id: 1, row_id: '123' },
      { id: 2, row_id: '234' },
    ];

    renderComponent({
      dataStatus: 'PENDING',
      appliedRowDetails,
    });

    const dataCells = screen.getAllByTestId('data-cell');
    expect(dataCells).toHaveLength(2);

    dataCells.forEach((cell) => {
      expect(cell).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('for the summary row', () => {
    it('shows the summary row', () => {
      renderComponent({ dataStatus: 'SUCCESS' });

      const summaryRow = document.querySelector('.tableWidget__summaryRow');
      expect(summaryRow).toBeInTheDocument();
    });

    it('renders `tableWidget__summaryRow--selector--disabled` when the dashboard cannot be managed', () => {
      renderComponent({
        canManageDashboard: false,
        dataStatus: 'SUCCESS',
      });

      const disabledSelector = document.querySelector(
        '.tableWidget__summaryRow--selector--disabled'
      );
      expect(disabledSelector).toBeInTheDocument();
    });

    describe('when showSummary is false', () => {
      it('does not show the summary row', () => {
        renderComponent({
          dataStatus: 'SUCCESS',
          showSummary: false,
        });

        const summaryRow = document.querySelector('.tableWidget__summaryRow');
        expect(summaryRow).not.toBeInTheDocument();
      });
    });
  });

  describe('when the rep-table-widget-dynamic-rows flag is on', () => {
    const updatedProps = {
      dataStatus: 'PENDING',
      appliedRowDetails: [
        {
          id: 1,
          row_id: '123',
          isDynamic: true,
        },
        { id: 2, row_id: '345', isDynamic: true },
        { id: 456, row_id: '234' },
      ],
      dynamicRows: {
        345: ['test-label-1', 'test-label-2'],
      },
    };

    beforeEach(() => {
      window.setFlag('rep-table-widget-dynamic-rows', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-widget-dynamic-rows', false);
    });

    it('renders children rows when is expanded', () => {
      renderComponent(updatedProps);

      const dataCells = screen.queryAllByTestId('data-cell');
      expect(dataCells).toHaveLength(5); // 3 rows + 2 dynamic rows

      dataCells.forEach((cell) => {
        expect(cell).toHaveAttribute('data-loading', 'true');
      });
    });

    it('does not render children rows when is collapsed', () => {
      renderComponent({
        ...updatedProps,
        collapsedRows: { 2: true },
      });

      const dataCells = screen.queryAllByTestId('data-cell');
      expect(dataCells).toHaveLength(3); // 3 rows

      dataCells.forEach((cell) => {
        expect(cell).toHaveAttribute('data-loading', 'true');
      });
    });
  });
});
