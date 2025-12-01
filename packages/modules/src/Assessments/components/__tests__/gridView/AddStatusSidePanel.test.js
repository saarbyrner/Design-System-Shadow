import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCalculationsByType } from '@kitman/common/src/utils/status_utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  defaultPermissions,
} from '../../../contexts/PermissionsContext';
import AddStatusSidePanel from '../../gridView/AddStatusSidePanel';

describe('AddStatusSidePanel component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      statusVariables: [
        {
          source_key: 'statsports|total_distance',
          name: 'Total distance',
          type: 'number',
        },
        {
          source_key: 'statsports|slope_percent',
          name: 'Slope percent',
          type: 'number',
        },
      ],
      onSave: jest.fn(),
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders correctly with the calculation field disabled', () => {
    render(<AddStatusSidePanel {...baseProps} />);

    expect(screen.getByText(/add status/i)).toBeInTheDocument();

    const calculationLabel = screen.getByText(/calculation/i);
    const calculationContainer = calculationLabel.closest('.customDropdown');
    const calculationButton = within(calculationContainer).getByRole('button');
    expect(calculationButton).toBeDisabled();
  });

  it('enables and populates the calculation dropdown after a metric is selected', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...baseProps} />);

    // Helper to robustly find dropdown buttons
    const getDropdownButtonByLabel = (label) => {
      const labelElement = screen.getByText(label);
      const container = labelElement.closest(
        '.customDropdown, .groupedDropdown'
      );
      return within(container).getByRole('button');
    };

    // 1. Select a Data Source
    const metricSelectorButton = getDropdownButtonByLabel(/data source/i);
    await user.click(metricSelectorButton);
    await user.click(await screen.findByText('Total distance'));

    // 2. Find the container and button for the "Calculation" dropdown
    const calculationContainer = screen
      .getByText(/calculation/i)
      .closest('.customDropdown');
    const calculationButton = within(calculationContainer).getByRole('button');
    expect(calculationButton).toBeEnabled();

    // 3. Open the calculation dropdown
    await user.click(calculationButton);

    // 4. FIX: Find the list *within* the specific calculation container
    const calculationMenu = await within(calculationContainer).findByRole(
      'list'
    );
    const expectedCalculations = getCalculationsByType(
      'simple_and_last'
    )?.filter((calc) => calc?.name);

    // 5. Verify its options
    expectedCalculations.forEach((calc) => {
      expect(within(calculationMenu).getByText(calc.name)).toBeInTheDocument();
    });
  });

  it('calls onSave and onClose with the correct data when form is submitted', async () => {
    const user = userEvent.setup();
    render(<AddStatusSidePanel {...baseProps} />);

    // --- Fill out the form ---
    const metricLabel = screen.getByText(/data source/i);
    const metricContainer = metricLabel.closest('.groupedDropdown');
    await user.click(within(metricContainer).getByRole('button'));
    await user.click(await screen.findByText('Total distance'));

    const calculationLabel = screen.getByText(/calculation/i);
    const calculationContainer = calculationLabel.closest('.customDropdown');
    await user.click(within(calculationContainer).getByRole('button'));
    await user.click(await screen.findByText('Sum'));

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '5' },
    });

    await user.click(screen.getByRole('button', { name: /save/i }));

    // --- Assert on the callbacks ---
    expect(baseProps.onSave).toHaveBeenCalledTimes(1);
    expect(baseProps.onSave).toHaveBeenCalledWith({
      item_type: 'AssessmentStatus',
      item_attributes: {
        source: 'statsports',
        variable: 'total_distance',
        summary: 'sum',
        period_scope: 'last_x_days',
        period_length: 5,
        notes: [],
      },
    });

    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  describe('Permissions', () => {
    it('disables form fields if user lacks createAssessment permission', () => {
      render(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, createAssessment: false }}
        >
          <AddStatusSidePanel {...baseProps} />
        </PermissionsContext.Provider>
      );

      const metricLabel = screen.getByText(/data source/i);
      const metricContainer = metricLabel.closest('.groupedDropdown');
      expect(within(metricContainer).getByRole('button')).toBeDisabled();

      const calculationLabel = screen.getByText(/calculation/i);
      const calculationContainer = calculationLabel.closest('.customDropdown');
      expect(within(calculationContainer).getByRole('button')).toBeDisabled();
    });
  });
});
