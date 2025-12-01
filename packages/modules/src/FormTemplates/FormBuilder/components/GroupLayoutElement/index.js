// @flow
import { type ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  Box,
  IconButton,
  FormControlLabel,
  Switch,
  Button,
} from '@kitman/playbook/components';
import {
  deleteQuestionFromCurrentMenuItem,
  addQuestionToCurrentGroupLayoutElement,
  addContentElementToCurrenLayoutGroupElement,
  updateQuestion,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import useFollowUpQuestions from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useFollowUpQuestions';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { QuestionElementTranslated as QuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/QuestionElement';
import { ContentElementTranslated as ContentElement } from '@kitman/modules/src/FormTemplates/FormBuilder/components/ContentElement';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { generateDefaultGroupLayoutElementTitleByIndex } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/utils/helpers';
import { colors } from '@kitman/common/src/variables';
import FORM_CONTENT_HEADER_MAX_LENGTH from '@kitman/modules/src/FormTemplates/FormBuilder/utils/consts';
import { EditConditionTranslated as EditCondition } from '@kitman/modules/src/FormTemplates/FormBuilder/components/EditCondition';
import { EditableInput } from '@kitman/components';
import { levelEnumLike } from '../Form/Menu/utils/enum-likes';
import { editableInputStyles } from '../Form/FormContent/utils/styles';
import { createRenderContent } from '../Form/FormContent/utils/helpers';

type Props = {
  groupElement: HumanInputFormElement,
  elementIndex: number,
};

const GroupElement = ({ t, groupElement, elementIndex }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const isRepeatableGroup = groupElement.config.repeatable;
  const showTitle = !!groupElement.config?.custom_params?.show_title;

  const {
    followUpQuestionsModal,
    shouldOpenFollowUpQuestionsModal,
    shouldOpenEditChildFollowUpQuestionModal,
    openEditChildFollowUpQuestionModal,
  } = useFollowUpQuestions({
    initialQuestionElement: groupElement,
  });

  return (
    <>
      {(shouldOpenFollowUpQuestionsModal ||
        shouldOpenEditChildFollowUpQuestionModal) &&
        followUpQuestionsModal}
      <Box
        sx={{
          borderBottom: `1px solid ${colors.grey_disabled}`,
          p: 1,
        }}
      >
        <Box
          display="flex"
          sx={{ mb: 1 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <EditableInput
            value={
              groupElement.config?.title ??
              generateDefaultGroupLayoutElementTitleByIndex({ elementIndex })
            }
            renderContent={createRenderContent(levelEnumLike.group)}
            styles={editableInputStyles}
            onSubmit={(newName: string) =>
              dispatch(
                updateQuestion({
                  questionIndex: elementIndex,
                  field: 'config',
                  value: {
                    ...groupElement.config,
                    title: newName,
                    text: newName,
                  },
                })
              )
            }
            maxLength={FORM_CONTENT_HEADER_MAX_LENGTH}
            withMaxLengthCounter
          />
          <Box display="flex" alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  checked={showTitle}
                  onChange={() =>
                    dispatch(
                      updateQuestion({
                        questionIndex: elementIndex,
                        field: 'config',
                        value: {
                          ...groupElement.config,
                          custom_params: {
                            ...groupElement.config?.custom_params,
                            show_title: !showTitle,
                          },
                        },
                      })
                    )
                  }
                />
              }
              label={t('Show title')}
              sx={{ m: 0 }}
            />
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  checked={isRepeatableGroup}
                  onChange={() =>
                    dispatch(
                      updateQuestion({
                        questionIndex: elementIndex,
                        field: 'config',
                        value: {
                          ...groupElement.config,
                          repeatable: !isRepeatableGroup,
                        },
                      })
                    )
                  }
                />
              }
              label={t('Allow additional responses')}
              sx={{ m: 0 }}
            />
            <IconButton
              aria-label="delete"
              onClick={() => {
                dispatch(deleteQuestionFromCurrentMenuItem(elementIndex));
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
            </IconButton>
          </Box>
        </Box>
        {!!groupElement.config?.condition && (
          <EditCondition
            element={groupElement}
            openModal={openEditChildFollowUpQuestionModal}
          />
        )}
        <Box sx={{ border: '1px dashed rgba(59, 73, 96, 0.12)', pl: 2 }}>
          {groupElement?.form_elements.map((element, index) => {
            if (element.element_type === LAYOUT_ELEMENTS.Content) {
              return (
                <ContentElement
                  isChildOfGroup
                  groupIndex={elementIndex}
                  key={element.config.element_id}
                  questionElement={element}
                  questionIndex={index}
                />
              );
            }
            if (element.element_type === LAYOUT_ELEMENTS.Group) {
              return null;
            }
            return (
              <QuestionElement
                isChildOfGroup
                key={element.config.element_id}
                questionElement={element}
                questionIndex={index}
                groupIndex={elementIndex}
              />
            );
          })}
        </Box>
        <Box sx={{ m: 2 }}>
          <Button
            color="secondary"
            onClick={() => {
              dispatch(
                addQuestionToCurrentGroupLayoutElement({
                  elementIndex,
                })
              );
            }}
          >
            {t('Add question')}
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              dispatch(
                addContentElementToCurrenLayoutGroupElement({ elementIndex })
              );
            }}
            sx={{ ml: 1 }}
          >
            {t('Add paragraph')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export const GroupElementTranslated: ComponentType<Props> =
  withNamespaces()(GroupElement);
export default GroupElement;
