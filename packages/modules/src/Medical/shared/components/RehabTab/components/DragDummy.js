// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

type Props = {
  title: string,
  amountBeingDragged: ?number,
};

const style = {
  dragDummy: css`
    position: relative;
    background: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    padding: 5px 5px 0px 5px;
    width: fit-content;
    max-width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    cursor: grabbing;
    :active {
      cursor: grabbing;
    }
  `,
  titleText: css`
    font-family: Open Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    padding-bottom: 6px;
    margin: 0px;
    line-height: 18px;
  `,
  numberCircle: css`
    border-radius: 50%;
    text-align: center;
    position: absolute;
    top: -20px;
    right: -20px;
    z-index: 1;
  `,
};

const DragDummy = (props: Props) => {
  return (
    <>
      <div data-testid="Rehab|DragDummy" css={style.dragDummy}>
        {props.amountBeingDragged && (
          <span
            css={style.numberCircle}
            className="profileWidgetModal__smallNumberCircle"
          >
            {props.amountBeingDragged}
          </span>
        )}
        <h2 css={style.titleText}>{props.title}</h2>
      </div>
    </>
  );
};
export default DragDummy;
