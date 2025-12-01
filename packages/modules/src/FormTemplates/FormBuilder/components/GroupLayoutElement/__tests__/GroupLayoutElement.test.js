import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '@kitman/playbook/providers';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { GroupElementTranslated as GroupElement } from '../index';

describe('<GroupElement />', () => {
  const elementIndex = 0;
  const props = {
    groupElement: {
      element_type: '',
      config: { optional: false },
      form_elements: [],
    },
    elementIndex,
  };

  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <ThemeProvider>
        <GroupElement {...customProps} />{' '}
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

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Add question')).toBeInTheDocument();
    expect(screen.getByText('Allow additional responses')).toBeInTheDocument();
    expect(screen.queryByTestId('EditIcon')).toBeInTheDocument();
  });

  it('renders Group component with 2 child questions', () => {
    renderComponent({
      ...props,
      groupElement: {
        ...props.groupElement,
        form_elements: [
          {
            element_type: INPUT_ELEMENTS.Text,
            config: { text: 'Question 1', optional: false },
          },
          {
            element_type: INPUT_ELEMENTS.Text,
            config: { text: 'Question 2', optional: false },
          },
        ],
      },
    });

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Add question')).toBeInTheDocument();
    expect(screen.getByText('Allow additional responses')).toBeInTheDocument();

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('should call the correct action when adding a child question element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const addQuestionButton = screen.getByText('Add question');

    expect(addQuestionButton).toBeInTheDocument();
    expect(addQuestionButton).toBeEnabled();

    await user.click(addQuestionButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: { elementIndex },
      type: `${REDUCER_KEY}/addQuestionToCurrentGroupLayoutElement`,
    });
  });

  it('should call the correct action when deleting a group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const deleteButton = screen.getByTestId('DeleteIcon');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: elementIndex,
      type: `${REDUCER_KEY}/deleteQuestionFromCurrentMenuItem`,
    });
  });

  it('should call the correct action when toggling allow additional responses switch', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const additionalResponsesToggle = screen.getByRole('checkbox', {
      name: /allow additional responses/i,
    });

    expect(additionalResponsesToggle).toBeInTheDocument();

    await user.click(additionalResponsesToggle);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex: 0,
        value: {
          repeatable: true,
          optional: false,
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should render edit condition element when element is conditional', async () => {
    renderComponent(
      {
        ...props,
        groupElement: {
          ...props.groupElement,
          config: {
            ...props.groupElement.config,
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

    expect(screen.getAllByTestId('EditIcon')).toHaveLength(2);
  });
});
