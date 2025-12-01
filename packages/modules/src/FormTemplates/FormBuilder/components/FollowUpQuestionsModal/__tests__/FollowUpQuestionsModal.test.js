import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { FollowUpQuestionsModalTranslated as FollowUpQuestionsModal } from '../index';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useFetchFormTemplateQuery: jest.fn(),
}));

describe('<FollowUpQuestionsModal />', () => {
  const mockOnClose = jest.fn();
  const mockOnCancel = jest.fn();
  const initialQuestionElement = {
    id: 'question1',
    element_type: INPUT_ELEMENTS.Text,
    config: {
      text: 'What is your name?',
      element_id: 'question_element_id',
    },
  };

  const translatedText = {
    addFollowUpQuestionsTitle: 'Add follow up questions',
    editChildFollowUpQuestionTitle: 'Edit follow up question',
    actions: {
      ctaButton: 'Save',
      cancelButton: 'Cancel',
    },
  };

  const props = {
    initialQuestionElement,
    isModalOpen: true,
    translatedText,
    onClose: mockOnClose,
    onCancel: mockOnCancel,
  };

  const renderComponent = (
    customProps = props,
    useGlobalStore = false,
    elementsState,
    conditionalElementsState = {}
  ) => {
    const { mockedStore } = renderWithRedux(
      <FollowUpQuestionsModal {...customProps} />,
      {
        useGlobalStore,
        preloadedState: {
          [REDUCER_KEY]: {
            ...initialState,
            elements: elementsState || {
              question_element_id_2: {
                id: '12345',
                element_type: INPUT_ELEMENTS.Text,
                config: {
                  text: '2. What is your name?',
                  element_id: 'question_element_id_2',
                },
              },
              question_element_id_3: {
                id: '78910',
                element_type: INPUT_ELEMENTS.Text,
                config: {
                  text: '3. What is your age?',
                  element_id: 'question_element_id_3',
                },
              },
            },
            conditionalElementsState: conditionalElementsState || {},
          },
        },
      }
    );

    return mockedStore;
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders the modal when open and displays correct title', () => {
    renderComponent();

    expect(screen.getByText('Add follow up questions')).toBeInTheDocument();
  });

  it('renders the modal when isEditChildFollowUpQuestionModalOpen is true and displays correct title', () => {
    renderComponent({ ...props, isEditChildFollowUpQuestionModalOpen: true });

    expect(screen.getByText('Edit follow up question')).toBeInTheDocument();
  });

  it('fires onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const cancelButton = screen.getByText('Cancel');

    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('fires onClose when close button is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    const closeButton = screen.getByText('Save');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('adds a follow-up question when "Add follow up question" is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    expect(screen.queryByText('If')).not.toBeInTheDocument();

    const addButton = screen.getByText('Add follow up question');
    await user.click(addButton);

    expect(screen.getByText('If')).toBeInTheDocument();
    expect(screen.getByLabelText('Answer')).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('removes a follow-up question when delete button is clicked', async () => {
    const user = userEvent.setup();

    renderComponent();

    // Add a follow-up question first
    const addButton = screen.getByText('Add follow up question');
    await user.click(addButton);

    expect(screen.getByText('If')).toBeInTheDocument();

    // Click the delete button of the first follow-up question
    const deleteButton = screen.getByLabelText('delete');
    await user.click(deleteButton);

    expect(screen.queryByText('If')).not.toBeInTheDocument();
  });

  it('dispatches updateFormElementById when Save button is clicked', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const addButton = screen.getByText('Add follow up question');
    await user.click(addButton);

    const saveButton = screen.getByText('Save');

    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: undefined,
        newConfig: {
          condition: {
            conditions: [],
            element_id: 'question_element_id',
            type: '==',
            value: '',
            value_type: '',
          },
        },
      },
      type: `${REDUCER_KEY}/updateFormElementById`,
    });
  });

  it('allows changing the operator and value in the condition row after adding a follow up question', async () => {
    const user = userEvent.setup();

    const mockedStore = renderComponent();

    const addButton = screen.getByText('Add follow up question');

    await user.click(addButton);

    // Change operator
    const operatorAutocomplete = screen.getByLabelText('Answer');

    expect(operatorAutocomplete).toBeInTheDocument();

    // Open menu and select "Not equals"
    await user.click(operatorAutocomplete);
    const notEqualsOption = await screen.findByText('Not equals');
    await user.click(notEqualsOption);

    expect(operatorAutocomplete).toHaveValue('Not equals');

    // Change condition value (label "Value")
    const valueInput = screen.getByLabelText('Value');

    await user.clear(valueInput);

    fireEvent.change(valueInput, { target: { value: '42' } });

    expect(valueInput).toHaveValue('42');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: undefined,
        newConfig: {
          condition: {
            conditions: [],
            element_id: 'question_element_id',
            type: '!=',
            value: '42',
            value_type: 'string',
          },
        },
      },
      type: `${REDUCER_KEY}/updateFormElementById`,
    });
  });

  it('allows selecting a destination question in the Show autocomplete after adding a follow up question', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const addButton = screen.getByText('Add follow up question');
    await user.click(addButton);

    // Find the destination autocomplete (label "Ask" in renderInput)
    const showAutocomplete = screen.getByLabelText('Ask');
    expect(showAutocomplete).toBeInTheDocument();

    // Simulate typing part of the destination question text
    fireEvent.change(showAutocomplete, {
      target: { value: '2. What is your name?' },
    });

    // Wait for an option to appear (adjust the text according to your mocks)
    const option = screen.getByRole('option', {
      name: /2\. what is your name\?/i,
    });

    await user.click(option);

    // Verify that the value of the autocomplete changed
    expect(showAutocomplete).toHaveValue('2. What is your name?');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: '12345',
        newConfig: {
          condition: {
            conditions: [],
            element_id: 'question_element_id',
            type: '==',
            value: '',
            value_type: '',
          },
        },
      },
      type: `${REDUCER_KEY}/updateFormElementById`,
    });
  });
});
