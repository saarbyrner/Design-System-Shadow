// @flow
import { useState, useMemo, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import i18n from '@kitman/common/src/utils/i18n';
import { InputText, IconButton, Checkbox } from '@kitman/components';
import type { Exercise } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';
import getStyle from './style';
import rehabNetworkActions from '../../RehabContext/rehabNetworkActions';
import { useRehabDispatch } from '../../RehabContext';
import type {
  RehabDayMode,
  ExerciseReasonUpdateDetails,
  ExerciseCreationStructure,
} from '../../types';
import type { RehabContextType } from '../../RehabContext/types';
import type { IssueType } from '../../../../types';

type Props = {
  id?: number, // No id when creating new reason
  athleteId: number,
  sessionId: number,
  sectionId: number,
  issueOccurrenceId?: number,
  issueType?: IssueType,
  sessionStartTime: ?string,
  onDoneAddingReason: Function,
  exercise?: Exercise,
  isTouchInput: boolean,
  inMaintenance: boolean,
  isInEditMode: boolean,
  readOnly: boolean,
  disabled: boolean,
  hasManagePermission: boolean,
  rehabCopyMode: boolean,
  linkToMode: boolean,
  rehabDayMode: RehabDayMode,
  rehabContext: RehabContextType,
  callDeleteExercise: Function,
};

const RehabItemReason = (props: Props) => {
  const [requestPending, setRequestPending] = useState(false);
  const [localDisable, setLocalDisable] = useState(props.disabled || false);
  const [itemIsChecked, setItemIsChecked] = useState(false);
  const [itemIsInEditMode, setItemIsInEditMode] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    props.exercise?.reason ? props.exercise?.reason : ''
  );
  const { dispatch, copyExerciseIds, editExerciseIds, linkExerciseIds } =
    useRehabDispatch();
  const rehabNetworkCall = rehabNetworkActions(dispatch);

  useEffect(() => {
    setItemIsChecked(
      copyExerciseIds?.includes(props.exercise?.id) ||
        linkExerciseIds?.includes(props.exercise?.id)
    );
  }, [props.exercise?.id, copyExerciseIds, linkExerciseIds]);

  useEffect(() => {
    setItemIsInEditMode(!props.readOnly && editExerciseIds?.includes(props.id));
  }, [props.id, editExerciseIds, props.readOnly]);

  const reasonCharacterLimit = 40;
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

  useEffect(() => {
    setLocalDisable(props.disabled || false);
  }, [props.disabled]);

  const style = useMemo(
    () =>
      getStyle(
        props.rehabDayMode === '1_DAY',
        props.rehabCopyMode,
        props.linkToMode,
        itemIsInEditMode,
        isDragging
      ),
    [
      props.rehabDayMode,
      props.rehabCopyMode,
      props.linkToMode,
      itemIsInEditMode,
      isDragging,
    ]
  );

  const shouldRenderActionButtons =
    props.hasManagePermission &&
    !props.rehabCopyMode &&
    !itemIsInEditMode &&
    !props.isInEditMode &&
    !props.linkToMode;

  const displayActionButtons = () => (
    <div css={style.actionButtons} className="rehabActionButtons">
      {shouldRenderActionButtons && (
        <div data-testid="action-buttons" css={style.actionButton}>
          <IconButton
            onClick={() => {
              if (props.id)
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
      {(props.rehabCopyMode || props.linkToMode) && (
        <div css={style.selectCheckbox}>
          <Checkbox
            data-testid="RehabSection|CopyItem"
            id="copy-section"
            name="copy-section"
            isChecked={itemIsChecked}
            toggle={({ checked }) => {
              if (!props.id) {
                return;
              }
              if (props.rehabCopyMode) {
                dispatch?.({
                  type: 'ADD_EXERCISE_TO_COPY_ARRAY',
                  exerciseId: props.id,
                  exerciseSelected: checked,
                });
              } else if (props.linkToMode) {
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

  const createReasonTemplate: ExerciseCreationStructure = {
    reason: inputValue,
    section_id: props.sectionId,
    order_index: 1, // Create at first position in columns ( BE is not zero indexed )
    comment: props.exercise?.comment,
  };

  const isPlaceholderSession = props.sessionId < 0;

  const handleAddNewReasonHeader = () => {
    setRequestPending(true);
    rehabNetworkCall
      .addToSession({
        data: {
          athleteId: props.athleteId,
          issueId: props.issueOccurrenceId,
          issueType: props.issueType,
          exerciseInstances: [createReasonTemplate],
          makeExerciseInstancesEditable: false,
          placeholderSessionId: isPlaceholderSession ? props.sessionId : null,
          sessionId: isPlaceholderSession ? null : props.sessionId,
          sessionDate: isPlaceholderSession ? props.sessionStartTime : null,
          sectionId: isPlaceholderSession ? null : props.sectionId,
          maintenance: props.inMaintenance,
        },
      })
      .then(() => {
        props.onDoneAddingReason();
        setRequestPending(false);
      });
    setInputValue('');
    dispatch?.({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });
    setItemIsInEditMode(false);
  };

  const handleOnUpdate = () => {
    const updatedReason: ExerciseReasonUpdateDetails = {
      athlete_id: props.athleteId,
      exercise_instance_id: props.id,
      session_id: props.sessionId,
      section_id: props.sectionId,
      order_index: props.exercise?.order_index || 1,
      previous_section_id: null, // As we are not moving the reason element we don't need to supply
      previous_session_id: null, // As we are not moving the reason element we don't need to supply
      reason: inputValue,
    };
    if (props.sessionStartTime) {
      updatedReason.session_date = props.sessionStartTime;
    }

    setRequestPending(true);

    rehabNetworkCall
      .updateExerciseValue({
        maintenance: props.inMaintenance,
        newExerciseDetails: updatedReason,
        refetchSessionsAfterAction: false,
        issueId: props.issueOccurrenceId,
        issueType: props.issueType,
      })
      .then(() => {
        props.onDoneAddingReason();
        setRequestPending(false);
      });
    dispatch?.({
      type: 'UPDATE_EXERCISE_PROPERTY',
      // $FlowIgnore[incompatible-call] id will be present for an update
      exerciseId: props.id,
      sectionId: props.sectionId,
      propertyKey: 'reason',
      value: updatedReason.reason,
    });

    dispatch?.({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });
    props.onDoneAddingReason();
    setItemIsInEditMode(false);
  };

  const resetToDefaultMode = () => {
    dispatch?.({
      type: 'CLEAR_EDITING_EXERCISE_IDS',
    });
    setInputValue(props.exercise?.reason || '');
    props.onDoneAddingReason();
  };

  const handleKeyPressed = (key: string) => {
    if (key === 'Enter') {
      const reasonIsReadyToSave = !requestPending && inputValue.length > 0;
      if (props.isInEditMode && reasonIsReadyToSave) {
        return handleAddNewReasonHeader();
      }
      if (reasonIsReadyToSave) {
        return handleOnUpdate();
      }
    }
    if (key === 'Escape') {
      resetToDefaultMode();
    }
    return null;
  };

  // Display create/edit reason component
  // props.isInEditMode = prop used to render ui for adding a new reason
  // itemIsInEditMode set by user action
  if (props.isInEditMode || itemIsInEditMode) {
    return (
      <div
        css={style.addEditItemreasonContainer}
        data-testid="EditAndAddRehabItemReason"
        aria-disabled="true"
      >
        <InputText
          value={inputValue || ''}
          onValidation={(input) => setInputValue(input.value)}
          required={false}
          placeholder={i18n.t('Reason')}
          autoFocus
          customInputStyles={style.reasonInputStyles}
          handleKeyDown={(key) => handleKeyPressed(key)}
          maxLength={reasonCharacterLimit}
          showRemainingChars={false}
          showCharsLimitReached={false}
        />
        <IconButton
          icon="icon-check"
          isSmall
          isBorderless
          isTransparent
          isDisabled={requestPending || !inputValue.length}
          onClick={
            props.isInEditMode ? handleAddNewReasonHeader : handleOnUpdate
          }
          data-testid="SaveReasonButton"
        />
        <IconButton
          icon={itemIsInEditMode ? 'icon-close' : 'icon-bin-new'}
          isSmall
          isBorderless
          isTransparent
          isDisabled={requestPending}
          onClick={
            itemIsInEditMode
              ? () => resetToDefaultMode()
              : props.onDoneAddingReason
          }
        />
      </div>
    );
  }

  // Display reason
  if (props.exercise) {
    return (
      <div
        data-rehab_item_id={props.exercise.id}
        data-rehab_item_mode="Item"
        data-testid="RehabItemReason|Header"
        className="rehabItemDisplay"
        ref={props.isTouchInput ? null : setNodeRef}
        {...(!props.isTouchInput && attributes)}
        {...(!props.isTouchInput && listeners)}
      >
        <div
          css={() => {
            const additionalStyles = [];

            if (props.rehabCopyMode || props.linkToMode) {
              additionalStyles.push(copyTransformStyle);
            }

            return [style.rehabItemReason, transformStyle, additionalStyles];
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
            <span css={style.rehabItemReasonText}>{props.exercise.reason}</span>
            {props.rehabDayMode !== '1_DAY' && displayActionButtons()}
          </div>
          {props.rehabDayMode === '1_DAY' && displayActionButtons()}
        </div>
      </div>
    );
  }
  return <></>;
};
export default RehabItemReason;
