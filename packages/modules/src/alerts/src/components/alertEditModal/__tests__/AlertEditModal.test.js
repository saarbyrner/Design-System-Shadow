import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import alertsDummyData from '../../../../resources/alertDummyData';
import AlertEditModal from '../index';

// Mock data
const mockUsers = [
  { id: '1916', name: 'Jon Doe' },
  { id: '95239', name: 'Jon Doe 2' },
  { id: '38185', name: 'Jon Doe 3' },
];

const mockVariables = [
  { id: '4', name: 'Mood' },
  { id: '14', name: 'Enforced Rest' },
  { id: '15', name: 'Game' },
];

describe('<AlertEditModal />', () => {
  let user;
  let baseProps;
  let newAlert;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {};
    window.getFlag = (flag) => window.featureFlags[flag];
    window.setFlag = (flag, value) => {
      window.featureFlags[flag] = value;
    };

    const editAlert = { ...alertsDummyData[0] };

    newAlert = {
      id: null,
      name: '',
      alert_training_variables: [
        {
          condition: 'less_than',
          id: null,
          training_variable_id: null,
          value: null,
        },
      ],
      training_variable_ids: [],
      notification_recipient_ids: [],
      notification_message: '',
    };

    baseProps = {
      isOpen: true,
      close: jest.fn(),
      alert: editAlert,
      users: mockUsers,
      variables: mockVariables,
      selectAlertUsers: jest.fn(),
      selectAlertVariables: jest.fn(),
      onSaveEditAlert: jest.fn(),
      onSaveCreateAlert: jest.fn(),
      updateAlertName: jest.fn(),
      updateAlertMessage: jest.fn(),
      updateAlertVariables: jest.fn(),
      updateVariableCondition: jest.fn(),
      updateVariableUnit: jest.fn(),
      onAddNewVariable: jest.fn(),
      onDeleteVariable: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('displays the correct title when editing an alert', () => {
    render(<AlertEditModal {...baseProps} />);

    expect(
      screen.getByRole('heading', { name: 'Edit Alert' })
    ).toBeInTheDocument();
  });

  it('displays the correct title when adding an alert', () => {
    render(<AlertEditModal {...baseProps} alert={newAlert} />);

    expect(
      screen.getByRole('heading', { name: 'Add Alert' })
    ).toBeInTheDocument();
  });

  it('calls the correct callback when updating the alert name', async () => {
    render(<AlertEditModal {...baseProps} />);

    const nameInput = screen.getByLabelText('Alert Name');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(nameInput, { target: { value: 'new alert name' } });

    expect(baseProps.updateAlertName).toHaveBeenCalledWith('new alert name');
  });

  it('calls the correct callback when updating the alert message', async () => {
    render(<AlertEditModal {...baseProps} />);

    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(messageInput, { target: { value: '' } });
    fireEvent.change(messageInput, { target: { value: 'new alert message' } });

    expect(baseProps.updateAlertMessage).toHaveBeenCalledWith(
      'new alert message'
    );
  });

  it('calls the correct callback when selecting a user', async () => {
    render(<AlertEditModal {...baseProps} />);

    const usersDropdownLabel = screen.getByText('Send alert to');

    const clickableHeader = usersDropdownLabel.nextElementSibling;
    expect(clickableHeader).toBeInTheDocument();

    await user.click(clickableHeader);

    const optionToSelect = await screen.findByText('Jon Doe 2');

    await user.click(optionToSelect);

    expect(baseProps.selectAlertUsers).toHaveBeenCalledTimes(1);
    expect(baseProps.selectAlertUsers).toHaveBeenCalledWith({
      id: '95239',
      checked: true,
    });
  });

  it('calls the correct callback when selecting a variable (non-feature flag UI)', async () => {
    render(<AlertEditModal {...baseProps} />);

    // 1. Find the label associated with the dropdown.
    const variablesLabel = screen.getByText('Variables');

    // 2. The clickable header is the next sibling element in the DOM.
    const clickableHeader = variablesLabel.nextElementSibling;

    expect(clickableHeader).toBeInTheDocument();

    // 3. Click this specific header to open the dropdown.
    await user.click(clickableHeader);

    // 4. Now that the menu is open, find the option and click it.
    const optionToSelect = await screen.findByText('Game');

    await user.click(optionToSelect);

    expect(baseProps.selectAlertVariables).toHaveBeenCalledTimes(1);
    expect(baseProps.selectAlertVariables).toHaveBeenCalledWith({
      checked: false, // After clicking, the checkbox should be checked.
      id: '15',
    });
  });

  it('calls onSaveEditAlert when the save button is clicked in edit mode', async () => {
    render(<AlertEditModal {...baseProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(baseProps.onSaveEditAlert).toHaveBeenCalledTimes(1);
  });

  describe('[feature-flag] alerts-numeric-metric', () => {
    beforeEach(() => {
      window.setFlag('alerts-numeric-metric', true);
    });

    it('renders the correct number of variable rule fields', () => {
      render(<AlertEditModal {...baseProps} />);
      // Each rule has a "Variable" dropdown, so we can count those.

      expect(screen.getAllByText('Variable')).toHaveLength(
        baseProps.alert.alert_training_variables.length
      );
    });

    it('calls the correct action when changing a variable', async () => {
      render(<AlertEditModal {...baseProps} />);
      const variableDropdownLabel = screen.getAllByText('Variable')[0];

      const clickableHeader = variableDropdownLabel.nextElementSibling;

      // Open the dropdown by clicking the control element
      await user.click(clickableHeader);

      // Find and click the desired option
      const optionToSelect = await screen.getAllByText('Game')[0];
      expect(optionToSelect).toBeInTheDocument();
      await user.click(optionToSelect);

      // The callback receives the new value and the index of the rule
      expect(baseProps.updateAlertVariables).toHaveBeenCalledWith('15', 0);
    });

    it('calls the correct action when changing a variable condition', async () => {
      render(<AlertEditModal {...baseProps} />);

      const conditionDropdownLabel = screen.getAllByText('Condition')[0];

      const clickableHeader = conditionDropdownLabel.nextElementSibling;

      // Open the dropdown by clicking the control element
      await user.click(clickableHeader);

      // Find and click the desired option
      const optionToSelect = await screen.getAllByText('Greater Than')[0];

      await user.click(optionToSelect);

      expect(baseProps.updateVariableCondition).toHaveBeenCalledWith(
        'greater_than',
        0
      );
    });

    it('calls the correct action when changing a variable unit', async () => {
      render(<AlertEditModal {...baseProps} />);

      const unitInputField = screen.getByDisplayValue(/12/i);

      fireEvent.change(unitInputField, { target: { value: '' } });
      fireEvent.change(unitInputField, { target: { value: '111' } });

      expect(baseProps.updateVariableUnit).toHaveBeenCalledWith('111', 0);
    });

    it('calls the correct action when adding a new variable rule', async () => {
      render(<AlertEditModal {...baseProps} />);

      const addButton = screen.getByRole('button', {
        name: 'Add another rule',
      });

      await user.click(addButton);

      expect(baseProps.onAddNewVariable).toHaveBeenCalledTimes(1);
    });

    it('calls the correct action when removing a variable rule', async () => {
      render(<AlertEditModal {...baseProps} />);

      const deleteButton = screen.getAllByRole('button')[1];

      await user.click(deleteButton);

      expect(baseProps.onDeleteVariable).toHaveBeenCalledWith(0);
    });

    it('disables the delete button for the last remaining variable rule', () => {
      const alertWithOneVariable = {
        ...baseProps.alert,
        alert_training_variables: [baseProps.alert.alert_training_variables[0]],
      };

      render(<AlertEditModal {...baseProps} alert={alertWithOneVariable} />);

      const deleteButton = screen.getAllByRole('button')[1];

      expect(deleteButton).toBeDisabled();
    });
  });
});
