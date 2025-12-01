import { screen, within } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  initialState,
  customState,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import QuestionMenuActions from '../index';

describe('<QuestionMenuActions />', () => {
  const t = i18nextTranslateStub();
  const questionIndex = 0;
  const questionElement =
    customState.structure.form_elements[0].form_elements[0].form_elements[
      customState.currentMenuGroupIndex
    ].form_elements[customState.currentMenuItemIndex].form_elements[
      questionIndex
    ];

  questionElement.config.items = [
    { label: 'label', value: 'label', color: '#abc123', score: 1 },
  ];
  const defaultProps = {
    t,
    anchorEl: true,
    questionIndex,
    questionElement,
    onCloseMenu: jest.fn(),
  };

  const renderComponent = (
    state = initialState,
    customProps = defaultProps
  ) => {
    const { mockedStore } = renderWithRedux(
      <QuestionMenuActions {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...state },
        },
      }
    );

    return mockedStore;
  };

  it('should render menu options enabled if question is not from question bank list', () => {
    renderComponent(customState);

    const weightedScoresButton = screen.getByRole('menuitem', {
      name: /weighted scores/i,
    });
    const assignColoursButton = screen.getByRole('menuitem', {
      name: /assign colours/i,
    });

    expect(weightedScoresButton).toBeInTheDocument();
    expect(weightedScoresButton).toBeEnabled();
    expect(assignColoursButton).toBeInTheDocument();
    expect(assignColoursButton).toBeEnabled();
  });

  it('should render menu options disabled if question is from question bank list', () => {
    questionElement.config.variable = 'variable_question_bank';

    renderComponent(customState);

    const weightedScoresButton = screen.getByRole('menuitem', {
      name: /weighted scores/i,
    });
    const assignColoursButton = screen.getByRole('menuitem', {
      name: /assign colours/i,
    });

    expect(weightedScoresButton).toBeInTheDocument();
    expect(within(weightedScoresButton).getByRole('checkbox')).toBeDisabled();
    expect(assignColoursButton).toBeInTheDocument();
    expect(within(assignColoursButton).getByRole('checkbox')).toBeDisabled();
  });

  it('should render weighted scores action checked if question option has weighted scores only', () => {
    questionElement.config.items = [
      { label: 'label', value: 'label', score: 1 },
    ];

    renderComponent(customState);

    const weightedScoresButton = screen.getByRole('menuitem', {
      name: /weighted scores/i,
    });
    const assignColoursButton = screen.getByRole('menuitem', {
      name: /assign colours/i,
    });
    expect(weightedScoresButton).toBeInTheDocument();
    expect(weightedScoresButton).toBeEnabled();
    expect(within(weightedScoresButton).getByRole('checkbox')).toBeChecked();

    expect(assignColoursButton).toBeInTheDocument();
    expect(assignColoursButton).toBeEnabled();
    expect(within(assignColoursButton).getByRole('checkbox')).not.toBeChecked();
  });

  it('should render assign colours action checked if question option has color only', () => {
    questionElement.config.items = [
      { label: 'label', value: 'label', color: '#abc123' },
    ];

    renderComponent(customState);

    const weightedScoresButton = screen.getByRole('menuitem', {
      name: /weighted scores/i,
    });
    const assignColoursButton = screen.getByRole('menuitem', {
      name: /assign colours/i,
    });
    expect(weightedScoresButton).toBeInTheDocument();
    expect(weightedScoresButton).toBeEnabled();
    expect(
      within(weightedScoresButton).getByRole('checkbox')
    ).not.toBeChecked();

    expect(assignColoursButton).toBeInTheDocument();
    expect(assignColoursButton).toBeEnabled();
    expect(within(assignColoursButton).getByRole('checkbox')).toBeChecked();
  });
});
