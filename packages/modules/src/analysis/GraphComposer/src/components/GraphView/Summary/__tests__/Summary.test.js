import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Summary from '..';

describe('Graph Composer <Summary /> component', () => {
  const props = {
    graphType: 'line',
    canBuildGraph: true,
    canSaveGraph: true,
    graphData: getDummyData('summary'),
    updateAggregationPeriod: () => {},
    closeGraphModal: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('expands the graph when isGraphExpanded is true', () => {
    renderWithStore(<Summary {...props} isGraphExpanded />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const modalGraphContainer = modal.querySelector('[data-highcharts-chart]');
    expect(modalGraphContainer).toHaveStyle('height: 80%');
  });

  it('calls the correct callback when closing the modal', async () => {
    const user = userEvent.setup();
    renderWithStore(<Summary {...props} isGraphExpanded graphType="table" />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');

    // Close button
    await user.click(buttons[1]);
    expect(props.closeGraphModal).toHaveBeenCalledTimes(1);
  });

  it('shows the table graph when graphType is table', () => {
    const { container } = renderWithStore(
      <Summary {...props} graphType="table" />
    );

    const table = container.querySelector('table');

    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('table km-table');
    expect(screen.getByText('3 Metrics')).toBeInTheDocument();
  });
});
