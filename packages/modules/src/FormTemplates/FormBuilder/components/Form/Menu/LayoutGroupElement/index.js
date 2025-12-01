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
import { getElementTitle } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/helpers';
import { levelEnumLike } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/enum-likes';
import {
  getCurrentMenuGroupIndex,
  getCurrentMenuItemIndex,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import { ConditionalIndicatorTranslated as ConditionalIndicator } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/components/ConditionalIndicator';
import LayoutGroupAccordionSummary from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/LayoutGroupElement/LayoutGroupElementAccordionSummary';
import Question from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/Question';

type Props = {
  id: number,
  name: string,
  questions: Array<HumanInputFormElement>,
  menuGroupIndex: number,
  menuItemIndex: number,
  elementId: string,
  groupIndex: number,
  isConditional: boolean,
};

const LayoutGroupElement = ({
  id,
  name,
  questions,
  menuGroupIndex,
  menuItemIndex,
  elementId,
  groupIndex,
  isConditional,
}: Props) => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
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
    levelEnumLike.group,
    menuGroupIndex,
    menuItemIndex,
    groupIndex
  );
  const currentMenuItemIndex = useSelector(getCurrentMenuItemIndex);
  const currentMenuGroupIndex = useSelector(getCurrentMenuGroupIndex);
  const isCurrentMenuItem =
    currentMenuGroupIndex === menuGroupIndex &&
    currentMenuItemIndex === menuItemIndex;
  const numberOfQuestions = questions.length;
  const activeDnDQuestion = questions[activeDnDElementIndex] || {};
  const switchMenuItemToCurrentIfNecessary = () => {
    if (!isCurrentMenuItem) {
      dispatch(setCurrentMenuGroupIndex(menuGroupIndex));
      dispatch(setCurrentMenuItemIndex(menuItemIndex));
      setIsAccordionExpanded(true);
    }
  };

  return (
    <Accordion expanded={isAccordionExpanded}>
      <LayoutGroupAccordionSummary
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
        groupIndex={groupIndex}
        isConditional={isConditional}
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
                ({ id: questionId, config, element_type: elementType }) => {
                  return (
                    <SortableItem id={questionId} key={questionId}>
                      <MuiMenuItem
                        key={config.element_id}
                        disableRipple
                        sx={{ padding: 0, height: '3rem', width: '100%' }}
                        onClick={switchMenuItemToCurrentIfNecessary}
                      >
                        <Question
                          isChildOfGroup
                          id={questionId}
                          name={getElementTitle(config, elementType)}
                        />
                        {isConditional && (
                          <ConditionalIndicator marginRight="2rem" />
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
                    isChildOfGroup
                    id={activeDnDQuestion.id}
                    name={getElementTitle(
                      activeDnDQuestion.config,
                      activeDnDQuestion.element_type
                    )}
                  />
                  <ConditionalIndicator marginRight="1rem" />
                </MuiMenuItem>
              ) : null}
            </DragOverlay>
          </MenuList>
        </DndContext>
      </AccordionDetails>
    </Accordion>
  );
};

export default LayoutGroupElement;
