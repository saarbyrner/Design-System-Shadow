import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AssessmentsColumnsPanel from '../AssessmentsColumnsPanel';

describe('<AssessmentsColumnsPanel />', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const props = {
    isOpen: true,
    statusVariables: [
      {
        source_key: 'statsports|total_distance',
        name: 'Total distance',
        source_name: 'Training Variable',
        type: 'number',
        localised_unit: '',
      },
      {
        source_key: 'statsports|slope_percent',
        name: 'Slope percent',
        source_name: 'Training Variable',
        type: 'number',
        localised_unit: '',
      },
    ],
    organisationTrainingVariables: [],
    onSave: mockOnSave,
    onClose: mockOnClose,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<AssessmentsColumnsPanel {...props} />);

    expect(screen.getByText('Columns')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('populates the Select with the correct options', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);
    await user.click(screen.getByLabelText('Metric'));

    expect(screen.getByText('Total distance')).toBeInTheDocument();
    expect(screen.getByText('Slope percent')).toBeInTheDocument();
  });

  it('shows radio buttons for column type selection', () => {
    render(<AssessmentsColumnsPanel {...props} />);

    // Check that the radio buttons for column type are present
    expect(screen.getByText('Calculated')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
  });

  it('disables the calculation field', () => {
    render(<AssessmentsColumnsPanel {...props} />);

    // The calculation dropdown should be disabled initially
    const calculationDropdown = screen.getByLabelText('Calculation');
    expect(calculationDropdown).toBeDisabled();
  });

  it('enables calculation dropdown when metric is selected', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);

    // Select a metric from the dropdown
    const metricSelect = screen.getByLabelText('Metric');
    await user.click(metricSelect);
    await user.click(screen.getByText('Total distance'));

    // The calculation dropdown should now be enabled
    const calculationDropdown = screen.getByLabelText('Calculation');
    expect(calculationDropdown).toBeEnabled();
  });

  it('shows period selector when status column type is selected', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);

    // Select a metric to enable the period selector
    const metricSelect = screen.getByLabelText('Metric');
    await user.click(metricSelect);
    await user.click(screen.getByText('Total distance'));

    // The LastXDaysSelector should be visible
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Weeks')).toBeInTheDocument();
  });

  it('hides period selector when input column type is selected', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);

    // Switch to "Input" column type
    const inputRadio = screen.getByText('Input');
    await user.click(inputRadio);

    // The period selector should not be visible for input type
    expect(screen.queryByText('Days')).not.toBeInTheDocument();
    expect(screen.queryByText('Weeks')).not.toBeInTheDocument();
  });

  it('calls props.onSave with the correct item', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);

    // Select metric
    const metricSelect = screen.getByLabelText('Metric');
    await user.click(metricSelect);
    await user.click(screen.getByText('Total distance'));

    // Select calculation
    const calculationDropdown = screen.getByLabelText('Calculation');
    await user.click(calculationDropdown);
    await user.click(screen.getByText('Sum'));

    await user.click(screen.getByText('Days'));

    // Click Save Button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      columnType: 'status',
      columnName: 'total_distance',
      planningStatusDefinition: {
        variables: [
          {
            source: 'statsports',
            variable: 'total_distance',
          },
        ],
        summary: 'sum',
        period_length: '',
        period_scope: 'last_x_days',
      },
    });
  });

  it('calls props.onClose', async () => {
    const user = userEvent.setup();
    render(<AssessmentsColumnsPanel {...props} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
