import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import AddStatusSidePanel from '../AddStatusSidePanel';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<AddStatusSidePanel />', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const props = {
    isOpen: true,
    event: {
      id: 1,
    },
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
    onSave: mockOnSave,
    onClose: mockOnClose,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  it('renders correctly when open', () => {
    render(<AddStatusSidePanel {...props} />);

    expect(screen.getByText('Column')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('populates MetricSelector with the correct options', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...props} />);
    const metricDropdownButton = screen.getByTestId(
      'GroupedDropdown|TriggerButton'
    );

    await user.click(metricDropdownButton);
    await waitFor(() => {
      expect(screen.getByText('Total distance')).toBeInTheDocument();
    });
    expect(screen.getByText('Slope percent')).toBeInTheDocument();
  });

  it('disables the calculation field', () => {
    render(<AddStatusSidePanel {...props} />);

    expect(
      document.querySelector('.customDropdown--disabled')
    ).toBeInTheDocument();
  });

  it('enables calculation dropdown when metric is selected', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...props} />);

    const metricDropdownButton = screen.getByTestId(
      'GroupedDropdown|TriggerButton'
    );

    await user.click(metricDropdownButton);
    await waitFor(() => {
      expect(screen.getByText('Total distance')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Total distance'));

    // The calculation dropdown should now be enabled
    expect(
      document.querySelector('.customDropdown--disabled')
    ).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...props} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls props.onSave with the correct item', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...props} />);

    const metricDropdownButton = screen.getByTestId(
      'GroupedDropdown|TriggerButton'
    );

    await user.click(metricDropdownButton);
    await user.click(screen.getByText('Total distance'));

    const calculationDropdownContainer = document.querySelector(
      '.planningEventStatusSidePanel__calculation'
    );
    const calculationDropdownButton =
      calculationDropdownContainer.querySelector('#dropdownMenu1');

    await user.click(calculationDropdownButton);
    await user.click(screen.getByText('Sum'));

    const periodScopeDropdownContainer = document.querySelector(
      '.planningEventStatusSidePanel__periodSelector'
    );
    const periodScopeDropdownButton =
      periodScopeDropdownContainer.querySelector('#dropdownMenu1');
    await user.click(periodScopeDropdownButton);

    // Click on the "Last (x) Period" option
    const lastXPeriodOption = screen.getByText('Last (x) Period');
    await user.click(lastXPeriodOption);

    // For the period length input (number input)
    const periodLengthInput = screen.getByRole('spinbutton');
    fireEvent.change(periodLengthInput, { target: { value: '5' } });

    // Click Save Button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() => {
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
          period_length: 5,
          period_scope: 'last_x_days',
        },
      });
    });
  });
});
