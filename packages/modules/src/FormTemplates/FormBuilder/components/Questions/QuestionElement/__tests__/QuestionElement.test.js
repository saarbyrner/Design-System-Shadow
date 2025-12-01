import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@kitman/playbook/providers';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  initialState,
  customState,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { useGetQuestionBanksQuery } from '@kitman/services/src/services/formTemplates';
import { QuestionElementTranslated as QuestionElement } from '../index';

jest.mock(
  '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useDebounceField',
  () => ({
    useDebounceField: ({ initialValue, onUpdate }) => ({
      value: initialValue,
      onChange: (e) => {
        onUpdate(e.target.value);
      },
    }),
  })
);

jest.mock('@kitman/services/src/services/formTemplates', () => {
  const actual = jest.requireActual('@kitman/services/src/services/formTemplates');
  return {
    ...actual,
    useGetQuestionBanksQuery: jest.fn(),
  };
});

describe('<QuestionElement />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: '',
      config: { optional: false },
    },
    questionIndex,
  };

  beforeEach(() => {
    useGetQuestionBanksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: false,
    });
  });

  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <ThemeProvider>
        <QuestionElement {...customProps} />,
      </ThemeProvider>,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...state },
        },
      }
    );

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Mandatory')).toBeInTheDocument();
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    expect(screen.getByLabelText('Question')).toBeInTheDocument();
    expect(screen.getByLabelText('Question style')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
  });

  it('should call the correct action when deleting a question', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const deleteButton = screen.getByTestId('DeleteIcon');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: questionIndex,
      type: `${REDUCER_KEY}/deleteQuestionFromCurrentMenuItem`,
    });
  });

  it('should call the correct action when toggling mandatory switch', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const mandatoryToggle = screen.getByRole('checkbox', {
      name: /mandatory/i,
    });

    expect(mandatoryToggle).toBeInTheDocument();

    await user.click(mandatoryToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          optional: true,
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should call the correct action when updating question description', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const description = screen.getByRole('textbox', {
      name: /description/i,
    });

    expect(description).toBeInTheDocument();

    await user.type(description, 'some description');

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: `${REDUCER_KEY}/updateQuestion`,
        payload: expect.objectContaining({ field: 'config', questionIndex: 0 }),
      })
    );
  });

  it('should call the correct action when updating question description if question is inside a Group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...props,
      isChildOfGroup: true,
      groupIndex: 1,
    });
    const description = screen.getByRole('textbox', {
      name: /description/i,
    });

    expect(description).toBeInTheDocument();

    await user.type(description, 'some description');

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
        payload: expect.objectContaining({
          field: 'config',
          questionIndex: 0,
          groupIndex: 1,
        }),
      })
    );
  });

  it('should call the correct action when toggling mandatory switch if question is inside a Group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...props,
      isChildOfGroup: true,
      groupIndex: 1,
    });
    const mandatoryToggle = screen.getByRole('checkbox', {
      name: /mandatory/i,
    });

    expect(mandatoryToggle).toBeInTheDocument();

    await user.click(mandatoryToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          optional: true,
        },
        groupIndex: 1,
      },
      type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
    });
  });

  it('should call the correct action when deleting a question inside a Group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...props,
      isChildOfGroup: true,
      groupIndex: 1,
    });
    const deleteButton = screen.getByTestId('DeleteIcon');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: { questionIndex, groupIndex: 1 },
      type: `${REDUCER_KEY}/deleteQuestionFromCurrentGroupLayoutElement`,
    });
  });

  it('does not render question bank select if the question type is Attachment', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.Attachment,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.queryByLabelText('Question')).not.toBeInTheDocument();
  });

  it('does not render question bank select if the question type is Text', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.Text,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.queryByLabelText('Question')).not.toBeInTheDocument();
  });

  it('does not render question bank select if the question type is DateTime', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.DateTime,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.queryByLabelText('Question')).not.toBeInTheDocument();
  });

  it('renders question bank select if the question type is MultipleChoice', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.MultipleChoice,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps, customState);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
  });

  it('renders question bank select if the question type is SingleChoice', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.SingleChoice,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps, customState);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
  });

  it('renders question bank select if the question type is Number', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.Number,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit')).toBeInTheDocument();
  });

  it('renders question bank select if the question type is Boolean', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.Boolean,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
  });

  it('renders question bank select if the question type is Range', async () => {
    const customProps = {
      questionElement: {
        element_type: INPUT_ELEMENTS.Range,
        config: { optional: false },
      },
      questionIndex,
    };
    renderComponent(customProps);

    expect(
      screen.getByRole('textbox', {
        name: /description/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Question')).toBeInTheDocument();
  });

  it('should render edit condition element when element is conditional', async () => {
    renderComponent(
      {
        ...props,
        questionElement: {
          ...props.questionElement,
          config: {
            ...props.questionElement.config,
            condition: {
              element_id: 'initial_parent_question_id',
              type: '==',
              value_type: 'string',
              value: 'yes',
              conditions: [],
            },
          },
        },
      },
      {
        ...initialState,
        elements: {
          initial_parent_question_id: {
            id: 1,
            config: { text: 'Did you have breakfast?' },
          },
        },
      }
    );

    expect(
      screen.getByText(/initial question: did you have breakfast\?/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
  });

  it('should render auto-populate toggle when global autopopulate is enabled', () => {
    const stateWithAutopopulate = {
      ...initialState,
      structure: {
        ...initialState.structure,
        config: {
          settings: {
            autopopulate_from_previous_answerset: true,
          },
        },
      },
    };

    renderComponent(props, stateWithAutopopulate);

    expect(screen.getByLabelText('Auto-populate')).toBeInTheDocument();
  });

  it('should not render auto-populate toggle when global autopopulate is disabled', () => {
    renderComponent();

    expect(screen.queryByLabelText('Auto-populate')).not.toBeInTheDocument();
  });

  it('should not render auto-populate toggle when question is conditional (follow-up)', () => {
    const stateWithAutopopulate = {
      ...initialState,
      structure: {
        ...initialState.structure,
        config: {
          settings: {
            autopopulate_from_previous_answerset: true,
          },
        },
      },
    };

    renderComponent(
      {
        ...props,
        questionElement: {
          ...props.questionElement,
          config: {
            ...props.questionElement.config,
            condition: {},
          },
        },
      },
      stateWithAutopopulate
    );

    expect(screen.queryByLabelText('Auto-populate')).not.toBeInTheDocument();
  });

  it('should call the correct action when toggling auto-populate switch to false', async () => {
    const user = userEvent.setup();
    const stateWithAutopopulate = {
      ...initialState,
      structure: {
        ...initialState.structure,
        config: {
          settings: {
            autopopulate_from_previous_answerset: true,
          },
        },
      },
    };

    const mockedStore = renderComponent(props, stateWithAutopopulate);
    const autopopulateToggle = screen.getByRole('checkbox', {
      name: /auto-populate/i,
    });

    expect(autopopulateToggle).toBeInTheDocument();
    expect(autopopulateToggle).toBeChecked(); // defaults to global setting

    await user.click(autopopulateToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          optional: false,
          autopopulate: false,
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should call the correct action when toggling auto-populate switch to true', async () => {
    const user = userEvent.setup();
    const customProps = {
      questionElement: {
        element_type: '',
        config: { optional: false, autopopulate: false },
      },
      questionIndex,
    };
    const stateWithAutopopulate = {
      ...initialState,
      structure: {
        ...initialState.structure,
        config: {
          settings: {
            autopopulate_from_previous_answerset: true,
          },
        },
      },
    };

    const mockedStore = renderComponent(customProps, stateWithAutopopulate);
    const autopopulateToggle = screen.getByRole('checkbox', {
      name: /auto-populate/i,
    });

    expect(autopopulateToggle).toBeInTheDocument();
    expect(autopopulateToggle).not.toBeChecked();

    await user.click(autopopulateToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          optional: false,
          autopopulate: true,
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should call the correct action when toggling auto-populate switch if question is inside a Group element', async () => {
    const user = userEvent.setup();
    const stateWithAutopopulate = {
      ...initialState,
      structure: {
        ...initialState.structure,
        config: {
          settings: {
            autopopulate_from_previous_answerset: true,
          },
        },
      },
    };

    const mockedStore = renderComponent(
      {
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      },
      stateWithAutopopulate
    );
    const autopopulateToggle = screen.getByRole('checkbox', {
      name: /auto-populate/i,
    });

    expect(autopopulateToggle).toBeInTheDocument();

    await user.click(autopopulateToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          optional: false,
          autopopulate: false,
        },
        groupIndex: 1,
      },
      type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
    });
  });
});
