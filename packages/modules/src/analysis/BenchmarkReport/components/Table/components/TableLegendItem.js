// @flow
import { dataGridLegendStyles } from '../styles';

type Props = {
  strokeColor: string,
  fill: string,
  labelText: string,
  resultTypeLabel: string,
};

const TableLegendItem = (props: Props) => {
  return (
    <>
      <svg height={10} width={10} title={props.resultTypeLabel}>
        <circle
          cx={5}
          cy={5}
          r={4}
          stroke={props.strokeColor}
          strokeWidth={1}
          fill={props.fill}
        />
      </svg>
      <span css={dataGridLegendStyles.legendItemText}>{props.labelText}</span>
    </>
  );
};

export default TableLegendItem;
