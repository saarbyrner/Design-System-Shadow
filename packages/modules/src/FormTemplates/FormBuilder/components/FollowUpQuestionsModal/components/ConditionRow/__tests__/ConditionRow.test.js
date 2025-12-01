import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { ConditionRowTranslated as ConditionRow } from '../index';

describe('<ConditionRow />', () => {
  const mockSetFollowUpQuestionsModal = jest.fn();
  const condition = {
    type: '==',
    value: '',
  };

  const initialQuestion = {
    element_type: INPUT_ELEMENTS.Text,
  };

  const defaultProps = {
    condition,
    initialQuestion,
    index: 0,
    setFollowUpQuestionsModal: mockSetFollowUpQuestionsModal,
  };

  it('should render condition type selector and condition value field', () => {
    render(<ConditionRow {...defaultProps} />);

    expect(screen.getByLabelText('Answer')).toBeInTheDocument();

    expect(screen.getByLabelText('Value')).toBeInTheDocument();
  });

  it('should call setFollowUpQuestionsModal when condition type is changed', async () => {
    const user = userEvent.setup();

    render(<ConditionRow {...defaultProps} />);

    const conditionTypeSelect = screen.getByLabelText('Answer');

    selectEvent.openMenu(conditionTypeSelect);
    await user.click(screen.getByText('Not equals'));

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalled();
  });

  it('should call setFollowUpQuestionsModal when condition value is changed (Text)', async () => {
    const user = userEvent.setup();

    render(<ConditionRow {...defaultProps} />);

    const valueInput = screen.getByLabelText('Value');

    // Change the condition value
    await user.type(valueInput, 'New Value');

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalled();
  });

  it('should render a boolean select input when element type is "Boolean"', () => {
    const booleanProps = {
      ...defaultProps,
      initialQuestion: {
        element_type: INPUT_ELEMENTS.Boolean,
      },
      condition: {
        value: false,
      },
    };

    render(<ConditionRow {...booleanProps} />);

    expect(screen.getByLabelText('Answer')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /no/i,
      })
    ).toBeInTheDocument();

    selectEvent.openMenu(
      screen.getByRole('button', {
        name: /no/i,
      })
    );

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.queryAllByText('No')).toHaveLength(2);
  });

  it('should render an autocomplete input when element type is "SingleChoice"', () => {
    const singleChoiceProps = {
      ...defaultProps,
      initialQuestion: {
        element_type: INPUT_ELEMENTS.SingleChoice,
        config: {
          items: [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ],
        },
      },
    };

    render(<ConditionRow {...singleChoiceProps} />);

    // Check for condition type dropdown
    expect(screen.getByLabelText('Answer')).toBeInTheDocument();

    // Check for the single-choice autocomplete input
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Value'));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should call setFollowUpQuestionsModal when condition value is changed (Boolean)', async () => {
    const user = userEvent.setup();

    const booleanProps = {
      ...defaultProps,
      initialQuestion: {
        element_type: INPUT_ELEMENTS.Boolean,
      },
      condition: {
        value: false,
      },
    };

    render(<ConditionRow {...booleanProps} />);

    expect(screen.getByLabelText('Answer')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /no/i,
      })
    ).toBeInTheDocument();

    selectEvent.openMenu(
      screen.getByRole('button', {
        name: /no/i,
      })
    );

    await user.click(screen.getByText('Yes'));

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalled();
  });

  it('should render the correct input for "MultipleChoice" element type', () => {
    const multipleChoiceProps = {
      ...defaultProps,
      initialQuestion: {
        element_type: INPUT_ELEMENTS.MultipleChoice,
        config: {
          items: [
            { value: 'A', label: 'Choice A' },
            { value: 'B', label: 'Choice B' },
          ],
        },
      },
    };

    render(<ConditionRow {...multipleChoiceProps} />);

    expect(screen.getByLabelText('Answer')).toBeInTheDocument();

    // Check for the single-choice autocomplete input
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Value'));

    expect(screen.getByText('Choice A')).toBeInTheDocument();
    expect(screen.getByText('Choice B')).toBeInTheDocument();
  });
});
