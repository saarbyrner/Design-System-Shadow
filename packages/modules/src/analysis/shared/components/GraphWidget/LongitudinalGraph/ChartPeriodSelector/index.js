// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import { TrackEvent } from '@kitman/common/src/utils';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AggregationPeriod } from '../../../../types';

type Props = {
  period: AggregationPeriod,
  onChange: Function,
  condensed?: boolean,
};

const ChartPeriodSelector = (props: I18nProps<Props>) => {
  const getBtnText = () => {
    if (props.period === 'day') {
      return props.t('Day');
    }
    if (props.period === 'week') {
      return props.t('Week');
    }
    if (props.period === 'month') {
      return props.t('Month');
    }
    return '';
  };

  const getCondensedPeriodSelector = () => {
    return (
      <TextButton
        size="extraSmall"
        text={getBtnText()}
        onClick={() => {
          if (props.period === 'day') {
            props.onChange('week');
            TrackEvent('Graph Builder', 'Click', 'Toggle Week');
          }
          if (props.period === 'week') {
            props.onChange('month');
            TrackEvent('Graph Builder', 'Click', 'Toggle Month');
          }
          if (props.period === 'month') {
            props.onChange('day');
            TrackEvent('Graph Builder', 'Click', 'Toggle Day');
          }
        }}
      />
    );
  };

  const getDefaultPeriodSelector = () => {
    return (
      <div className="btn-group">
        <button
          type="button"
          className={classNames('btn btn-primary', {
            active: props.period === 'day',
          })}
          onClick={() => {
            props.onChange('day');
            TrackEvent('Graph Builder', 'Click', 'Toggle Day');
          }}
        >
          {props.t('Day')}
        </button>
        <button
          type="button"
          className={classNames('btn btn-primary', {
            active: props.period === 'week',
          })}
          onClick={() => {
            props.onChange('week');
            TrackEvent('Graph Builder', 'Click', 'Toggle Week');
          }}
        >
          {props.t('Week')}
        </button>
        <button
          type="button"
          className={classNames('btn btn-primary', {
            active: props.period === 'month',
          })}
          onClick={() => {
            props.onChange('month');
            TrackEvent('Graph Builder', 'Click', 'Toggle Month');
          }}
        >
          {props.t('Month')}
        </button>
      </div>
    );
  };

  return (
    <div className="chartPeriodSelector">
      {props.condensed
        ? getCondensedPeriodSelector()
        : getDefaultPeriodSelector()}
    </div>
  );
};

export const ChartPeriodSelectorTranslated =
  withNamespaces()(ChartPeriodSelector);
export default ChartPeriodSelector;
