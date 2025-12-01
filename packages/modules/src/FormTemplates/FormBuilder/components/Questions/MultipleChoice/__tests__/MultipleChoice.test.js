import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import structuredClone from 'core-js/stable/structured-clone';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { customState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { createQuestionOptionItem } from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import MultipleChoice from '../index';
import { getMultipleChoiceQuestionTranslations } from '../utils/helpers';

describe('<MultipleChoice />', () => {
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

  const props = {
    questionElement,
    questionIndex,
  };

  const translations = getMultipleChoiceQuestionTranslations();

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(
      <MultipleChoice {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...customState },
        },
      }
    );

    return mockedStore;
  };

  describe('when element type is SingleChoice', () => {
    it('should trigger dispatch calls when needed', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      // color
      const colorInput = screen.getByLabelText(translations.color);
      const newColor = '45abc7';
      const newColorHex = `#${newColor}`;
      await user.dblClick(colorInput);
      await user.paste(newColor);

      const clonedItems1 = structuredClone(questionElement.config.items);
      clonedItems1[0].color = newColorHex;

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: { ...questionElement.config, items: clonedItems1 },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });

      const scoreInput = screen.getByLabelText(translations.weightedScore);
      const newScore = 7;
      await user.clear(scoreInput);
      await user.keyboard(newScore.toString());

      const clonedItems2 = structuredClone(questionElement.config.items);
      const newValueString = `${clonedItems2[0].score}${newScore}`;
      clonedItems2[0].score = +newValueString;

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: { ...questionElement.config, items: clonedItems2 },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });

      const addOptionButton = screen.getByRole('button', {
        name: /add option/i,
      });

      expect(addOptionButton).toBeInTheDocument();
      expect(addOptionButton).toBeEnabled();

      await user.click(addOptionButton);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            items: [
              { label: 'label', value: 'label', color: '#abc123', score: 1 },
              { ...createQuestionOptionItem(), score: 1, color: '#abc123' },
            ],
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should show style select and trigger action on click', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      const styleSelector = screen.getByLabelText(translations.style);
      expect(styleSelector).toBeInTheDocument();
      await user.click(styleSelector);

      expect(
        screen.getByRole('option', { name: 'Dropdown' })
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Radio' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Toggle' })
      ).toBeInTheDocument();

      await user.click(screen.getByRole('option', { name: 'Toggle' }));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex: 0,
          value: {
            ...questionElement.config,
            custom_params: {
              style: 'toggle',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should show default value select and trigger action on click', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      const defaultValueSelector = screen.getByLabelText(
        translations.defaultValue
      );
      expect(defaultValueSelector).toBeInTheDocument();

      await user.click(defaultValueSelector);

      expect(screen.getByRole('option', { name: 'label' })).toBeInTheDocument();

      await user.click(screen.getByRole('option', { name: 'label' }));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex: 0,
          value: {
            ...questionElement.config,
            default_value: 'label',
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('when element type is MultipleChoice', () => {
    it('should not show default value select', () => {
      const multipleChoiceQuestion = structuredClone(questionElement);
      multipleChoiceQuestion.element_type =
        'Forms::Elements::Inputs::MultipleChoice';

      renderComponent({
        ...props,
        questionElement: multipleChoiceQuestion,
      });

      const defaultValueSelector = screen.queryByLabelText(
        translations.defaultValue
      );
      expect(defaultValueSelector).not.toBeInTheDocument();
    });

    it('should clear default_value if it exists', () => {
      const multipleChoiceQuestion = structuredClone(questionElement);
      multipleChoiceQuestion.element_type =
        'Forms::Elements::Inputs::MultipleChoice';
      multipleChoiceQuestion.config.default_value = 'some_value';

      const mockedStore = renderComponent({
        ...props,
        questionElement: multipleChoiceQuestion,
      });

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex: 0,
          value: {
            ...multipleChoiceQuestion.config,
            default_value: '',
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('Multiple Choice element inside a Group element', () => {
    it('should trigger dispatch calls when needed', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });

      // color
      const colorInput = screen.getByLabelText(translations.color);
      const newColor = '45abc7';
      const newColorHex = `#${newColor}`;
      await user.dblClick(colorInput);
      await user.paste(newColor);

      const clonedItems1 = structuredClone(questionElement.config.items);
      clonedItems1[0].color = newColorHex;

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: { ...questionElement.config, items: clonedItems1 },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });

      const scoreInput = screen.getByLabelText(translations.weightedScore);
      const newScore = 7;
      await user.clear(scoreInput);
      await user.keyboard(newScore.toString());

      const clonedItems2 = structuredClone(questionElement.config.items);
      const newValueString = `${clonedItems2[0].score}${newScore}`;
      clonedItems2[0].score = +newValueString;

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: { ...questionElement.config, items: clonedItems2 },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });

      const addOptionButton = screen.getByRole('button', {
        name: /add option/i,
      });

      expect(addOptionButton).toBeInTheDocument();
      expect(addOptionButton).toBeEnabled();

      await user.click(addOptionButton);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            items: [
              { label: 'label', value: 'label', color: '#abc123', score: 1 },
              { ...createQuestionOptionItem(), score: 1, color: '#abc123' },
            ],
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
