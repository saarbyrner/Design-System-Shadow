// @flow
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useState, type ComponentType } from 'react';

import {
  Dialog,
  Autocomplete,
  Typography,
  Button,
  Grid,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';

import { updateFormElementById } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { zIndices } from '@kitman/common/src/variables';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  getFormElementsMap,
  getConditionalElements,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { ConditionRowTranslated as ConditionRow } from '@kitman/modules/src/FormTemplates/FormBuilder/components/FollowUpQuestionsModal/components/ConditionRow';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type {
  ConditionalElements,
  FollowUpQuestions,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  initialQuestionElement: HumanInputFormElement,
  isModalOpen: boolean,
  isEditChildFollowUpQuestionModalOpen: boolean,
  translatedText: {
    addFollowUpQuestionsTitle: string,
    editChildFollowUpQuestionTitle: string,
    actions: { ctaButton: string, cancelButton: string },
  },
  onClose: () => void,
  onCancel: () => void,
};

const FollowUpQuestionsModal = ({
  t,
  initialQuestionElement,
  isModalOpen,
  isEditChildFollowUpQuestionModalOpen,
  onClose,
  onCancel,
  translatedText: {
    editChildFollowUpQuestionTitle,
    addFollowUpQuestionsTitle,
    actions,
  },
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const conditionalElements: ConditionalElements = useSelector(
    getConditionalElements
  );

  const formElementsMap = useSelector(getFormElementsMap);

  const getParentFollowUpQuestionModalDataForChild = () => {
    if (initialQuestionElement.config.condition) {
      const condition = initialQuestionElement.config?.condition;

      const isLogicalCondition =
        condition?.type === 'and' || condition?.type === 'or';

      const initialQuestionElementId = isLogicalCondition
        ? condition?.conditions?.[0].element_id
        : condition?.element_id;

      const parentElementId = formElementsMap[initialQuestionElementId]?.id;

      return {
        ...conditionalElements[parentElementId],
        followUpQuestions: conditionalElements[
          parentElementId
        ].followUpQuestions.filter(
          (question) =>
            question.followUpQuestion.id === initialQuestionElement.id
        ),
      };
    }

    return {};
  };

  let followUpQuestionsModalData: FollowUpQuestions =
    conditionalElements[initialQuestionElement.id] || {};

  const parentFollowUpQuestionsModalData =
    getParentFollowUpQuestionModalDataForChild();

  // If the pencil icon on a follow-up question is clicked, we need the parent
  // data with only the related follow-up question. Otherwise, we need the full
  // data for the "Add Follow-Up Question" modal.
  followUpQuestionsModalData = isEditChildFollowUpQuestionModalOpen
    ? parentFollowUpQuestionsModalData
    : followUpQuestionsModalData;

  const { initialQuestion = initialQuestionElement, followUpQuestions = [] } =
    followUpQuestionsModalData;

  const [followUpQuestionsModal, setFollowUpQuestionsModal] =
    useState(followUpQuestions);

  const [followUpQuestionIdsToDelete, setFollowUpQuestionIdsToDelete] =
    useState([]);

  const renderQuestionComponent = (
    followUpQuestion: HumanInputFormElement,
    index: number
  ) => {
    const elementListOptions = Object.values(formElementsMap)
      // $FlowIgnore[incompatible-call] Object.values is always an array
      .filter(
        (element: HumanInputFormElement) => element.id !== initialQuestion?.id
      )
      .map(
        // $FlowIgnore[incompatible-call] filter is always an array
        (element: HumanInputFormElement) => ({
          id: element.config.element_id,
          label:
            element.config.title || element.config.text || element.element_type,
        })
      );

    return (
      <Autocomplete
        fullWidth
        disablePortal
        value={elementListOptions.find(
          (element) => element.id === followUpQuestion?.config?.element_id
        )}
        onChange={(_, value) => {
          setFollowUpQuestionsModal((prevState) => {
            const updatedQuestions = [...prevState];

            const previousFollowUpQuestion =
              updatedQuestions[index]?.followUpQuestion || {};

            updatedQuestions[index] = {
              ...updatedQuestions[index],
              followUpQuestion: formElementsMap[value?.id] || {},
            };

            if (previousFollowUpQuestion.id) {
              setFollowUpQuestionIdsToDelete([
                ...followUpQuestionIdsToDelete,
                previousFollowUpQuestion.id,
              ]);
            }

            return [...updatedQuestions];
          });
        }}
        options={elementListOptions}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) =>
          renderInput({
            params,
            label: t('Ask'),
          })
        }
        noOptionsText={t('No questions')}
      />
    );
  };

  return (
    <Dialog
      fullWidth
      open={isModalOpen || isEditChildFollowUpQuestionModalOpen}
      onClose={onClose}
      aria-labelledby="follow-up-questions-modal"
      maxWidth="md"
      sx={{
        zIndex: zIndices.toastDialog,
      }}
    >
      <DialogTitle id="follow-up-questions-modal">
        {isEditChildFollowUpQuestionModalOpen
          ? editChildFollowUpQuestionTitle
          : addFollowUpQuestionsTitle}
      </DialogTitle>
      <DialogContent>
        <Grid container columns={2} spacing={1}>
          <Grid item xs={2}>
            <Typography>{initialQuestion?.config?.text}</Typography>
          </Grid>
          <Grid item xs={2}>
            {followUpQuestionsModal?.map(
              ({ condition, followUpQuestion }, index) => {
                return (
                  <Grid
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    container
                    columns={8}
                    direction="row"
                    sx={{ alignItems: 'center' }}
                  >
                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          setFollowUpQuestionsModal((questions) =>
                            questions.filter((q, i) => i !== index)
                          );

                          setFollowUpQuestionIdsToDelete([
                            ...followUpQuestionIdsToDelete,
                            followUpQuestion.id,
                          ]);
                        }}
                      >
                        <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
                      </IconButton>
                    </Grid>
                    <Grid item xs={7}>
                      <Grid
                        container
                        columns={4}
                        direction="column"
                        rowSpacing={2}
                        sx={{
                          my: 2,
                          borderLeft: '1px solid rgba(59, 73, 96, 0.12)',
                          pl: 2,
                        }}
                      >
                        <Grid item xs={4}>
                          <ConditionRow
                            initialQuestion={initialQuestion}
                            condition={condition}
                            index={index}
                            setFollowUpQuestionsModal={
                              setFollowUpQuestionsModal
                            }
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Grid
                            container
                            columns={4}
                            spacing={2}
                            sx={{ alignItems: 'center' }}
                          >
                            <Grid item>
                              <Typography>{t('Show')}</Typography>
                              <KitmanIcon
                                name={KITMAN_ICON_NAMES.SubdirectoryArrowRight}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              {renderQuestionComponent(followUpQuestion, index)}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              }
            )}
          </Grid>

          <Grid item xs={2}>
            <Button
              color="secondary"
              sx={{ mr: 1 }}
              onClick={() => {
                setFollowUpQuestionsModal([
                  ...followUpQuestionsModal,
                  {
                    condition: {
                      type: '==',
                      value: '',
                      element_id: '',
                      value_type: '',
                      conditions: [],
                    },
                    followUpQuestion: {},
                  },
                ]);
              }}
            >
              {t('Add follow up question')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {actions.cancelButton}
        </Button>
        <Button
          onClick={() => {
            followUpQuestionsModal.forEach(
              ({ condition, followUpQuestion }) => {
                const conditionType = condition.type;
                const updatedCondition =
                  conditionType === 'and' || conditionType === 'or'
                    ? {
                        ...condition,
                        conditions: condition.conditions?.map(
                          (subCondition) => {
                            return {
                              ...subCondition,
                              type:
                                initialQuestion.element_type ===
                                INPUT_ELEMENTS.MultipleChoice
                                  ? 'in'
                                  : subCondition.type,
                              element_id: initialQuestion.config.element_id,
                            };
                          }
                        ),
                      }
                    : {
                        ...condition,
                        element_id: initialQuestion.config.element_id,
                      };

                dispatch(
                  updateFormElementById({
                    id: followUpQuestion.id,
                    newConfig: {
                      condition: updatedCondition,
                    },
                  })
                );
              }
            );

            followUpQuestionIdsToDelete.forEach((idToDelete) => {
              dispatch(
                updateFormElementById({
                  id: idToDelete,
                  newConfig: {
                    condition: null,
                  },
                })
              );
            });

            onClose();
          }}
          color="primary"
        >
          {actions.ctaButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const FollowUpQuestionsModalTranslated: ComponentType<Props> =
  withNamespaces()(FollowUpQuestionsModal);
export default FollowUpQuestionsModal;
