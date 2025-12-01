import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '../../testUtils';
import BenchmarkDashboard from '..';

const props = {
  t: i18nextTranslateStub(),
  updateBenchmarkReportParams: jest.fn(),
};

describe('BenchmarkReport|components', () => {
  it('renders the filters and table components', () => {
    render(<BenchmarkDashboard {...props} />);

    const benchmarkDashboardHeading = screen.getByText('Benchmarking');
    const filtersSectionHeading = screen.getByText(
      'Select tests and time range'
    );
    const tableResultsHeading = screen.getByText('Results');

    expect(benchmarkDashboardHeading).toBeVisible();
    expect(filtersSectionHeading).toBeVisible();
    expect(tableResultsHeading).toBeVisible();
  });
});
