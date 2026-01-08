// @flow
import { css } from '@emotion/react';
import useFocusRef from './useFocusRef';

const cellExpandStyle = css`
  /* needed on chrome */
  float: right;
  float: inline-end;
  display: table;
  block-size: 100%;

  > span {
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }
`;

interface CellExpanderFormatterProps {
  isCellSelected: boolean;
  expanded: boolean;
  onCellExpand: () => void;
}

const CellExpanderFormatter = ({
  isCellSelected,
  expanded,
  onCellExpand,
}: CellExpanderFormatterProps) => {
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  function handleKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onCellExpand();
    }
  }
  return (
    <div className={cellExpandStyle}>
      <span onClick={onCellExpand} onKeyDown={handleKeyDown}>
        <span
          ref={ref}
          tabIndex={tabIndex}
          className={`accordion__icon ${expanded ? 'icon-up' : 'icon-down'}`}
        />
      </span>
    </div>
  );
};

export default CellExpanderFormatter;
