// @flow
import type { Node } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { css } from '@emotion/react';
import RehabItem from '../RehabItem';
import type { RehabDayMode } from '../../types';
import { useRehabExerciseVariations } from '../../RehabContext';
import RehabItemReason from '../RehabItemReason/RehabItemReason';
import type { IssueType } from '../../../../types';

type Props = {
  id: number,
  sessionId: number,
  sessionStartTime: ?string,
  exercises: any,
  disabled: boolean,
  rehabCopyMode: boolean,
  rehabGroupMode: boolean,
  displayReasonInput: boolean,
  issueOccurrenceId?: number,
  issueType?: IssueType,
  athleteId: number,
  inMaintenance: boolean,
  linkToMode: boolean,
  readOnlyExercises: boolean,
  hasManagePermission: boolean,
  rehabDayMode: RehabDayMode,
  customFooter?: ?Node,
  callDeleteExercise: Function,
  onDoneAddingReason: Function,
  isTouchInput: boolean, // Render a touch handle for mobile devices so dragging does not interfere with scrolling
  hiddenFilters: ?Array<string>,
};

const style = {
  DroppableContainer: css`
    min-height: inherit;
    height: 100%;

    &:focus-within,
    &:hover {
      .rehabFooterAdd {
        display: block;
      }
    }
  `,

  AddRehabButton: css`
    margin-top: 10px;
    display: none;
  `,

  ContainerFooter: css`
    padding: 4px;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    display: flex;
  `,
};

const ExerciseContainer = (props: Props) => {
  const { id, exercises } = props;

  const { setNodeRef } = useDroppable({
    id,
    disabled: props.disabled,
    data: {
      sectionId: props.id,
      sessionId: props.sessionId,
    },
  });

  const exerciseVariationsContext = useRehabExerciseVariations();
  return (
    <div
      data-testid="Rehab|DroppableContainer"
      data-rehab_container_type="section"
      ref={setNodeRef}
      css={style.DroppableContainer}
    >
      {props.displayReasonInput &&
        window.featureFlags['rehab-maintenance-reason'] && (
          <RehabItemReason
            isInEditMode
            athleteId={props.athleteId}
            sessionId={props.sessionId}
            sectionId={props.id}
            issueOccurrenceId={props.issueOccurrenceId}
            issueType={props.issueType}
            sessionStartTime={props.sessionStartTime}
            inMaintenance={props.inMaintenance}
            onDoneAddingReason={props.onDoneAddingReason}
            disabled={props.disabled}
            readOnly={props.readOnlyExercises}
            rehabContext={exerciseVariationsContext}
            rehabCopyMode={props.rehabCopyMode}
            rehabGroupMode={props.rehabGroupMode}
            hasManagePermission={props.hasManagePermission}
            linkToMode={props.linkToMode}
            rehabDayMode={props.rehabDayMode}
            callDeleteExercise={props.callDeleteExercise}
            isTouchInput={props.isTouchInput}
          />
        )}
      {exercises.map((exercise) => {
        if (
          exercise.reason &&
          window.featureFlags['rehab-maintenance-reason']
        ) {
          return (
            <RehabItemReason
              isInEditMode={false}
              exercise={exercise}
              key={exercise.id}
              id={exercise.id}
              issueOccurrenceId={props.issueOccurrenceId}
              issueType={props.issueType}
              draggingNewExercise={exercise.type === 'exerciseTemplate'}
              athleteId={props.athleteId}
              sessionId={props.sessionId}
              sessionStartTime={props.sessionStartTime}
              sectionId={props.id}
              inMaintenance={props.inMaintenance}
              onDoneAddingReason={props.onDoneAddingReason}
              disabled={props.disabled}
              readOnly={props.readOnlyExercises}
              rehabContext={exerciseVariationsContext}
              rehabCopyMode={props.rehabCopyMode}
              rehabGroupMode={props.rehabGroupMode}
              hasManagePermission={props.hasManagePermission}
              linkToMode={props.linkToMode}
              rehabDayMode={props.rehabDayMode}
              callDeleteExercise={props.callDeleteExercise}
              isTouchInput={props.isTouchInput}
            />
          );
        }
        if (!exercise.reason) {
          return (
            <RehabItem
              key={exercise.id}
              id={exercise.id}
              issueOccurrenceId={props.issueOccurrenceId}
              issueType={props.issueType}
              draggingNewExercise={exercise.type === 'exerciseTemplate'}
              sessionId={props.sessionId}
              sectionId={props.id}
              exercise={exercise}
              athleteId={props.athleteId}
              inMaintenance={props.inMaintenance}
              disabled={props.disabled}
              readOnly={props.readOnlyExercises}
              rehabContext={exerciseVariationsContext}
              rehabCopyMode={props.rehabCopyMode}
              rehabGroupMode={props.rehabGroupMode}
              hasManagePermission={props.hasManagePermission}
              linkToMode={props.linkToMode}
              rehabDayMode={props.rehabDayMode}
              callDeleteExercise={props.callDeleteExercise}
              isTouchInput={props.isTouchInput}
              hiddenFilters={props.hiddenFilters}
            />
          );
        }
        return null;
      })}
      {!props.rehabCopyMode && !props.linkToMode && (
        <div data-testid="Rehab|ContainerFooter" css={style.ContainerFooter}>
          {props.customFooter}
        </div>
      )}
    </div>
  );
};

export default ExerciseContainer;
