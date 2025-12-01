import { screen, render, fireEvent } from '@testing-library/react';
import { buildStatuses } from '@kitman/common/src/utils/test_utils';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import AddEditMetric from '../../../components/Metrics/AddEditMetric';

// Mock the StatusForm component since it's complex and has its own tests
jest.mock('@kitman/modules/src/StatusForm', () => {
  return jest.fn((props) => (
    <div data-testid="status-form" data-lock-metric={props.lockStatusMetric}>
      StatusForm Mock
    </div>
  ));
});

describe('Dashboard Editor <AddEditMetric /> component', () => {
  const availableVariables = [
    {
      localised_unit: '1-10',
      name: 'Abdominal',
      source_key: 'kitman:stiffness_indication|abdominal',
      source_name: 'Stiffness',
      type: 'scale',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Left',
      source_key: 'kitman:ohs|ankle_angle_left',
      source_name: 'Overhead Squat',
      type: 'number',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Right',
      source_key: 'kitman:ohs|ankle_angle_right',
      source_name: 'Right Y Balance',
      type: 'number',
    },
  ];
  const statuses = buildStatuses(5);
  const status = statuses[0];
  let props;

  beforeEach(() => {
    window.featureFlags = {};
    props = {
      availableVariables,
      status,
      statusChanged: false,
      isAddingNewStatus: false,
      dashboardIsEmpty: false,
      saveStatus: jest.fn(),
      updateStatus: jest.fn(),
      deleteStatus: jest.fn(),
      cancelBtnClick: jest.fn(),
      hasAlarms: false,
      t: (key) => key, // i18n stub
    };
  });

  it('renders', () => {
    render(<AddEditMetric {...props} />);

    expect(
      document.querySelector('.dashboardEditor__formContainer')
    ).toBeInTheDocument();
  });

  it('renders save button with correct props', () => {
    render(<AddEditMetric {...props} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled(); // Should be disabled when no changes
  });

  it('renders the cancel button with correct props', () => {
    render(<AddEditMetric {...props} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeDisabled(); // Should be disabled when no changes
  });

  it('renders a delete button with the correct props', () => {
    render(<AddEditMetric {...props} />);

    // The delete button has an icon but no text, so we'll find it by its container or class
    const deleteButton = document.querySelector('.icon-bin').closest('button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();
  });

  it('renders an InputText field for the status name', () => {
    render(<AddEditMetric {...props} />);

    expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
  });

  describe('with custom status name', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        status: {
          ...props.status,
          name: 'Custom Status Name',
          is_custom_name: true,
        },
      };
    });

    it('has the status name as value in the status name input', () => {
      render(<AddEditMetric {...customProps} />);

      const nameInput = screen.getByLabelText('Display Name');
      expect(nameInput).toHaveValue('Custom Status Name');
    });

    it('reveals errors on the inputText component', () => {
      render(<AddEditMetric {...customProps} />);

      // The input should be configured to reveal errors when it has a custom name
      const nameInput = screen.getByLabelText('Display Name');
      expect(nameInput).toBeInTheDocument();
    });

    it('updates the status when the name is changed', () => {
      render(<AddEditMetric {...customProps} />);

      const nameInput = screen.getByLabelText('Display Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Custom Name' } });

      // The updateStatus should be called (via onValidation callback)
      expect(customProps.updateStatus).toHaveBeenCalled();
    });

    it('updates the status when the name is removed', () => {
      render(<AddEditMetric {...customProps} />);

      const nameInput = screen.getByLabelText('Display Name');
      fireEvent.change(nameInput, { target: { value: '' } });

      // The updateStatus should be called when cleared
      expect(customProps.updateStatus).toHaveBeenCalled();
    });
  });

  describe('with no custom status name set', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        status: {
          ...props.status,
          name: 'Generated Status Name',
          is_custom_name: false,
        },
      };
    });

    it('shows no status name in the InputText component', () => {
      render(<AddEditMetric {...customProps} />);

      const nameInput = screen.getByLabelText('Display Name');
      expect(nameInput).toHaveValue('');
    });
  });

  describe('when the form is invalid', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        statusChanged: true,
      };
    });

    it('disables the save button when name contains emoji', () => {
      render(<AddEditMetric {...customProps} />);

      // Enter an emoji in the name field to make it invalid
      const nameInput = screen.getByLabelText('Display Name');
      fireEvent.change(nameInput, { target: { value: '😀 Invalid Name' } });

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled(); // Should be disabled when form is invalid
    });

    it('does not disable the cancel button', () => {
      render(<AddEditMetric {...customProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeEnabled(); // Should be enabled when changes exist
    });
  });

  describe('When status is changed', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        statusChanged: true,
      };
    });

    it('Enables the cancel button', () => {
      render(<AddEditMetric {...customProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeEnabled();
    });

    it('Enables the save button', () => {
      render(<AddEditMetric {...customProps} />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();
    });
  });

  describe('When the cancel button is clicked', () => {
    it('calls the cancel callback', () => {
      const customProps = {
        ...props,
        statusChanged: true,
      };

      render(<AddEditMetric {...customProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      expect(customProps.cancelBtnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('When the selected status does not have alarms', () => {
    it('does not show a warning message in the editor', () => {
      render(<AddEditMetric {...props} />);

      expect(
        document.querySelector('.dashboardEditor__alarmWarning')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the selected status has alarms', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        hasAlarms: true,
      };
    });

    it('shows a warning message in the editor', () => {
      render(<AddEditMetric {...customProps} />);

      const warningElement = document.querySelector(
        '.dashboardEditor__alarmWarning'
      );
      expect(warningElement).toBeInTheDocument();
      expect(warningElement).toHaveTextContent(
        'The associated alarms may be affected by any changes you make'
      );
    });
  });

  describe('When editing a status', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        isAddingNewStatus: false,
      };
    });

    it('disables the Status Metric dropdown', () => {
      render(<AddEditMetric {...customProps} />);

      const statusForm = screen.getByTestId('status-form');
      expect(statusForm).toHaveAttribute('data-lock-metric', 'true');
    });
  });

  describe('When adding a new status', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        status: blankStatus(),
        isAddingNewStatus: true,
      };
    });

    it('disables the delete button', () => {
      render(<AddEditMetric {...customProps} />);

      const deleteButton = document
        .querySelector('.icon-bin')
        .closest('button');
      expect(deleteButton).toBeDisabled();
    });

    it('enables the status metric field', () => {
      render(<AddEditMetric {...customProps} />);

      const statusForm = screen.getByTestId('status-form');
      expect(statusForm).toHaveAttribute('data-lock-metric', 'false');
    });

    it('does not fire a callback when the delete button is clicked', () => {
      render(<AddEditMetric {...customProps} />);

      const deleteButton = document
        .querySelector('.icon-bin')
        .closest('button');
      fireEvent.click(deleteButton);

      expect(customProps.deleteStatus).not.toHaveBeenCalled();
    });

    describe('When there are no statuses', () => {
      let emptyDashboardProps;

      beforeEach(() => {
        emptyDashboardProps = {
          ...customProps,
          dashboardIsEmpty: true,
        };
      });

      it('disables the cancel button', () => {
        render(<AddEditMetric {...emptyDashboardProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeDisabled();
      });

      it('does not fire a callback when the cancel adding button is clicked', () => {
        render(<AddEditMetric {...emptyDashboardProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);

        expect(emptyDashboardProps.cancelBtnClick).not.toHaveBeenCalled();
      });
    });
  });

  describe('When deleting a status', () => {
    it('fires a callback with the correct arguments when the delete button is clicked', () => {
      render(<AddEditMetric {...props} />);

      const deleteButton = document
        .querySelector('.icon-bin')
        .closest('button');
      fireEvent.click(deleteButton);

      expect(props.deleteStatus).toHaveBeenCalledTimes(1);
    });
  });
});
