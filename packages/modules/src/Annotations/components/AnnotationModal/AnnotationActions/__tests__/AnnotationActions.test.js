import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  annotation,
  assigneeOptions,
} from '../../resources/AnnotationDummyData';
import AnnotationActions from '../index';

jest.mock('@kitman/components', () => {
  const actualMoment = jest.requireActual('moment-timezone');
  return {
    ActionCheckbox: jest.fn((props) => (
      <div data-testid="mock-action-checkbox" onClick={props.onToggle} aria-checked={props.isChecked} role="checkbox" tabIndex="0">
        {props.id}
      </div>
    )),
    DatePicker: jest.fn((props) => {
      return (
        <input
          data-testid="mock-date-picker"
          value={props.value || ''}
          onChange={(e) => {
            const dateValue = e.target.value ? actualMoment(e.target.value) : null;
            props.onDateChange(dateValue);
          }}
        />
      );
    }),
    IconButton: jest.fn((props) => (
      <button data-testid="mock-icon-button" onClick={props.onClick} type="button">{props.icon}</button>
    )),
    MultiSelectDropdown: jest.fn((props) => (
      <div data-testid="mock-multi-select-dropdown">
        <label>{props.label}</label>
        <div data-testid="mock-multi-select-dropdown-header">
          {props.selectedItems.length > 0 ? props.listItems.find(item => item.id === props.selectedItems[0])?.name : ''}
        </div>
        {props.listItems.map((item) => (
          <button
            key={item.id}
            data-testid={`mock-multi-select-dropdown-option-${item.id}`}
            onClick={() => props.onItemSelect({ id: item.id, checked: true })}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>
    )),
    Textarea: jest.fn((props) => (
      <textarea data-testid="mock-textarea" value={props.value} onChange={(e) => props.onChange(e.target.value, 0)} />
    )),
    TextButton: jest.fn((props) => (
      <button data-testid="mock-text-button" onClick={props.onClick} type="button">{props.text}</button>
    )),
  };
});

setI18n(i18n);

const annotationData = {
  ...annotation(),
};

const defaultProps = {
  actions: annotationData.annotation_actions,
  onUpdateActionText: jest.fn(),
  onUpdateAssignee: jest.fn(),
  onAddAction: jest.fn(),
  onRemoveAction: jest.fn(),
  onUpdateActionDueDate: jest.fn(),
  users: assigneeOptions(),
  t: i18nextTranslateStub(),
};

const renderWithState = (initialActions, props) => {
  const Wrapper = () => {
    const [actions, setActions] = React.useState(initialActions);

    const handleUpdateActionText = (newContent, index) => {
      const newActions = [...actions];
      newActions[index] = { ...newActions[index], content: newContent };
      setActions(newActions);
      props.onUpdateActionText(newContent, index);
    };

    const handleUpdateAssignee = (selectionId, index) => {
      const newActions = [...actions];
      newActions[index] = { ...newActions[index], user_ids: [selectionId] }; // Assuming single selection for simplicity
      setActions(newActions);
      props.onUpdateAssignee(selectionId, index);
    };

    const handleAddAction = () => {
      const newActions = [...actions, { id: Date.now(), content: '', user_ids: [], completed: false, due_date: null }];
      setActions(newActions);
      props.onAddAction();
    };

    const handleRemoveAction = (index) => {
      const newActions = actions.filter((_, i) => i !== index);
      setActions(newActions);
      props.onRemoveAction(index);
    };

    const handleUpdateActionDueDate = (selectedDate, index) => {
      const newActions = [...actions];
      newActions[index] = { ...newActions[index], due_date: selectedDate };
      setActions(newActions);
      props.onUpdateActionDueDate(selectedDate, index);
    };

    return (
      <AnnotationActions
        {...props}
        actions={actions}
        onUpdateActionText={handleUpdateActionText}
        onUpdateAssignee={handleUpdateAssignee}
        onAddAction={handleAddAction}
        onRemoveAction={handleRemoveAction}
        onUpdateActionDueDate={handleUpdateActionDueDate}
      />
    );
  };
  return render(<Wrapper />);
};


describe('<AnnotationActions />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    defaultProps.onUpdateActionText.mockClear();
    defaultProps.onUpdateAssignee.mockClear();
    defaultProps.onAddAction.mockClear();
    defaultProps.onRemoveAction.mockClear();
    defaultProps.onUpdateActionDueDate.mockClear();
  });

  test('renders', () => {
    renderWithState(defaultProps.actions, defaultProps);
    expect(screen.getByTestId('annotation-actions')).toBeInTheDocument();
  });

  test('renders the correct number of actions', () => {
    renderWithState(defaultProps.actions, defaultProps);
    const actionElements = screen.getAllByTestId('annotation-action');
    expect(actionElements).toHaveLength(defaultProps.actions.length);
  });

  test('calls the correct callback when setting action text', async () => {
    const user = userEvent.setup();
    renderWithState(defaultProps.actions, defaultProps);
    const textarea = screen.getAllByDisplayValue('My action 223')[0];
    const newText = 'This is new action text';
    await user.clear(textarea);
    await user.type(textarea, newText);
    expect(defaultProps.onUpdateActionText).toHaveBeenLastCalledWith(newText, 0);
  });

    test('sets the correct Dropdown value when an action has a user set to none', () => {
      renderWithState(defaultProps.actions, defaultProps);
      const dropdownHeader = within(screen.getAllByTestId('mock-multi-select-dropdown')[0]).getByTestId('mock-multi-select-dropdown-header');
      expect(dropdownHeader).toHaveTextContent('');
    });

  test('calls the correct callback when setting action assignee', async () => {
    renderWithState(defaultProps.actions, defaultProps);

    const firstAction = screen.getAllByTestId('annotation-action')[0];
    const assigneeToSelect = defaultProps.users[0];
    const selectOptionButton = within(firstAction).getByTestId(`mock-multi-select-dropdown-option-${assigneeToSelect.id}`);
    await userEvent.click(selectOptionButton);

    await waitFor(() => {
      expect(defaultProps.onUpdateAssignee).toHaveBeenCalledWith(assigneeToSelect.id, 0);
    });
  });

  test('calls the correct callback when adding an action', async () => {
    const user = userEvent.setup();
    renderWithState(defaultProps.actions, defaultProps);
    const addButton = screen.getByTestId('mock-text-button');
    await user.click(addButton);
    expect(defaultProps.onAddAction).toHaveBeenCalledTimes(1);
  });

  test('calls the correct callback when deleting an action', async () => {
    const user = userEvent.setup();
    renderWithState(defaultProps.actions, defaultProps);
    const removeButtons = screen.getAllByTestId('mock-icon-button');
    await user.click(removeButtons[0]);
    expect(defaultProps.onRemoveAction).toHaveBeenCalledWith(0);
  });

  describe('when the mls-emr-action-due-date feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['mls-emr-action-due-date'] = true;
      moment.tz.setDefault('UTC');
    });

    afterEach(() => {
      window.featureFlags['mls-emr-action-due-date'] = false;
      moment.tz.setDefault();
    });

    test('sets the correct DatePicker values', () => {
      renderWithState(defaultProps.actions, defaultProps);
      const datePickers = screen.getAllByTestId('mock-date-picker');
      expect(datePickers[0]).toHaveValue('2019-06-25T23:00:00+00:00');
      expect(datePickers[1]).toHaveValue('');
    });

    test('calls the correct callback when changing the due date', async () => {
      renderWithState(defaultProps.actions, defaultProps);
      const datePickers = screen.getAllByTestId('mock-date-picker');
      const firstDatePicker = datePickers[0];

      fireEvent.change(firstDatePicker, { target: { value: '' } });
      await waitFor(() => {
        expect(defaultProps.onUpdateActionDueDate).toHaveBeenCalledWith(null, 0);
      });
      defaultProps.onUpdateActionDueDate.mockClear();

      const newDate = '2019-07-30T23:00:00+00:00';
      fireEvent.change(firstDatePicker, { target: { value: newDate } });
      expect(defaultProps.onUpdateActionDueDate).toHaveBeenCalledWith(newDate, 0);
    });
  });
});
