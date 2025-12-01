import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import ChartOptionsMenu from '../index';

describe('analysis dashboard | <ChartOptionsMenu />', () => {
  const baseProps = {
    t: i18nextTranslateStub(),
    selectedChartOptions: { hide_zero_values: true },
    chartType: CHART_TYPE.xy,
    onChartOptionUpdate: jest.fn(),
  };

  it('renders the Chart options menu button', () => {
    renderWithStore(<ChartOptionsMenu {...baseProps} />);

    expect(screen.getByText('Chart Options')).toBeInTheDocument();
  });

  it('should display chart options menu on click of the button', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    expect(screen.getByLabelText('Hide zero values')).toBeInTheDocument();
    expect(screen.getByLabelText('Hide null values')).toBeInTheDocument();
  });

  it('should close the chart options menu on clicking outside', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    await userEvent.click(document.body);

    expect(screen.queryByTestId('chart-options-menu')).not.toBeInTheDocument();
  });

  it('should pre-populate checkbox based on the selected chart options', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    expect(screen.getByLabelText('Hide zero values')).toBeChecked();
  });

  it('should update the chart when user checks the checkbox', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    await user.click(screen.getByLabelText('Hide null values'));

    expect(baseProps.onChartOptionUpdate).toHaveBeenCalledWith(
      'hide_null_values',
      true
    );
  });

  it('should update the chart when user unchecks the checkbox', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    await user.click(screen.getByLabelText('Hide zero values'));

    expect(baseProps.onChartOptionUpdate).toHaveBeenCalledWith(
      'hide_zero_values',
      false
    );
  });

  it('should not display pie chart specific options', async () => {
    const user = userEvent.setup();

    renderWithStore(<ChartOptionsMenu {...baseProps} />);
    await user.click(screen.getByText('Chart Options'));

    expect(screen.queryByText('Show label')).not.toBeInTheDocument();
    expect(screen.queryByText('Show values')).not.toBeInTheDocument();
    expect(screen.queryByText('Show percentage')).not.toBeInTheDocument();
  });

  describe('when chartType is pie', () => {
    const props = {
      ...baseProps,
      chartType: CHART_TYPE.pie,
      selectedChartOptions: { show_percentage: true },
    };

    it('should display show label/values/percentage chart options', async () => {
      const user = userEvent.setup();

      renderWithStore(<ChartOptionsMenu {...props} />);
      await user.click(screen.getByText('Chart Options'));

      expect(screen.getByLabelText('Show label')).toBeInTheDocument();
      expect(screen.getByLabelText('Show values')).toBeInTheDocument();
      expect(screen.getByLabelText('Show percentage')).toBeInTheDocument();
    });

    it('should not display hide zero/null chart options', async () => {
      const user = userEvent.setup();

      renderWithStore(<ChartOptionsMenu {...props} />);
      await user.click(screen.getByText('Chart Options'));

      expect(screen.queryByText('Hide zero values')).not.toBeInTheDocument();
      expect(screen.queryByText('Hide null values')).not.toBeInTheDocument();
    });

    it('should pre-populate checkbox based on the selected chart options', async () => {
      const user = userEvent.setup();

      renderWithStore(<ChartOptionsMenu {...props} />);
      await user.click(screen.getByText('Chart Options'));

      expect(screen.getByLabelText('Show percentage')).toBeChecked();
    });

    it('should preselect Show label and legend by default when a new chart is added', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ChartOptionsMenu {...props} selectedChartOptions={null} />
      );
      await user.click(screen.getByText('Chart Options'));

      expect(screen.getByLabelText('Show label')).toBeChecked();
      expect(screen.getByLabelText('Show legend')).toBeChecked();
    });
  });
});
