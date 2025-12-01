// @flow
import classNames from 'classnames';

export type LegendItem =
  | {
      id: string,
      type: 'serie',
      name: string,
      colour: string,
      isDisabled: boolean,
      serieIndex: number,
    }
  | {
      id: string,
      type: 'plotline',
      name: string,
      colour: string,
      isDisabled: boolean,
      plotlineId: string,
    }
  | {
      id: string,
      type: 'stackedSerie',
      name: string,
      colour: string,
      isDisabled: boolean,
      seriesIndexes: Array<number>,
    };

type Props = {
  items: Array<LegendItem>,
  label?: ?string,
  onClick: Function,
  condensed?: boolean,
};

const ChartLegend = (props: Props) => {
  // label for the legend if provided
  const label = props.label ? (
    <p data-testid="ChartLegend|Label" className="chartLegend__label">
      {props.label}
    </p>
  ) : null;

  const buildLegendIcon = (itemColor, itemType) => {
    if (itemType === 'plotline') {
      return (
        <div
          data-testid="ChartLegend|Dash"
          className="chartLegend__dash"
          style={
            // We use a border instead of a background in order to print the color
            { border: `1px dashed ${itemColor}` }
          }
        />
      );
    }

    return (
      <div
        data-testid="ChartLegend|Circle"
        className="chartLegend__circle"
        style={
          // We use a border instead of a background in order to print the color
          { border: `4px solid ${itemColor}` }
        }
      />
    );
  };

  const buildItem = (item) => {
    const itemClass = classNames('chartLegend__item', {
      'chartLegend__item--disabled': item.isDisabled,
    });

    const itemColor = item.isDisabled ? '#DEDEDE' : item.colour || '#00468F';

    return (
      <li
        key={item.id}
        className={itemClass}
        onClick={() => {
          props.onClick(item);
        }}
      >
        {buildLegendIcon(itemColor, item.type)}
        {item.name}
      </li>
    );
  };

  // legend items
  const buildItemList = () => props.items.map((item) => buildItem(item));

  const itemList = props.items.length > 0 ? buildItemList() : null;

  return (
    <div
      className={classNames('chartLegend', {
        'chartLegend--condensed': props.condensed,
      })}
    >
      <ul>
        {label}
        {itemList}
      </ul>
    </div>
  );
};

export default ChartLegend;
