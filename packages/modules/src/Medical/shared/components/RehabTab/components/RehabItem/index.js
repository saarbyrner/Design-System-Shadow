// @flow
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import i18n from '@kitman/common/src/utils/i18n';
import { css } from '@emotion/react';
import {
  useState,
  useEffect,
  useMemo,
  createRef,
  useRef,
  Fragment,
} from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import {
  IconButton,
  Checkbox,
  EllipsisTooltipText,
  Textarea,
} from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { getRehabExercise } from '@kitman/services';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';
import type { RehabContextType } from '../../RehabContext/types';
import { useRehabDispatch } from '../../RehabContext';
import RehabVariationsEdit from '../RehabVariationsEdit';
import type {
  Exercise,
  ExerciseVariation,
  VariationParameters,
  RehabDayMode,
  ExerciseUpdateDetails,
} from '../../types';
import getStyle from './style';
import rehabNetworkActions from '../../RehabContext/rehabNetworkActions';
import { ADD_REHAB_BUTTON } from '../../../../constants/elementTags';

type Props = {
  id: number,
  sessionId: number,
  sectionId: number,
  issueOccurrenceId?: number,
  issueType?: IssueType,
  exercise: Exercise,
  readOnly: boolean,
  disabled: boolean,
  inMaintenance: boolean,
  hasManagePermission: boolean,
  athleteId: number,
  draggingNewExercise: boolean,
  rehabCopyMode: boolean,
  rehabGroupMode: boolean,
  linkToMode: boolean,
  isTouchInput: boolean,
  rehabDayMode: RehabDayMode,
  rehabContext: RehabContextType,
  callDeleteExercise: Function,
  hiddenFilters: ?Array<string>,
};

const RehabItem = (props: Props) => {
  const {
    dispatch,
    copyExerciseIds,
    groupExerciseIds,
    editExerciseIds,
    linkExerciseIds,
  } = useRehabDispatch();

  const [currentFocusAction, setCurrentFocusAction] = useState('');
  const [itemIsChecked, setItemIsChecked] = useState(false);
  const [itemIsInEditMode, setItemIsInEditMode] = useState(false);
  const [localVariations, setLocalVariations] = useState(
    props.exercise.variations
  );

  const textAreaRef = useRef<null | HTMLTextAreaElement>(null);
  const inputsRef = localVariations.map(() => ({
    parameter1: createRef(),
    parameter2: createRef(),
    parameter3: createRef(),
  }));

  useEffect(() => {
    setItemIsChecked(
      copyExerciseIds?.includes(props.id) ||
        linkExerciseIds?.includes(props.id) ||
        groupExerciseIds?.includes(props.id)
    );
  }, [props.id, copyExerciseIds, linkExerciseIds, groupExerciseIds]);

  useEffect(() => {
    setItemIsInEditMode(!props.readOnly && editExerciseIds?.includes(props.id));
  }, [props.id, editExerciseIds, props.readOnly]);

  /* when an item is opened in edit mode focus on first input */
  useEffect(() => {
    if (
      inputsRef.length > 0 &&
      inputsRef[inputsRef.length - 1].parameter1.current &&
      currentFocusAction
    ) {
      switch (currentFocusAction) {
        case 'ADD_EXERCISE_TO_EDIT_ARRAY': {
          inputsRef[0].parameter1.current?.focus();
          break;
        }
        case 'DELETE_EXERCISE_VARIATION': {
          inputsRef[inputsRef.length - 1].parameter1.current?.focus();
          break;
        }
        default:
          break;
      }
    }
    setCurrentFocusAction('NO_ACTION_NEEDED');
  }, [inputsRef]);

  const interactionDisable =
    props.disabled ||
    props.linkToMode ||
    (props.rehabCopyMode && !copyExerciseIds.includes(props.id));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    disabled: {
      draggable: interactionDisable || itemIsInEditMode, // Don't allow dragging or dropping onto a exercise in edit mode
      droppable: interactionDisable, // Allow dropping onto a exercise in edit mode
    },
    data: {
      type: 'exercise',
      sessionId: props.sessionId,
      // The section id can be gotten from sortable
      // But easier to add here
      sectionId: props.sectionId,
    },
  });
  const editAttributes = { ...attributes, tabIndex: -1 };

  const getRehabDefaultVariation = async (templateId: number) => {
    const rehabExercise = await getRehabExercise(templateId);
    return rehabExercise.variations_default;
  };

  const [localComment, setLocalComment] = useState(props.exercise.comment);
  const [localDisable, setLocalDisable] = useState(props.disabled || false);
  const rehabNetworkCall = rehabNetworkActions(dispatch);

  useEffect(() => {
    setLocalDisable(props.disabled || false);
  }, [props.disabled]);

  useEffect(() => {
    setLocalComment(props.exercise.comment);
  }, [props.exercise.comment]);

  useEffect(() => {
    setLocalVariations(props.exercise.variations);
  }, [props.exercise.variations]);

  const transformStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: props.disabled || itemIsInEditMode ? 'default' : 'grab',
  };

  const copyTransformStyle = {
    transition,
    cursor:
      props.disabled || itemIsInEditMode || !itemIsChecked ? 'default' : 'grab',
  };

  const debounceCommentUpdate = useDebouncedCallback((comment) => {
    const exerciseUpdate: ExerciseUpdateDetails = {
      athlete_id: props.athleteId,
      exercise_template_id: props.exercise.exercise_template_id,
      exercise_instance_id: props.id,
      session_id: props.sessionId,
      section_id: props.sectionId,
      order_index: props.exercise.order_index,
      variations: localVariations,
      comment,
      previous_section_id: null,
      previous_session_id: null,
    };
    rehabNetworkCall.updateExerciseValue({
      maintenance: props.inMaintenance || props.exercise.maintenance === true,
      newExerciseDetails: exerciseUpdate,
      refetchSessionsAfterAction: false,
      issueId: props.issueOccurrenceId,
      issueType: props.issueType,
    });
    dispatch?.({
      type: 'UPDATE_EXERCISE_PROPERTY',
      exerciseId: props.id,
      sectionId: props.sectionId,
      propertyKey: 'comment',
      value: comment,
    });
  }, 500); // Half second delay before changing state

  const style = useMemo(
    () =>
      getStyle(
        props.rehabDayMode === '1_DAY',
        props.rehabCopyMode,
        props.rehabGroupMode,
        props.linkToMode,
        itemIsInEditMode,
        props.disabled,
        isDragging,
        props.isTouchInput
      ),
    [
      props.rehabDayMode,
      props.rehabCopyMode,
      props.rehabGroupMode,
      props.linkToMode,
      itemIsInEditMode,
      props.disabled,
      isDragging,
      props.isTouchInput,
    ]
  );

  const displayVariationDetails = (
    variation: ExerciseVariation,
    index: number
  ) => {
    return (
      <div key={`${index}`} css={style.variationReadOnlyDisplay}>
        {variation?.parameters?.map((param, counter) => {
          return (
            <Fragment key={`${param.key}_fragment`}>
              <div key={param.key} css={style.setRepUnitsText}>
                {param.value} {counter !== 2 ? param.label : ''}{' '}
                {counter === 2 && param.unit ? `${param.unit}` : ''}
              </div>
              {counter < variation.parameters.length - 1 && (
                <div
                  key={`${param.key}_divider`}
                  css={style.variationDivider}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  };

  const shouldRenderActionButtons =
    !props.hiddenFilters?.includes(ADD_REHAB_BUTTON) &&
    props.hasManagePermission &&
    !props.rehabCopyMode &&
    !props.rehabGroupMode &&
    !itemIsInEditMode &&
    !props.linkToMode;

  const displayActionButtons = () => (
    <div css={style.actionButtons} className="rehabActionButtons">
      {shouldRenderActionButtons && (
        <div data-testid="action-buttons" css={style.actionButton}>
          <IconButton
            onClick={() => {
              setCurrentFocusAction('ADD_EXERCISE_TO_EDIT_ARRAY');
              dispatch?.({
                type: 'ADD_EXERCISE_TO_EDIT_ARRAY',
                exerciseId: props.id,
              });
            }}
            icon="icon-edit"
            isSmall
            isTransparent
          />
          <IconButton
            onClick={() => {
              props.callDeleteExercise(props.exercise);
            }}
            icon="icon-bin"
            isSmall
            isDisabled={props.disabled || localDisable}
            isTransparent
          />
        </div>
      )}

      {(props.rehabCopyMode || props.linkToMode || props.rehabGroupMode) && (
        <div css={style.selectCheckbox}>
          <Checkbox
            data-testid="RehabSection|CopyItem"
            id="copy-section"
            name="copy-section"
            isChecked={itemIsChecked}
            toggle={({ checked }) => {
              if (props.rehabCopyMode) {
                dispatch?.({
                  type: 'ADD_EXERCISE_TO_COPY_ARRAY',
                  exerciseId: props.id,
                  exerciseSelected: checked,
                });
              }
              if (props.rehabGroupMode) {
                dispatch?.({
                  type: 'ADD_EXERCISE_TO_GROUP_ARRAY',
                  exerciseId: props.id,
                  exerciseSelected: checked,
                });
              } else {
                dispatch?.({
                  type: 'ADD_EXERCISE_TO_LINK_ARRAY',
                  exerciseId: props.id,
                  exerciseSelected: checked,
                });
              }
            }}
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );

  const closeSingleExercise = (id: number) => {
    dispatch?.({
      type: 'REMOVE_EXERCISE_FROM_EDIT_ARRAY',
      exerciseId: id,
    });
  };

  const debounceUpdateVariationStructure = useDebouncedCallback(
    (exerciseUpdate, index) => {
      rehabNetworkCall.updateExerciseValue({
        maintenance: props.inMaintenance || props.exercise.maintenance === true,
        newExerciseDetails: exerciseUpdate,
        refetchSessionsAfterAction: false,
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
      });
      dispatch?.({
        type: 'UPDATE_EXERCISE_VARIATION_TYPE',
        exerciseId: props.id,
        sectionId: props.sectionId,
        variationIndex: index,
        variations: exerciseUpdate.variations,
      });
    },
    500
  );

  const debounceRemoveVariation = useDebouncedCallback((exerciseUpdate) => {
    rehabNetworkCall.updateExerciseValue({
      maintenance: props.inMaintenance || props.exercise.maintenance === true,
      newExerciseDetails: exerciseUpdate,
      refetchSessionsAfterAction: false,
      issueId: props.issueOccurrenceId,
      issueType: props.issueType,
    });
    dispatch?.({
      type: 'REMOVE_EXERCISE_VARIATION',
      exerciseId: props.id,
      sectionId: props.sectionId,
      variations: exerciseUpdate.variations,
    });
  }, 500);

  const debounceVariationValueUpdate = useDebouncedCallback(
    (exerciseUpdate, variationIndex, parameterIndex) => {
      dispatch?.({
        type: 'UPDATE_EXERCISE_VARIATION_PROPERTY',
        exerciseId: props.id,
        sectionId: props.sectionId,
        variationIndex,
        parameterIndex,
        exerciseParameters:
          exerciseUpdate.variations[variationIndex].parameters,
      });
      rehabNetworkCall.updateExerciseValue({
        maintenance: props.inMaintenance || props.exercise.maintenance === true,
        newExerciseDetails: exerciseUpdate,
        refetchSessionsAfterAction: false,
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
      });
    },
    500
  );

  const displayCloseExercise = () => {
    return (
      <div>
        <IconButton
          onClick={() => {
            closeSingleExercise(props.id);
          }}
          isDisabled={props.disabled}
          icon="icon-check"
          tabIndex={-1}
          isSmall
          isTransparent
        />
      </div>
    );
  };

  const addAnotherVariation = async () => {
    if (localDisable) {
      return;
    }
    setLocalDisable(true);
    const exerciseUpdate = {
      athlete_id: props.athleteId,
      exercise_template_id: props.exercise.exercise_template_id,
      exercise_instance_id: props.id,
      session_id: props.sessionId,
      section_id: props.sectionId,
      order_index: props.exercise.order_index,
      variations: localVariations,
      comment: localComment,
      previous_section_id: null,
      previous_session_id: null,
    };
    try {
      const defaultVariation =
        props.exercise.variations.length > 0
          ? props.exercise.variations[props.exercise.variations.length - 1]
          : await getRehabDefaultVariation(props.exercise.exercise_template_id);
      if (defaultVariation) {
        const currentVariations = localVariations.slice();
        const variationCopy = {
          ...defaultVariation,
          parameters: defaultVariation.parameters.slice(),
        };
        currentVariations.push(variationCopy);
        exerciseUpdate.variations = currentVariations;
        setLocalVariations(currentVariations);
        debounceUpdateVariationStructure(
          exerciseUpdate,
          exerciseUpdate.variations.length - 1
        );
        setCurrentFocusAction('NO_ACTION_NEEDED');
      }
    } catch (e) {
      dispatch?.({
        type: 'UPDATE_ACTION_STATUS',
        actionStatus: 'FAILURE',
        actionType: 'GET_DEFAULT_VARIATION',
      });
    }
  };
  const displayIconAddVariation = () => {
    if (props.exercise.variations.length >= 10) {
      return <div css={style.iconAddButton} />;
    }
    return (
      <div css={style.iconAddButton}>
        <IconButton
          icon="icon-add"
          isSmall
          isTransparent
          onClick={addAnotherVariation}
          type="textOnly"
          isDisabled={props.disabled || localDisable}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const displayExerciseEditItems = () => {
    const exerciseUpdate = {
      athlete_id: props.athleteId,
      exercise_template_id: props.exercise.exercise_template_id,
      exercise_instance_id: props.id,
      session_id: props.sessionId,
      section_id: props.sectionId,
      order_index: props.exercise.order_index,
      variations: localVariations,
      comment: localComment,
      previous_section_id: null,
      previous_session_id: null,
    };
    return localVariations.map((variation, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div css={style.variationColumn} key={`variationGroup_${index}`}>
        <RehabVariationsEdit
          forwardedRef={inputsRef[index]}
          rehabContext={props.rehabContext}
          variation={variation}
          exercise={props.exercise}
          disabled={props.disabled || localDisable}
          changeVariationType={(
            newVariation: VariationParameters,
            position: number
          ) => {
            setCurrentFocusAction('NO_ACTION_NEEDED');
            setLocalVariations((prevState) => {
              const rehabVariations = prevState.slice();
              const variationCopy = { ...newVariation };
              variationCopy.value =
                rehabVariations[index].parameters[position].value;
              rehabVariations[index].parameters[position] = variationCopy; // variationCopy is a deep copy should should be fine
              exerciseUpdate.variations = rehabVariations;
              debounceUpdateVariationStructure(exerciseUpdate, index);
              // focus on the input field for the item they changed variation

              /* if the user has edit parameter 3 of the last variation we focus on the comment textarea */
              if (
                index === rehabVariations.length - 1 &&
                variationCopy.param_key === 'parameter3'
              ) {
                textAreaRef.current?.focus();
                return rehabVariations;
              }

              // depending the parameter the user updates we then focus them on the next input
              switch (variationCopy.param_key) {
                case 'parameter2': {
                  inputsRef[index].parameter3.current?.focus();
                  break;
                }
                case 'parameter3': {
                  inputsRef[index + 1].parameter1.current?.focus();
                  break;
                }
                default: {
                  break;
                }
              }

              return rehabVariations;
            });
          }}
          updateExerciseVariationProperty={(value, propertyKey) => {
            setCurrentFocusAction('NO_ACTION_NEEDED');
            setLocalVariations((prevState) => {
              const rehabVariations = prevState.slice();
              const rehabUpdateIndex = rehabVariations[
                index
              ].parameters.findIndex((param) => param.key === propertyKey);
              const copiedVariation = _cloneDeep(rehabVariations[index]);
              copiedVariation.parameters[rehabUpdateIndex].value = value;
              rehabVariations[index] = copiedVariation;

              exerciseUpdate.variations = rehabVariations;
              debounceVariationValueUpdate(
                exerciseUpdate,
                index,
                rehabUpdateIndex
              );
              return rehabVariations;
            });
          }}
          onDeleteExerciseVariation={() => {
            setLocalDisable(true);
            setCurrentFocusAction('DELETE_EXERCISE_VARIATION');
            setLocalVariations((prevState) => {
              const rehabVariations = prevState.slice();
              rehabVariations.splice(index, 1);
              exerciseUpdate.variations = rehabVariations;
              debounceRemoveVariation(exerciseUpdate);
              return rehabVariations;
            });
          }}
        />
      </div>
    ));
  };

  return !itemIsInEditMode ? (
    <div
      data-rehab_item_id={props.id}
      data-rehab_item_mode="Item"
      data-testid="Rehab|Item"
      className="rehabItemDisplay"
      ref={props.isTouchInput ? null : setNodeRef}
      {...(!props.isTouchInput && attributes)}
      {...(!props.isTouchInput && listeners)}
    >
      {window.featureFlags['rehab-groups'] &&
        !!props.exercise?.tags?.length && (
          <div
            data-testid="Rehab|GroupContainer"
            css={style.rehabGroupContainer}
            aria-label="Group indicator container"
          >
            <span
              key={`group-${props.exercise.tags[0].id}`}
              css={[
                style.rehabGroup,
                { backgroundColor: props.exercise.tags[0].theme_colour },
              ]}
              aria-label={`Group indicator for ${props.exercise.tags[0].name} items`}
            />
          </div>
        )}
      <div
        css={() => {
          const additionalStyles = [];

          if (props.rehabCopyMode || props.linkToMode) {
            additionalStyles.push(copyTransformStyle);
          }

          if (props.draggingNewExercise) {
            additionalStyles.push(style.draggingNewExercise);
          }

          if (
            window.featureFlags['rehab-groups'] &&
            props.exercise.tags?.length
          ) {
            additionalStyles.push({ marginLeft: '5px' });
          }

          return [style.rehabItemDisplay, transformStyle, additionalStyles];
        }}
      >
        <div css={style.titleContainer}>
          {props.isTouchInput && (
            <div
              className="icon-drag-handle"
              css={style.dragHandle}
              data-testid="Rehab|DragHandle"
              ref={props.isTouchInput ? setNodeRef : null}
              {...(props.isTouchInput && attributes)}
              {...(props.isTouchInput && listeners)}
            />
          )}
          <h2 css={style.titleText}>{props.exercise.exercise_name}</h2>
          {props.rehabDayMode !== '1_DAY' && displayActionButtons()}
        </div>
        <div css={style.variationsColumns}>
          {props.exercise.variations?.map((variation, index) =>
            displayVariationDetails(variation, index)
          )}
        </div>
        <div css={style.comment}>
          <EllipsisTooltipText
            content={props.exercise.comment || ''}
            displayEllipsisWidth={100}
            displayEllipsisWidthUnit="%"
            styles={{
              wrapper: css`
                display: initial;
                flex: 1;
                min-width: 0;
                overflow: hidden;
              `,
              content: css`
                display: block;
              `,
            }}
          />
        </div>
        {props.rehabDayMode === '1_DAY' && displayActionButtons()}
      </div>
    </div>
  ) : (
    <div
      data-rehab_item_id={props.id}
      data-rehab_item_mode="EditItem"
      data-testid="Rehab|EditItem"
      className="rehabItemDisplay"
      css={[transformStyle, style.rehabItemDisplay, style.rehabEditItem]}
      ref={(el: HTMLDivElement) => {
        setNodeRef(el);
      }}
      {...editAttributes}
      {...listeners}
    >
      <div css={style.editHeader}>
        <h2 css={style.titleText}>{props.exercise.exercise_name}</h2>
        {props.rehabDayMode !== '1_DAY' && displayCloseExercise()}
      </div>
      <div css={style.variationColumn}>
        {Object.keys(props.rehabContext.organisationVariations).length > 0
          ? displayExerciseEditItems()
          : null}
      </div>
      {props.rehabDayMode === '1_DAY' && displayIconAddVariation()}
      <div css={style.comment}>
        <Textarea
          label=""
          placeholder={i18n.t('Comment')}
          value={localComment || ''}
          onChange={(content) => {
            setLocalComment(content);
            debounceCommentUpdate(content);
          }}
          textAreaRef={textAreaRef}
          kitmanDesignSystem
        />
        {props.rehabDayMode !== '1_DAY'
          ? displayIconAddVariation()
          : displayCloseExercise()}
      </div>
      {displayActionButtons()}
    </div>
  );
};
export default RehabItem;
