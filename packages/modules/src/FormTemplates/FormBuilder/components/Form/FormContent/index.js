// @flow
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import {
  addQuestionToCurrentMenuItem,
  addContentElementToCurrentMenuItem,
  addGroupLayoutElementToCurrentMenuItem,
  updateElementsState,
  updateConditionalElementsState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { QuestionElementTranslated as QuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/QuestionElement';
import { ContentElementTranslated as ContentElement } from '@kitman/modules/src/FormTemplates/FormBuilder/components/ContentElement';
import { GroupElementTranslated as GroupElement } from '@kitman/modules/src/FormTemplates/FormBuilder/components/GroupLayoutElement';

import {
  getFormMenu,
  getCurrentMenuGroupIndex,
  getCurrentMenuItemIndex,
  getFormStructure,
  getFormElementsMap,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { formContentHeightWithoutHeader } from '../utils/consts';
import Header from './Header';

const FormContent = () => {
  const dispatch = useDispatch();
  const formMenuStructure: Array<HumanInputFormElement> =
    useSelector(getFormMenu);
  const formElementsStructure = useSelector(getFormStructure);
  const formElementsMap = useSelector(getFormElementsMap);
  const currentMenuGroupIndex = useSelector(getCurrentMenuGroupIndex);
  const currentMenuItemIndex = useSelector(getCurrentMenuItemIndex);

  const currentMenuGroup = formMenuStructure[currentMenuGroupIndex];
  const currentMenuItem = currentMenuGroup.form_elements[currentMenuItemIndex];

  useEffect(() => {
    dispatch(
      updateElementsState({ elements: formElementsStructure.form_elements })
    );
  }, [formElementsStructure, dispatch]);

  const conditionalElementsMapObj = useMemo(() => {
    // $FlowIgnore[incompatible-call] Object.values is always an array
    return Object.values(formElementsMap).reduce(
      (conditionalElementsMap, formElement: HumanInputFormElement) => {
        const condition = formElement.config?.condition;
        if (condition) {
          const isLogicalCondition =
            condition.type === 'and' || condition.type === 'or';

          const initialQuestionElementId = isLogicalCondition
            ? condition.conditions?.[0].element_id
            : condition?.element_id;

          const initialQuestion =
            formElementsMap[initialQuestionElementId] || {};

          // if key doesnt exist initialize entry

          if (!conditionalElementsMap[initialQuestion?.id]) {
            return {
              ...conditionalElementsMap,
              [initialQuestion?.id]: {
                initialQuestion,
                followUpQuestions: [
                  {
                    condition,
                    followUpQuestion: formElement,
                  },
                ],
              },
            };
          }

          // if key does exists appened follow up question
          return {
            ...conditionalElementsMap,
            [initialQuestion?.id]: {
              ...conditionalElementsMap[initialQuestion?.id],
              followUpQuestions: [
                ...conditionalElementsMap[initialQuestion?.id]
                  .followUpQuestions,
                {
                  condition,
                  followUpQuestion: formElement,
                },
              ],
            },
          };
        }
        return conditionalElementsMap;
      },
      {}
    );
  }, [formElementsMap]);

  useEffect(() => {
    dispatch(
      updateConditionalElementsState({
        conditionalElementsMap: conditionalElementsMapObj,
      })
    );
  }, [conditionalElementsMapObj, dispatch]);

  const formElements = useMemo(() => {
    return currentMenuItem?.form_elements.map((questionElement, index) => {
      if (questionElement.element_type === LAYOUT_ELEMENTS.Content) {
        return (
          <ContentElement
            key={questionElement.config.element_id}
            questionElement={questionElement}
            questionIndex={index}
          />
        );
      }
      if (questionElement.element_type === LAYOUT_ELEMENTS.Group) {
        return (
          <GroupElement
            key={questionElement.config.element_id}
            groupElement={questionElement}
            elementIndex={index}
          />
        );
      }
      return (
        <QuestionElement
          key={questionElement.config.element_id}
          questionElement={questionElement}
          questionIndex={index}
        />
      );
    });
  }, [currentMenuItem?.form_elements]);

  const actionButtons = useMemo(
    () => (
      <Box sx={{ mt: 2, width: '100%' }}>
        <Button
          color="secondary"
          onClick={() => {
            dispatch(addQuestionToCurrentMenuItem());
          }}
        >
          {i18n.t('Add question')}
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            dispatch(addContentElementToCurrentMenuItem());
          }}
          sx={{ ml: 1 }}
        >
          {i18n.t('Add paragraph')}
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            dispatch(addGroupLayoutElementToCurrentMenuItem());
          }}
          sx={{ ml: 1 }}
        >
          {i18n.t('Add group')}
        </Button>
      </Box>
    ),
    [dispatch]
  );

  return (
    <Box
      sx={{
        width: '100%',
        p: 2,
      }}
    >
      <Header
        currentMenuGroup={currentMenuGroup}
        currentMenuItem={currentMenuItem}
        currentMenuItemIndex={currentMenuItemIndex}
        currentMenuGroupIndex={currentMenuGroupIndex}
      />
      <Box sx={{ height: formContentHeightWithoutHeader, overflow: 'scroll' }}>
        {formElements}
        {actionButtons}
      </Box>
    </Box>
  );
};

export default FormContent;
