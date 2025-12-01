import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  defaultPermissions,
} from '@kitman/modules/src/Assessments/contexts/PermissionsContext';
import AddMetricSidePanel from '../../gridView/AddMetricSidePanel';

describe('<AddMetricSidePanel />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      organisationTrainingVariables: [
        { id: 10, training_variable: { id: 1, name: 'Mood' } },
        { id: 11, training_variable: { id: 2, name: 'Fatigue' } },
        { id: 12, training_variable: { id: 3, name: 'Sleep duration' } },
      ],
      onSave: jest.fn(),
      onClose: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders correctly and populates the dropdown with metrics', async () => {
    const user = userEvent.setup();
    render(<AddMetricSidePanel {...baseProps} />);

    expect(screen.getByText('Add metric')).toBeInTheDocument();

    const metricLabel = screen.getByText('Metric');
    const dropdownContainer = metricLabel.closest('.customDropdown');
    const metricDropdown = within(dropdownContainer).getByRole('button');

    expect(metricDropdown).toBeEnabled();

    await user.click(metricDropdown);
    expect(await screen.findByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Fatigue')).toBeInTheDocument();
    expect(screen.getByText('Sleep duration')).toBeInTheDocument();
  });

  it('disables the dropdown and shows a warning when no variables are available', () => {
    render(
      <AddMetricSidePanel {...baseProps} organisationTrainingVariables={[]} />
    );

    const metricLabel = screen.getByText('Metric');
    const dropdownContainer = metricLabel.closest('.customDropdown');
    expect(within(dropdownContainer).getByRole('button')).toBeDisabled();

    expect(
      screen.getByText('All metrics are currently in use')
    ).toBeInTheDocument();
  });

  it('disables the dropdown if the user lacks create permission', () => {
    render(
      <PermissionsContext.Provider
        value={{ ...defaultPermissions, createAssessment: false }}
      >
        <AddMetricSidePanel {...baseProps} />
      </PermissionsContext.Provider>
    );

    const metricLabel = screen.getByText('Metric');
    const dropdownContainer = metricLabel.closest('.customDropdown');
    expect(within(dropdownContainer).getByRole('button')).toBeDisabled();
  });

  describe('when clicking the save button', () => {
    it('does not call onSave if no metric has been selected', async () => {
      const user = userEvent.setup();
      render(<AddMetricSidePanel {...baseProps} />);

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(baseProps.onSave).not.toHaveBeenCalled();
    });

    it('calls onSave and onClose with the correct item when a metric is selected', async () => {
      const user = userEvent.setup();
      render(<AddMetricSidePanel {...baseProps} />);

      const metricLabel = screen.getByText('Metric');
      const dropdownContainer = metricLabel.closest('.customDropdown');
      const metricDropdown = within(dropdownContainer).getByRole('button');
      await user.click(metricDropdown);
      await user.click(await screen.findByText('Mood'));

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(baseProps.onSave).toHaveBeenCalledTimes(1);
      expect(baseProps.onSave).toHaveBeenCalledWith({
        item_type: 'AssessmentMetric',
        item_attributes: {
          training_variable_id: 1,
          answers: [],
        },
      });
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
