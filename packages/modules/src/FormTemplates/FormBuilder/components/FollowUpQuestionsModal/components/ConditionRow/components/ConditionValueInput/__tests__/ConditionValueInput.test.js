import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { ConditionValueInputTranslated as ConditionValueInput } from '../index';

describe('ConditionValueInput', () => {
  const mockSetFollowUpQuestionsModal = jest.fn();

  const defaultProps = {
    condition: { value: '' },
    subIndex: 0,
    setFollowUpQuestionsModal: mockSetFollowUpQuestionsModal,
    elementType: INPUT_ELEMENTS.Text,
    index: 0,
    initialQuestion: {
      config: {
        items: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a text input for Text type', () => {
    render(
      <ConditionValueInput
        {...defaultProps}
        elementType={INPUT_ELEMENTS.Text}
      />
    );

    const input = screen.getByLabelText('Value');

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Test Value' } });

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalledWith(
      expect.any(Function)
    );

    // Verify state update
    const updateFunction = mockSetFollowUpQuestionsModal.mock.calls[0][0];
    const prevState = [{ condition: { conditions: [{ value: '' }] } }];
    const updatedState = updateFunction(prevState);

    expect(updatedState[0].condition.conditions[0].value).toBe('Test Value');
  });

  it('renders a boolean select for Boolean type', async () => {
    const user = userEvent.setup();

    render(
      <ConditionValueInput
        {...defaultProps}
        elementType={INPUT_ELEMENTS.Boolean}
        condition={{ value: false }}
      />
    );

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

    await user.click(screen.getByText('Yes'));

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalledWith(
      expect.any(Function)
    );

    const updateFunction = mockSetFollowUpQuestionsModal.mock.calls[0][0];
    const prevState = [{ condition: { conditions: [{ value: false }] } }];
    const updatedState = updateFunction(prevState);

    expect(updatedState[0].condition.conditions[0].value).toBe(true);
  });

  it('renders an autocomplete for SingleChoice type', () => {
    render(
      <ConditionValueInput
        {...defaultProps}
        elementType={INPUT_ELEMENTS.SingleChoice}
      />
    );
    const autocompleteInput = screen.getByLabelText('Value');

    expect(autocompleteInput).toBeInTheDocument();

    fireEvent.mouseDown(autocompleteInput);
    fireEvent.click(screen.getByText('Option 1'));

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalledWith(
      expect.any(Function)
    );

    const updateFunction = mockSetFollowUpQuestionsModal.mock.calls[0][0];
    const prevState = [{ condition: { conditions: [{ value: '' }] } }];
    const updatedState = updateFunction(prevState);

    expect(updatedState[0].condition.conditions[0].value).toBe('1');
  });

  it('renders a text input for Number type', () => {
    render(
      <ConditionValueInput
        {...defaultProps}
        elementType={INPUT_ELEMENTS.Number}
      />
    );
    const input = screen.getByLabelText('Value');

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '123' } });

    expect(mockSetFollowUpQuestionsModal).toHaveBeenCalledWith(
      expect.any(Function)
    );

    const updateFunction = mockSetFollowUpQuestionsModal.mock.calls[0][0];
    const prevState = [{ condition: { conditions: [{ value: '' }] } }];
    const updatedState = updateFunction(prevState);

    expect(updatedState[0].condition.conditions[0].value).toBe('123');
  });

  it('renders nothing for unsupported elementType', () => {
    render(<ConditionValueInput {...defaultProps} elementType={null} />);
    expect(screen.queryByLabelText('Value')).not.toBeInTheDocument();
  });
});
