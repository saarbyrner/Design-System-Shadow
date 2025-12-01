// @flow
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { ChartLegend } from '@kitman/components';
import type { LegendItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  legendList: Array<{
    label: ?string,
    items: Array<LegendItem>,
  }>,
  onClick: Function,
  condensed?: boolean,
  toggleable?: boolean,
};

const GraphLegendList = (props: I18nProps<Props>) => {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  return (
    <div
      className={classNames('graphLegendList', {
        'graphLegendList--toggleable': props.toggleable,
        'graphLegendList--open': isLegendOpen,
        'graphLegendList--close': !isLegendOpen,
      })}
    >
      <div
        className="graphLegendList__toggleButton"
        onClick={() => setIsLegendOpen(!isLegendOpen)}
      >
        {props.t('Legend')}
      </div>
      <div className="graphLegendList__list">
        {props.legendList.map((legend, index) => (
          <div key={index} className="graphLegendList__legend">
            <ChartLegend
              label={legend.label}
              items={legend.items}
              onClick={(legendItem) => props.onClick(index, legendItem)}
              condensed={props.condensed}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GraphLegendListTranslated = withNamespaces()(GraphLegendList);
export default GraphLegendList;
