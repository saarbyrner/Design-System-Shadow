// @flow
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ComponentType,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import {
  Box,
  Typography,
  SelectWrapper,
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  Autocomplete,
  TextField,
  Button,
} from '@kitman/playbook/components';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { useDebounceField } from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useDebounceField';
import {
  deleteQuestionFromCurrentMenuItem,
  deleteQuestionFromCurrentGroupLayoutElement,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import useFollowUpQuestions from '@kitman/modules/src/FormTemplates/FormBuilder/hooks/useFollowUpQuestions';
import type { ConditionalElements } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import {
  getConditionalElements,
  getFormStructure,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { QuestionMenuActionsTranslated as QuestionMenuActions } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Questions/QuestionElement/components/QuestionMenuActions';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { QuestionResponse } from '@kitman/services/src/services/formTemplates/api/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { questionStyleOptions } from '@kitman/modules/src/FormTemplates/shared/consts';
import {
  parseQuestionElement,
  getQuestionElementType,
  updateQuestionElement,
} from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import { useGetQuestionBanksQuery } from '@kitman/services/src/services/formTemplates';
import { colors } from '@kitman/common/src/variables';
import { EditConditionTranslated as EditCondition } from '@kitman/modules/src/FormTemplates/FormBuilder/components/EditCondition';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup?: boolean,
  groupIndex?: number,
};

const QuestionElement = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const hasInitializedAutopopulate = useRef(false);
  const [selectedQuestionBankOption, setSelectedQuestionBankOption] =
    useState<QuestionResponse | null>(null);
  const [anchorActionsMenuEl, setAnchorActionsMenuEl] = useState(null);
  const {
    openModal,
    followUpQuestionsModal,
    shouldOpenFollowUpQuestionsModal,
    shouldOpenEditChildFollowUpQuestionModal,
    openEditChildFollowUpQuestionModal,
  } = useFollowUpQuestions({
    initialQuestionElement: questionElement,
  });
  const conditionalElements: ConditionalElements = useSelector(
    getConditionalElements
  );
  const { config: formTemplateConfig } = useSelector(getFormStructure);
  const isGlobalAutopopulateEnabled =
    formTemplateConfig?.settings?.autopopulate_from_previous_answerset || false;

  const hasFollowUpQuestions = !!conditionalElements[questionElement.id];

  const shouldShowQuestionAutocomplete = !(
    questionElement.element_type === INPUT_ELEMENTS.Attachment ||
    questionElement.element_type === INPUT_ELEMENTS.DateTime ||
    questionElement.element_type === INPUT_ELEMENTS.Text
  );
  const shouldShowActionMenu =
    questionElement.element_type === INPUT_ELEMENTS.SingleChoice ||
    questionElement.element_type === INPUT_ELEMENTS.MultipleChoice;

  const {
    data: questionBanksData = [],
    isLoading: isQuestionBanksLoading,
  }: {
    data: Array<QuestionResponse>,
    isLoading: boolean,
  } = useGetQuestionBanksQuery(
    getQuestionElementType(questionElement.element_type),
    { skip: !shouldShowQuestionAutocomplete }
  );
  const DEFAULT_TITLE = `Question ${questionIndex + 1}`;
  const isQuestionOptional = questionElement.config.optional;
  const isQuestionAutopopulate =
    questionElement.config?.autopopulate ?? isGlobalAutopopulateEnabled;

  // Initialize autopopulate flag when global setting is enabled
  useEffect(() => {
    if (
      !hasInitializedAutopopulate.current &&
      isGlobalAutopopulateEnabled &&
      !questionElement.config?.condition &&
      questionElement.config?.autopopulate === undefined
    ) {
      hasInitializedAutopopulate.current = true;
      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            autopopulate: true,
          },
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateDescription = useCallback(
    (value: string) => {
      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: {
            ...questionElement.config,
            text: value,
          },
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );
    },
    [
      questionElement.config,
      questionIndex,
      dispatch,
      isChildOfGroup,
      groupIndex,
    ]
  );

  const { value: descriptionValue, onChange: onDescriptionChange } =
    useDebounceField({
      initialValue: questionElement.config.text || '',
      onUpdate: handleUpdateDescription,
    });

  const resetSelectedQuestionBankOption = () => {
    // reset value for question bank option and element config
    setSelectedQuestionBankOption(null);
    const resetQuestionElementConfig = {
      ...questionElement.config,
    };

    delete resetQuestionElementConfig.data_point;
    delete resetQuestionElementConfig.text;
    delete resetQuestionElementConfig.source;
    delete resetQuestionElementConfig.variable;
    delete resetQuestionElementConfig.min;
    delete resetQuestionElementConfig.max;
    delete resetQuestionElementConfig.custom_params;
    delete resetQuestionElementConfig.items;

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: resetQuestionElementConfig,
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };
  const handleSelectQuestionBankOption = (
    event,
    selectedOption: QuestionResponse,
    reason
  ) => {
    const { element_type: elementType } = questionElement;
    const { source, variable, platform, description } = selectedOption || {};

    if (reason === 'clear') {
      resetSelectedQuestionBankOption();
    } else {
      setSelectedQuestionBankOption(selectedOption);

      const updatedQuestionElementConfig = {
        ...questionElement.config,
        data_point: true,
        text: description,
        source,
        variable,
        platform,
      };

      updateQuestionElement(
        {
          questionIndex,
          field: 'config',
          value: updatedQuestionElementConfig,
        },
        dispatch,
        isChildOfGroup,
        groupIndex
      );

      if (
        elementType === INPUT_ELEMENTS.Number ||
        elementType === INPUT_ELEMENTS.Range
      ) {
        const { min, max, unit } = selectedOption || {};

        updateQuestionElement(
          {
            questionIndex,
            field: 'config',
            value: {
              ...updatedQuestionElementConfig,
              min,
              max,
              custom_params: {
                ...updatedQuestionElementConfig.custom_params,
                unit: unit || '',
              },
            },
          },
          dispatch,
          isChildOfGroup,
          groupIndex
        );
      }

      if (
        elementType === INPUT_ELEMENTS.SingleChoice ||
        elementType === INPUT_ELEMENTS.MultipleChoice
      ) {
        updateQuestionElement(
          {
            questionIndex,
            field: 'config',
            value: {
              ...updatedQuestionElementConfig,
              items:
                selectedOption.choices?.map(
                  ({
                    name,
                    key,
                    default_colour: defaultColor,
                    default_score: defaultScore,
                  }) => ({
                    value: key,
                    label: name,
                    color: defaultColor,
                    score: defaultScore,
                  })
                ) ?? [],
            },
          },
          dispatch,
          isChildOfGroup,
          groupIndex
        );
      }
    }
  };

  const getQuestionLabel = (question: QuestionResponse) => {
    if (
      questionElement.element_type === INPUT_ELEMENTS.Number &&
      question.unit
    ) {
      return `${question.description} - [${question.unit}]`;
    }
    return question.description;
  };

  const getPreselectedQuestionOption = () => {
    if (questionElement.config.variable) {
      const preselectedOptionData = questionBanksData.find(
        (question) => question.variable === questionElement.config.variable
      );

      return preselectedOptionData
        ? {
            ...preselectedOptionData,
            label: getQuestionLabel(preselectedOptionData),
            value: preselectedOptionData.variable,
          }
        : null;
    }

    return null;
  };

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
          sx={{ mb: 1 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color={colors.grey_200}>
            {DEFAULT_TITLE}
          </Typography>
          <Box display="flex" alignItems="center">
            <Button color="text" sx={{ mr: 1 }} onClick={openModal}>
              {hasFollowUpQuestions
                ? t('Edit  follow up questions')
                : t('Add follow up question')}
            </Button>
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  checked={!isQuestionOptional}
                  onChange={() => {
                    updateQuestionElement(
                      {
                        questionIndex,
                        field: 'config',
                        value: {
                          ...questionElement.config,
                          optional: !isQuestionOptional,
                        },
                      },
                      dispatch,
                      isChildOfGroup,
                      groupIndex
                    );
                  }}
                />
              }
              label={t('Mandatory')}
              sx={{ m: 0 }}
            />
            {isGlobalAutopopulateEnabled &&
              !questionElement.config?.condition && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={isQuestionAutopopulate}
                      onChange={() => {
                        updateQuestionElement(
                          {
                            questionIndex,
                            field: 'config',
                            value: {
                              ...questionElement.config,
                              autopopulate: !isQuestionAutopopulate,
                            },
                          },
                          dispatch,
                          isChildOfGroup,
                          groupIndex
                        );
                      }}
                    />
                  }
                  label={t('Auto-populate')}
                  sx={{ m: 0, ml: 1 }}
                />
              )}
            {shouldShowActionMenu && (
              <>
                <IconButton
                  aria-label="options"
                  onClick={(event) => {
                    setAnchorActionsMenuEl(event.currentTarget);
                  }}
                >
                  <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
                </IconButton>
                <QuestionMenuActions
                  questionElement={questionElement}
                  questionIndex={questionIndex}
                  anchorEl={anchorActionsMenuEl}
                  onCloseMenu={() => setAnchorActionsMenuEl(null)}
                  groupIndex={groupIndex}
                  isChildOfGroup={isChildOfGroup}
                />
              </>
            )}
            <IconButton
              aria-label="delete"
              onClick={() => {
                if (isChildOfGroup) {
                  dispatch(
                    deleteQuestionFromCurrentGroupLayoutElement({
                      groupIndex,
                      questionIndex,
                    })
                  );
                } else {
                  dispatch(deleteQuestionFromCurrentMenuItem(questionIndex));
                }
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
            </IconButton>
          </Box>
        </Box>
        {!!questionElement.config?.condition && (
          <EditCondition
            element={questionElement}
            openModal={openEditChildFollowUpQuestionModal}
          />
        )}
        <Grid sx={{ pb: 2 }} container spacing={3}>
          <Grid item>
            <SelectWrapper
              label={t('Question style')}
              onChange={(e) => {
                updateQuestionElement(
                  {
                    questionIndex,
                    field: 'element_type',
                    value: e.target.value,
                  },
                  dispatch,
                  isChildOfGroup,
                  groupIndex
                );

                resetSelectedQuestionBankOption();
              }}
              options={questionStyleOptions}
              value={questionElement.element_type}
            />
          </Grid>
          <Grid item>
            {shouldShowQuestionAutocomplete && (
              <Autocomplete
                value={
                  selectedQuestionBankOption || getPreselectedQuestionOption()
                }
                isOptionEqualToValue={(option, selectedBankOption) =>
                  option.value === selectedBankOption.value
                }
                onChange={handleSelectQuestionBankOption}
                options={questionBanksData.map((question) => ({
                  ...question,
                  label: getQuestionLabel(question),
                  value: question.variable,
                }))}
                sx={{ minWidth: 300 }}
                loading={isQuestionBanksLoading}
                renderInput={(params) => (
                  <TextField {...params} label={t('Question')} />
                )}
              />
            )}
          </Grid>
        </Grid>
        <Grid container direction="column" spacing={3}>
          <Grid item sx={{ width: '45%' }}>
            <TextField
              label={t('Description')}
              sx={{ width: '100%' }}
              value={descriptionValue}
              onChange={onDescriptionChange}
            />
          </Grid>
          <Grid item>
            {parseQuestionElement({
              questionElement,
              questionIndex,
              selectedQuestionBankOption,
              groupIndex,
              isChildOfGroup,
            })}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const QuestionElementTranslated: ComponentType<Props> =
  withNamespaces()(QuestionElement);
export default QuestionElement;
