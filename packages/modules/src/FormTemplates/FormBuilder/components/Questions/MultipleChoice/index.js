// @flow
import structuredClone from 'core-js/stable/structured-clone';
import { useEffect } from 'react';
import { snakeCase } from 'lodash';
import { useDispatch } from 'react-redux';
import { Grid, SelectWrapper, Box, Button } from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import {
  initialQuestionItems,
  createQuestionOptionItem,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import {
  multiSelectStyleOptions,
  singleSelectStyleOptions,
} from '@kitman/modules/src/FormTemplates/shared/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { getMultipleChoiceQuestionTranslations } from './utils/helpers';
import Option from './Option';

type Props = {
  questionIndex: number,
  questionElement: HumanInputFormElement,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const MultipleChoice = ({
  questionIndex,
  questionElement,
  isChildOfGroup,
  groupIndex,
}: Props) => {
  const dispatch = useDispatch();
  const { config }: HumanInputFormElement = questionElement;
  const { style = 'dropdown' } = questionElement.config?.custom_params || {};
  const { items = [], variable } = config;

  const isMultipleChoice =
    questionElement.element_type === INPUT_ELEMENTS.MultipleChoice;

  useEffect(() => {
    // When a question is switched to multiple choice, its default value should be cleared
    // as this question type does not support setting a default value.
    if (isMultipleChoice && config.default_value) {
      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: {
            ...config,
            default_value: '',
          },
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );
    }
    // The effect should re-run if the question type or config changes.
    // The condition `config.default_value` prevents an infinite loop.
  }, [isMultipleChoice, config, dispatch, groupIndex, isChildOfGroup, questionIndex]);

  const onChangeStyle = (e) => {
    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...questionElement.config,
          custom_params: {
            ...questionElement.config?.custom_params,
            style: e.target.value,
          },
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const onChangeOptionName = (name: string, index: number) => {
    const clonedItems = structuredClone(items);

    clonedItems[index].label = name;
    clonedItems[index].value = snakeCase(name);

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...config,
          items: clonedItems,
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const onChangeColor = (color: string, index: number) => {
    const clonedItems = structuredClone(items);
    clonedItems[index].color = color;

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...config,
          items: clonedItems,
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const onChangeScore = (score: number, index: number) => {
    const clonedItems = structuredClone(items);
    clonedItems[index].score = score;

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...config,
          items: clonedItems,
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const onDeleteOption = (index: number) => {
    const clonedItems = structuredClone(items);

    clonedItems.splice(index, 1);

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...config,
          items: clonedItems,
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const getNewOptionItem = () => {
    const newOption = createQuestionOptionItem();

    return {
      ...newOption,
      // $FlowIgnore[exponential-spread]
      ...(config.items?.every((itemOption) => !!itemOption.score)
        ? { score: 1 }
        : {}),
      ...(config.items?.every((itemOption) => !!itemOption.color)
        ? { color: '#abc123' }
        : {}),
    };
  };

  const onAddOption = () => {
    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...config,
          items: config.items
            ? [...config.items, getNewOptionItem()]
            : initialQuestionItems,
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

    const onDefaultSelect = (e) => {
      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            default_value: e.target.value,
          },
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );
    };

  let styleOptions = [];
  if (questionElement.element_type === INPUT_ELEMENTS.SingleChoice) {
    styleOptions = singleSelectStyleOptions;
  } else if (isMultipleChoice) {
    styleOptions = multiSelectStyleOptions;
  }

  const onClearDefaultValue = () => {
    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: { ...questionElement.config, default_value: '' },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const translations = getMultipleChoiceQuestionTranslations();

  const getDefaultValue = () => {
    return config.default_value ?? '';
  };

  return (
    <Box>
      {items?.map((choice, index) => (
        <Option
          variable={variable}
          choice={choice}
          choiceIndex={index}
          // we can't use choice.label or choice.value as key because they can change via editor
          // and the input will lose focus while typing as the re-render is triggered
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          onChangeColor={(color) => onChangeColor(color, index)}
          onChangeScore={(score) => onChangeScore(score, index)}
          onChangeOptionName={(name) => onChangeOptionName(name, index)}
          onDeleteOption={() => onDeleteOption(index)}
        />
      ))}
      {!variable && (
        <Button sx={{ mb: 1 }} color="secondary" onClick={onAddOption}>
          {translations.addOption}
        </Button>
      )}
      <Grid sx={{ pb: 2 }} container spacing={3}>
        <Grid item>
          <SelectWrapper
            label={translations.style}
            onChange={onChangeStyle}
            options={styleOptions}
            value={style}
          />
        </Grid>
        {!isMultipleChoice && (
          <Grid item>
            <SelectWrapper
              label={translations.defaultValue}
              onClear={onClearDefaultValue}
              onChange={onDefaultSelect}
              options={items?.map(({ value, label }) => {
                return { value, label };
              })}
              // $FlowIgnore(incompatible-type) value can only be a number or string
              value={getDefaultValue()}
              isMulti={isMultipleChoice}
              isClearable
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MultipleChoice;
