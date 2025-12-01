// @flow
import { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { IconButton } from '@kitman/components';
import { SCROLL_BAR_HEIGHT } from '../constants';

import type { Scroll } from '../types';

/**
 * This util will take the current position of the handle, the delta the handle has moved
 * and then it will return a calculated new position.
 * It will use the chart width and the scroll handle width to make sure that the
 * scroll handle will not exceed the bounds of the chart
 *
 * @param {number} currentPosition current position of the scroll handle
 * @param {number} delta number of pixels the scroll handle has moved
 * @param {number} chartWidth width of the chart or scroll track
 * @param {number} handleWidth width of the handle
 * @returns new position of the chart
 */
export const addDelta = (
  currentPosition: number,
  delta: number,
  chartWidth: number,
  handleWidth: number
): number => {
  const minHandlePosition = 0;
  const maxHandlePosition = chartWidth - handleWidth;

  let newPosition = currentPosition + delta;

  if (newPosition < minHandlePosition) {
    newPosition = 0;
  }

  if (newPosition > maxHandlePosition) {
    newPosition = maxHandlePosition;
  }

  return newPosition;
};

/**
 * There are three components which make up the scroll controls and
 * the root component <ScrollControl /> is exported
 *
 * It uses https://dndkit.com/ to handle the events of a user clicking and dragging
 * the handle.
 *
 * <ScrollControl> // This has the zoom button and track
 *   <ScrollTrack> // Holds the dnd context and drag events
 *     <ScrollHandle /> // has the handle nad talks to the dnd hook
 *   </ScrollTrack>
 * </ScrollControl>
 */

type ScrollHandleProps = {
  position: number,
  chartWidth: number,
  handleWidth: number,
};

function Handle(props: ScrollHandleProps) {
  const { attributes, transform, setNodeRef, listeners } = useDraggable({
    id: 'chart-scroll-item',
  });
  const handlePosition = addDelta(
    props.position,
    transform?.x || 0,
    props.chartWidth,
    props.handleWidth
  );

  return (
    <div
      ref={setNodeRef}
      css={css`
        transform: translate3d(${handlePosition}px, 0px, 0);
        width: ${props.handleWidth}px;
        height: ${SCROLL_BAR_HEIGHT}px;
        background-color: ${colors.cool_mid_grey};
        border-radius: 4px;
        cursor: pointer;
      `}
      {...attributes}
      {...listeners}
    />
  );
}

type ScrollTrackProps = {
  chartWidth: number,
  numItems: number,
  maxLabelWidth: number,
  onScrollMove: (startIndex: number, endIndex: number) => void,
};

const ScrollTrack = (props: ScrollTrackProps) => {
  const [position, setPosition] = useState(0);

  const actualChartWidth = props.numItems * props.maxLabelWidth;
  const chartRatio =
    actualChartWidth <= props.chartWidth
      ? 1
      : props.chartWidth / actualChartWidth;
  const handleWidth = props.chartWidth * chartRatio;

  return (
    <DndContext
      // use the onDragMove to calculate the start and end index and then
      // talks the parent through the onScrollMove callback and is called
      // while the user is interacting with it
      onDragMove={({ delta }) => {
        const newPosition = addDelta(
          position,
          delta.x,
          props.chartWidth,
          handleWidth
        );

        const startIndex = Math.floor(
          (newPosition / props.chartWidth) * props.numItems
        );
        const itemsOnChart = Math.ceil(props.chartWidth / props.maxLabelWidth);

        const endIndex = startIndex + itemsOnChart;

        props.onScrollMove(startIndex, endIndex);
      }}
      // use the onDragEnd to store the position of the handle after
      // a user has interacted with the handle and moved away
      onDragEnd={({ delta }) => {
        setPosition((pos) => {
          return addDelta(pos, delta.x, props.chartWidth, handleWidth);
        });
      }}
    >
      <Handle
        position={position}
        handleWidth={handleWidth}
        chartWidth={props.chartWidth}
      />
    </DndContext>
  );
};

type ScrollControlProps = {
  numItems: number,
  width: number,
  maxLabelWidth: number,
  scroll: Scroll,
  setScroll: Function,
};
const ScrollControl = (props: ScrollControlProps) => {
  return (
    <>
      <div
        data-testid="XYChart|ScrollControls|Zoom"
        css={css`
          position: absolute;
          top: 48px;
          right: 48px;

          .iconButton {
            font-size: 16px;
            height: 30px;
            width: 30px;
            min-width: 30px;

            &::before {
              font-size: 16px;
            }
          }
        `}
      >
        <IconButton
          icon={props.scroll.isActive ? 'icon-minus' : 'icon-search-field'}
          onClick={() => {
            props.setScroll({
              startIndex: 0,
              endIndex: Math.ceil(props.width / props.maxLabelWidth),
              isActive: !props.scroll.isActive,
            });
          }}
          isDarkIcon
        />
      </div>
      {props.scroll.isActive && (
        <ScrollTrack
          numItems={props.numItems}
          chartWidth={props.width}
          maxLabelWidth={props.maxLabelWidth}
          onScrollMove={(startIndex, endIndex) => {
            props.setScroll((scr) => ({
              ...scr,
              startIndex,
              endIndex,
            }));
          }}
        />
      )}
    </>
  );
};

export default ScrollControl;
