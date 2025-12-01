import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import * as services from '@kitman//modules/src/analysis/BenchmarkReport/redux/service';
import {
  rowsData,
  rowsDataEmpty,
} from '@kitman/modules/src/analysis/BenchmarkReport/benchmark-report-data.mock';
import Table from '..';

jest.mock('@kitman/common/src/contexts/OrganisationContext');

const MOCK_ROWS = rowsData;
const MOCK_ROWS_EMPTY = rowsDataEmpty;

const props = {
  benchmarkReportParams: {
    training_variable_ids: [],
    seasons: [],
    testing_window_ids: [],
    age_group_ids: [],
  },
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Table', () => {
  describe('Benchmark Report Data Returned', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetBenchmarkReportQuery').mockReturnValue({
        data: MOCK_ROWS,
        isFetching: false,
      });
      useOrganisation.mockReturnValue({
        organisation: {
          benchmark_reporting: false,
        },
      });
    });

    it('renders the Table component with heading', () => {
      render(<Table {...props} />);

      const tableHeader = screen.getByRole('heading', { level: 2 });
      expect(tableHeader).toBeVisible();
    });

    it('renders the Table Legend if cat 1 club', () => {
      useOrganisation.mockReturnValue({
        organisation: {
          benchmark_reporting: true,
        },
      });
      render(<Table {...props} />);

      const nationalLegendItem = screen.getByText('National (white)');
      expect(nationalLegendItem).toBeVisible();

      const myClubLegendItem = screen.getByText('My club (purple)');
      expect(myClubLegendItem).toBeVisible();

      const individualAthletesLegendItem = screen.getByText(
        'Individual athletes (yellow)'
      );
      expect(individualAthletesLegendItem).toBeVisible();
    });

    it('does not render the Table Legend if not cat 1 club', () => {
      render(<Table {...props} />);

      const nationalLegendItem = screen.queryByText('National (white)');
      expect(nationalLegendItem).not.toBeInTheDocument();

      const myClubLegendItem = screen.queryByText('My club (purple)');
      expect(myClubLegendItem).not.toBeInTheDocument();

      const individualAthletesLegendItem = screen.queryByText(
        'Individual athletes (yellow)'
      );
      expect(individualAthletesLegendItem).not.toBeInTheDocument();
    });
  });

  describe('Benchmark Report Data Empty', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetBenchmarkReportQuery').mockReturnValue({
        data: MOCK_ROWS_EMPTY,
        isFetching: false,
      });
    });

    it('renders the Table component with heading', () => {
      render(<Table {...props} />);

      const tableHeader = screen.getByRole('heading', { level: 2 });
      expect(tableHeader).toBeVisible();
    });

    it('renders the "No Data Available" message', () => {
      render(<Table {...props} />);

      const noDataAvailableMessage = screen.getByText('No data available');
      expect(noDataAvailableMessage).toBeVisible();

      const updateFiltersMessage = screen.getByText(
        'No data available for current selection - Try updating your filters'
      );
      expect(updateFiltersMessage).toBeVisible();
    });
  });

  describe('Benchmark Report Loading', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetBenchmarkReportQuery').mockReturnValue({
        data: rowsData,
        isFetching: true,
      });
    });

    it('renders the loading status', () => {
      render(<Table {...props} />);

      const loadingMessage = screen.getByText('Loading results...');
      expect(loadingMessage).toBeVisible();

      const loadingInfo = screen.getByText('This may take several minutes');
      expect(loadingInfo).toBeVisible();
    });
  });

  describe('Benchmark Report error', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetBenchmarkReportQuery').mockReturnValue({
        data: MOCK_ROWS,
        isFetching: false,
        isError: true,
      });
    });

    it('renders the "Something went wrong" message even with previous successful data', () => {
      render(<Table {...props} />);

      const errorMessage = screen.getByText('Something went wrong');
      expect(errorMessage).toBeVisible();

      const errorDescriptionMessage = screen.getByText(
        'There was a problem generating results - Try updating your filters'
      );
      expect(errorDescriptionMessage).toBeVisible();
    });
  });

  describe('when the back end doesn’t include `id`', () => {
    beforeEach(() => {
      jest.spyOn(services, 'useGetBenchmarkReportQuery').mockReturnValue({
        data: MOCK_ROWS.map((row) => {
          // eslint-disable-next-line no-param-reassign
          delete row.id;
          return row;
        }),
        isFetching: false,
      });
    });

    it('renders the Table component with heading', () => {
      render(<Table {...props} />);

      const tableHeader = screen.getByRole('heading', { level: 2 });
      expect(tableHeader).toBeVisible();
    });
  });
});
