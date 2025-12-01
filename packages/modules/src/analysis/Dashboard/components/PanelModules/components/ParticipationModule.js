// @flow
import { useMemo, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TableWidgetParticipationStatus } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

import { InputTextField, RadioList, Select } from '@kitman/components';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import {
  getCalculationDropdownOptions,
  getAvailabilityCalculationOptions,
  getParticipationOptions,
  getInvolvementUnits,
  getInvolvementMinutesOptions,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { useGetParticipationTypeOptionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { isValidOptionLength } from '../utils';

const style = {
  marginTop: 16,
  marginLeft: 8,
  borderLeft: 'solid 1px #ddd',
  paddingLeft: 16,
};

type Props = {
  selectedIds: Array<number>,
  participationStatus: TableWidgetParticipationStatus,
  onSetParticipationStatus: Function,
  onSetParticipationIds: Function,
  columnTitle?: string,
  calculation: string,
  onSetCalculation: Function,
  onSetColumnTitle?: Function,
  hideColumnTitle: boolean,
  panelType?: string,
  isPanelOpen: boolean,
  hideProportionOption?: boolean,
  hidePercentageOption?: boolean,
  onSetParticipationEvent?: (event: string | null) => void,
};

function ParticipationModule(props: I18nProps<Props>) {
  const [gameUnit, setGameUnit] = useState('events');
  const { isFetching, data } = useGetParticipationTypeOptionsQuery({
    skip: !props.isPanelOpen,
  });

  const participationOptions = getParticipationOptions();

  const baseCalculationOptions = getCalculationDropdownOptions().map(
    ({ id, title }) => ({
      value: id,
      label: title,
    })
  );

  const involvementCalculationOptions = (
    unit: string,
    hideProportion?: boolean
  ) => {
    const filterValue = unit === 'events' ? 'count_absolute' : 'sum_absolute';

    return [
      ...baseCalculationOptions.filter((item) => item.value === filterValue),
      ...(unit === 'events'
        ? getAvailabilityCalculationOptions({
            hideProportion,
            hideCount: true,
            hidePercentage: props.hidePercentageOption,
          })
        : getInvolvementMinutesOptions({
            hideProportion,
            hidePercentage: props.hidePercentageOption,
          }).map(({ id, title }) => ({
            value: id,
            label: title,
          }))),
    ];
  };

  const updateCalculationOptions = (status, unit) => {
    // Hiding Proportion Calculation Option in Charts
    const hideProportion = !props.hideProportionOption && props.panelType;

    if (status !== 'game_involvement') {
      return getAvailabilityCalculationOptions({
        hideProportion: !hideProportion,
        hidePercentage: props.hidePercentageOption,
      });
    }
    return involvementCalculationOptions(unit, !hideProportion);
  };

  const levelOptions = useMemo(() => {
    if (!data) {
      return [];
    }

    const mapper = ({ id, name }) => ({ label: name, value: id });
    return [
      {
        label: props.t('Games'),
        options: data.games.map(mapper),
      },
      {
        label: props.t('Training'),
        options: data.sessions.map(mapper),
      },
    ];
  }, [data, props.t]);

  const newGameUnit = useMemo(() => {
    const gameMinutesType = [
      'proportion_duration',
      'percentage_duration',
      'sum_absolute',
    ];

    return gameMinutesType.includes(props.calculation) ? 'minutes' : 'events';
  }, [props.calculation]);

  useEffect(() => {
    if (gameUnit !== newGameUnit) {
      setGameUnit(newGameUnit);
    }

    if (
      props.participationStatus === 'game_involvement' &&
      props.onSetParticipationEvent
    ) {
      props.onSetParticipationEvent('game');
    }
  }, [newGameUnit]);

  const onChangeStatus = (value) => {
    const status = participationOptions.find(
      (option) => value === option.value
    );

    const event = value === 'game_involvement' ? 'game' : null;

    props.onSetParticipationStatus(value);

    if (props.onSetParticipationEvent) {
      props.onSetParticipationEvent(event);
    }

    if (value !== 'participation_leves' && status) {
      props.onSetParticipationIds([], status.label, value);

      if (!props.hideColumnTitle) props.onSetColumnTitle?.(status.label);
    }
  };

  const displaySelector = isValidOptionLength(levelOptions);

  const onSelectLevel = (value) => {
    const selectedLabels = levelOptions
      .reduce((acc, curr) => {
        const opts = curr.options || [];

        return [...acc, ...opts];
      }, [])
      .filter((option) => value.includes(option.value))
      .map(({ label }) => label);

    const title = selectedLabels.reduce((acc, curr, index) => {
      if (index === 0) {
        return curr;
      }

      const newTitle = `${acc} - ${curr}`;

      if (newTitle.length < 100) {
        return newTitle;
      }

      return acc;
    }, '');

    props.onSetParticipationIds(value, title, 'participation_levels');

    if (!props.hideColumnTitle) {
      props.onSetColumnTitle?.(title);
    }

    if (!props.participationStatus) {
      props.onSetParticipationStatus('participation_levels');
    }
  };

  const onSelectGameUnit = (unit: string) => {
    setGameUnit(unit);
    props.onSetCalculation('');
  };

  return (
    <>
      <Panel.Field>
        <Select
          data-testid="ParticipationModule|TypeOptions"
          options={participationOptions}
          label="Participation"
          onChange={onChangeStatus}
          value={props.participationStatus}
        />
        {(props.participationStatus === 'participation_levels' ||
          props.participationStatus === 'game_involvement') && (
          <div css={style}>
            {props.participationStatus === 'participation_levels' ? (
              <Select
                options={levelOptions}
                onChange={onSelectLevel}
                value={props.selectedIds}
                searchable
                isDisabled={
                  props.participationStatus === 'participation_status' ||
                  props.participationStatus === ''
                }
                isLoading={isFetching}
                isMulti
                selectAllGroups
                allowClearAll={displaySelector}
                allowSelectAll={displaySelector}
                customSelectStyles={fullWidthMenuCustomStyles}
              />
            ) : (
              <Panel.Field styles={{ margin: 0 }}>
                <Panel.FieldTitle>{props.t('Unit')}</Panel.FieldTitle>
                <RadioList
                  radioName="game_involvement_unit"
                  options={getInvolvementUnits()}
                  change={onSelectGameUnit}
                  value={gameUnit}
                  direction="horizontal"
                  kitmanDesignSystem
                />
              </Panel.Field>
            )}
          </div>
        )}
      </Panel.Field>
      {!props.hideColumnTitle && (
        <Panel.Field>
          <InputTextField
            data-testid="ParticipationModule|ColumnTitle"
            label={props.t('Column Title')}
            inputType="text"
            value={props.columnTitle || ''}
            onChange={(e) => props.onSetColumnTitle?.(e.currentTarget.value)}
            kitmanDesignSystem
          />
        </Panel.Field>
      )}
      <Panel.Field>
        <Select
          data-testid="ParticipationModule|Calculation"
          label={props.t('Calculation')}
          value={props.calculation}
          options={updateCalculationOptions(
            props.participationStatus,
            gameUnit
          )}
          onChange={(calc) => props.onSetCalculation(calc)}
          appendToBody
        />
      </Panel.Field>
    </>
  );
}

export const ParticipationModuleTranslated =
  withNamespaces()(ParticipationModule);
export default ParticipationModule;
