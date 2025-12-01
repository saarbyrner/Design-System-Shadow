import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetMetricVariablesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import MetricModule from '../MetricModule';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');

describe('analysis dashboard | <MetricModule />', () => {
  beforeEach(() => {
    useGetMetricVariablesQuery.mockReturnValue({
      data: [
        {
          source_key: 'combination|%_difference',
          name: '% Difference',
          source_name: 'Combination',
          type: 'number',
          localised_unit: '',
        },
        {
          source_key: 'kitman:athlete|age_in_years',
          name: 'Age',
          source_name: 'Athlete details',
          type: 'number',
          localised_unit: 'years',
        },
      ],
      isLoading: false,
    });
  });

  const props = {
    t: i18nextTranslateStub(),
    calculation: '',
    calculationParams: {},
    columnTitle: 'Test title',
    selectedMetric: '',
    onSetCalculation: jest.fn(),
    onSetCalculationParam: jest.fn(),
    onSetColumnTitle: jest.fn(),
    onSetMetrics: jest.fn(),
  };

  it('renders the MetricModule component', () => {
    render(<MetricModule {...props} />);

    expect(screen.getByLabelText('Metric Source')).toBeInTheDocument();
  });

  it('renders the Metric Source data options', async () => {
    const user = userEvent.setup();

    render(<MetricModule {...props} />);

    const metricSourceOptions = screen.getByLabelText('Metric Source');

    // clicks on the dropdown select
    await user.click(metricSourceOptions);

    expect(screen.getByText('Age (years)')).toBeVisible();
    expect(screen.getByText('Combination')).toBeVisible();
  });

  it('calls onSetMetrics when a data source is selected', async () => {
    const user = userEvent.setup();

    render(<MetricModule {...props} />);

    // clicks on the dropdown select
    await user.click(screen.getByLabelText('Metric Source'));
    // clicks on the metric
    await user.click(screen.getByText('Age (years)'));

    expect(props.onSetMetrics).toHaveBeenCalledTimes(1);
    expect(props.onSetMetrics).toHaveBeenCalledWith([
      { name: 'Age (years)', key_name: 'kitman:athlete|age_in_years' },
    ]);
  });

  it('populates the metric value from selectedMetric', () => {
    const updatedProps = {
      ...props,
      selectedMetric: 'kitman:athlete|age_in_years',
    };
    render(<MetricModule {...updatedProps} />);

    expect(screen.getByText('Age (years)')).toBeVisible();
  });

  it('renders the calculation module', () => {
    render(<MetricModule {...props} />);

    expect(screen.getByLabelText('Calculation')).toBeInTheDocument();
  });

  it('renders the column title field prefilled from props', () => {
    const updatedProps = {
      ...props,
      columnTitle: 'Test',
    };
    render(<MetricModule {...updatedProps} />);

    expect(screen.getByLabelText('Column Title')).toHaveValue('Test');
  });

  it('renders the empty title when columnTitle null', () => {
    const updatedProps = {
      ...props,
      columnTitle: null,
    };
    render(<MetricModule {...updatedProps} />);

    expect(screen.getByLabelText('Column Title')).toHaveValue('');
  });

  it('renders row title when panelType === row', () => {
    const updatedProps = {
      ...props,
      panelType: 'row',
    };
    render(<MetricModule {...updatedProps} />);

    expect(screen.getByLabelText('Row Title')).toHaveValue('Test title');
  });

  it('hides the column title field when hideColumnTitle is true', () => {
    const updatedProps = {
      ...props,
      hideColumnTitle: true,
    };
    render(<MetricModule {...updatedProps} />);

    expect(screen.queryByLabelText('Column Title')).not.toBeInTheDocument();
  });

  it('calls onSetColumnTitle when a new input is entered', async () => {
    const user = userEvent.setup();

    render(<MetricModule {...props} columnTitle="" />);

    // clicks and types column title
    await user.type(screen.getByLabelText('Column Title'), 'X');

    expect(props.onSetColumnTitle).toHaveBeenCalledTimes(1);
    expect(props.onSetColumnTitle).toHaveBeenCalledWith('X');
  });
});
