import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createConditionalQuestion } from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { EditConditionTranslated as EditCondition } from '@kitman/modules/src/FormTemplates/FormBuilder/components/EditCondition';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

const conditionalElement = createConditionalQuestion();

describe('<EditCondition />', () => {
  const openModal = jest.fn();
  const props = {
    element: {
      ...conditionalElement,
      config: {
        ...conditionalElement.config,
        condition: {
          element_id: 'initial_parent_question_id',
          type: '==',
          value_type: 'string',
          value: 'yes',
          conditions: [],
        },
      },
    },
    openModal,
  };

  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <EditCondition {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: {
            ...state,
            elements: {
              initial_parent_question_id: {
                id: 1,
                config: { text: 'Did you have breakfast?' },
              },
            },
          },
        },
      }
    );

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(
      screen.getByText(/initial question: did you have breakfast\?/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
  });

  it('calls openModal when clicking pencil icon', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByTestId('EditIcon'));

    expect(openModal).toHaveBeenCalled();
  });
});
