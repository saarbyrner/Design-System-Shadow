// @flow
import { useContext } from 'react';
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { css } from '@emotion/react';
import classNames from 'classnames';
import type { PositionData } from '@kitman/common/src/types/PitchView';
import FormationEditorContext from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import { actionTypes } from '../reducer';
import styles from './styles';

type EditablePitchPositionProps = {
  cellId: string,
  style?: any,
  positionData?: PositionData,
};

const EditablePitchPosition = ({
  cellId,
  positionData,
  style = {},
}: EditablePitchPositionProps) => {
  const { state, dispatch } = useContext(FormationEditorContext);

  const droppable = useDroppable({
    id: cellId,
    data: positionData,
    disabled: !!positionData,
  });
  const draggable = useDraggable({
    id: cellId,
    data: positionData,
    disabled: cellId === '0_5' && !positionData,
  });

  const isActive = cellId === state.activeCoordinateId;

  // Monitor drag and drop events that happen on the parent `DndContext` provider
  useDndMonitor({
    onDragStart(event) {
      if (
        cellId === event.active.id &&
        event.active.id === state.activeCoordinateId
      ) {
        // deselect position on second click
        dispatch({
          type: actionTypes.SET_ACTIVE_COORDINATE_ID,
          payload: undefined,
        });
      } else if (cellId === event.active.id) {
        // select position
        dispatch({
          type: actionTypes.SET_ACTIVE_COORDINATE_ID,
          payload: event.active.id,
        });
      }
    },
    onDragEnd(event) {
      // when dropping a position to another one except its initial position
      if (
        event.over?.id &&
        event.active?.id &&
        cellId === event.active.id &&
        event.active.id !== event.over.id
      ) {
        const updatedFormationCoordinates = {
          ...state.formationCoordinatesCopy,
        };
        const previousPosition = updatedFormationCoordinates[event.active.id];
        const newPosition = {
          ...updatedFormationCoordinates[event.active.id],
          x: +event.over.id[0],
          y: +event.over.id[2],
          dirty: true, // mark change as unsaved
        };
        updatedFormationCoordinates[event.over.id] = newPosition;
        dispatch({
          type: actionTypes.SET_UPDATE_LIST,
          payload: {
            ...state.updateList,
            undo: [
              ...state.updateList.undo,
              {
                from: previousPosition,
                to: newPosition,
              },
            ],
          },
        });

        delete updatedFormationCoordinates[event.active.id];
        dispatch({
          type: actionTypes.SET_FORMATION_COORDINATES_COPY,
          payload: updatedFormationCoordinates,
        });
        dispatch({
          type: actionTypes.SET_ACTIVE_COORDINATE_ID,
          payload: event.over.id,
        });
      }
    },
  });

  const cellSize = state.field.cellSize;
  const isUnusedPosition = !positionData;

  const wrapperStyle = draggable.transform
    ? css`
        transform: translate3d(
          ${draggable.transform.x}px,
          ${draggable.transform.y}px,
          0
        );
      `
    : undefined;

  const renderPosition = () => {
    return (
      <div
        ref={draggable.setNodeRef}
        css={[
          css`
            position: relative;
            cursor: pointer;
          `,
          wrapperStyle,
          draggable.isDragging && styles.dragging,
        ]}
        {...draggable.attributes}
        {...draggable.listeners}
      >
        <div
          className={classNames(
            isActive && 'selected',
            state.highlightPositionId === positionData?.position?.id &&
              'highlighted'
          )}
          css={[styles.position(cellSize), style]}
        />
        <div
          css={[
            styles.positionLabel(cellSize),
            styles.positionAbbreviationContainer(cellSize),
          ]}
        >
          <p
            css={styles.positionAbbreviation}
            className={isActive && 'selected'}
          >
            {positionData?.position?.abbreviation}
            {window.featureFlags['show-position-view-ids'] && (
              <b style={styles.positionViewId}>
                {'\n'}
                {positionData?.id}
              </b>
            )}
          </p>
        </div>
      </div>
    );
  };

  const renderUnusedPosition = () => {
    return <div css={[styles.unusedPosition(cellSize), style]} />;
  };

  return (
    <div ref={droppable.setNodeRef} css={styles.wrapper}>
      {isUnusedPosition ? renderUnusedPosition() : renderPosition()}
    </div>
  );
};

export default EditablePitchPosition;
