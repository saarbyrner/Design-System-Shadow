// @flow
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import useSortableDragAndDrop from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useSortableDragAndDrop';

import SortableItem from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/SortableItem';
import {
  Accordion,
  AccordionDetails,
  MenuItem as MuiMenuItem,
  MenuList,
} from '@kitman/playbook/components';
import {
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { colors } from '@kitman/common/src/variables';
import { levelEnumLike } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/enum-likes';
import {
  getCurrentMenuGroupIndex,
  getCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import LayoutGroupElement from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/LayoutGroupElement';
import { getElementTitle } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { ConditionalIndicatorTranslated as ConditionalIndicator } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/components/ConditionalIndicator';

import Question from '../Question';
import MenuItemAccordionSummary from './MenuItemAccordionSummary';

type Props = {
  id: number,
  name: string,
  questions: Array<HumanInputFormElement>,
  menuGroupIndex: number,
  menuItemIndex: number,
  elementId: string,
  isLastMenuItem: boolean,
};

const MenuItem = ({
  id,
  name,
  questions,
  menuGroupIndex,
  menuItemIndex,
  elementId,
  isLastMenuItem,
}: Props) => {
  const dispatch = useDispatch();
  const {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    dropAnimationConfig,
    sensors,
    activeDnDElementIndex,
    activeId,
  } = useSortableDragAndDrop(
    questions,
    levelEnumLike.question,
    menuGroupIndex,
    menuItemIndex
  );

  const currentMenuItemIndex = useSelector(getCurrentMenuItemIndex);
  const currentMenuGroupIndex = useSelector(getCurrentMenuGroupIndex);
  const isCurrentMenuItem =
    currentMenuGroupIndex === menuGroupIndex &&
    currentMenuItemIndex === menuItemIndex;

  const [isAccordionExpanded, setIsAccordionExpanded] =
    useState(isCurrentMenuItem);

  const numberOfQuestions = questions.length;

  const switchMenuItemToCurrentIfNecessary = () => {
    if (!isCurrentMenuItem) {
      dispatch(setCurrentMenuGroupIndex(menuGroupIndex));
      dispatch(setCurrentMenuItemIndex(menuItemIndex));
      setIsAccordionExpanded(true);
    }
  };

  const activeDnDQuestion = questions[activeDnDElementIndex] || {};

  return (
    <Accordion
      expanded={isAccordionExpanded}
      sx={{
        ...(isLastMenuItem
          ? {}
          : {
              borderBottom: `2px solid ${colors.neutral_300}`,
            }),
      }}
    >
      <MenuItemAccordionSummary
        id={id}
        numberOfQuestions={numberOfQuestions}
        setIsAccordionExpanded={setIsAccordionExpanded}
        isAccordionExpanded={isAccordionExpanded}
        elementId={elementId}
        onClickAccordionSummary={switchMenuItemToCurrentIfNecessary}
        name={name}
        isCurrentMenuItem={isCurrentMenuItem}
        menuGroupIndex={menuGroupIndex}
        menuItemIndex={menuItemIndex}
      />
      <AccordionDetails sx={{ padding: 0 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <MenuList sx={{ padding: 0 }}>
            <SortableContext
              items={questions.map((question) => question.id)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map(
                (
                  {
                    id: questionId,
                    config,
                    element_type: elementType,
                    form_elements: formElements,
                  },
                  index
                ) => {
                  return (
                    <SortableItem id={questionId} key={questionId}>
                      <MuiMenuItem
                        key={config.element_id}
                        disableRipple
                        sx={{
                          padding: 0,
                          height:
                            elementType !== LAYOUT_ELEMENTS.Group && '3rem',
                          width: '100%',
                        }}
                        onClick={switchMenuItemToCurrentIfNecessary}
                      >
                        {elementType === LAYOUT_ELEMENTS.Group ? (
                          <LayoutGroupElement
                            id={questionId}
                            name={config.title || 'Group'}
                            questions={formElements}
                            menuItemIndex={menuItemIndex}
                            menuGroupIndex={menuGroupIndex}
                            groupIndex={index}
                            elementId={config.element_id}
                            isLastMenuItem={false}
                            isConditional={!!config?.condition}
                          />
                        ) : (
                          <>
                            <Question
                              id={questionId}
                              name={getElementTitle(config, elementType)}
                            />
                            {!!config?.condition && (
                              <ConditionalIndicator marginRight="2rem" />
                            )}
                          </>
                        )}
                      </MuiMenuItem>
                    </SortableItem>
                  );
                }
              )}
            </SortableContext>
            <DragOverlay dropAnimation={dropAnimationConfig}>
              {activeId ? (
                <MuiMenuItem
                  key={activeDnDQuestion.config.element_id}
                  disableRipple
                  sx={{
                    padding: 0,
                    height: '3rem',
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                  onClick={switchMenuItemToCurrentIfNecessary}
                >
                  <Question
                    id={activeDnDQuestion.id}
                    name={getElementTitle(
                      activeDnDQuestion.config,
                      activeDnDQuestion.element_type
                    )}
                  />
                  {!!activeDnDQuestion.config?.condition && (
                    <ConditionalIndicator marginRight="2rem" />
                  )}
                </MuiMenuItem>
              ) : null}
            </DragOverlay>
          </MenuList>
        </DndContext>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuItem;
