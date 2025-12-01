// @flow
import { withNamespaces } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

import { InputTextField, Select } from '@kitman/components';
import { useGetPositionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { useGetFormationsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { getCalculationDropdownOptions } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import {
  type PanelType,
  DATA_SOURCES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import type { TableCalculation } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

import { isValidOptionLength } from '../utils';

type Props = {
  title?: string,
  hideColumnTitle?: boolean,
  calculation: string,
  onSetCalculation: (input: TableCalculation) => void,
  onSetTitle?: (title: ?string) => void,
  onSetGameActivityKinds: (
    kind: string | Array<string>,
    label?: string
  ) => void,
  onSetGameActivityResult: (result: string, label?: string) => void,
  onSetTimeInPositions: (positionIds: Array<string>) => void,
  onSetTimeInFormation: (formationIds: Array<string>) => void,
  formationIds: ?Array<number | string>,
  selectedEvent: ?string | Array<string>,
  positionsIds: ?Array<number | string>,
  panelType?: PanelType,
  isPanelOpen: boolean,
};

function GameActivityModule(props: I18nProps<Props>) {
  const { data: positions, isFetching: isPositionsLoading } =
    useGetPositionsQuery(null, { skip: !props.isPanelOpen });
  const { data: formations, isFetching: isFormationsLoading } =
    useGetFormationsQuery(null, { skip: !props.isPanelOpen });

  const [selectedGameEvent, setSelectedGameEvent] = useState<string>('');
  const isTimeInPosition = selectedGameEvent === 'position_change';
  const isTimeInFormation = selectedGameEvent === 'formation_change';

  const baseCalculationOptions = getCalculationDropdownOptions({
    withComplexCalcs: false,
    dataSourceType: DATA_SOURCES.games,
  }).map(({ id, title }) => ({
    value: id,
    label: title,
  }));

  const positionOptions = useMemo(() => {
    if (!positions?.length) {
      return [];
    }

    const mapper = ({ id, name }) => ({ label: name, value: id });
    return positions.map((positionGroup) => {
      return {
        label: positionGroup.name,
        options: positionGroup.positions.map(mapper),
      };
    });
  }, [positions]);

  const formationOptions = useMemo(() => {
    if (!formations?.length) {
      return [];
    }

    const mapper = ({ id, name }) => ({ label: name, value: id });
    return formations.map(mapper);
  }, [formations]);

  const displayPositionSelector = isValidOptionLength(positionOptions);
  const displayFormationSelector = isValidOptionLength(formationOptions);
  /* 
   getGameEvent is used to get the data source parent type for the first drop down in the Game Events
   Currently Goals, Assists, Cards, Results, Time in Formation & Time in Position
   Only cards and results have subtypes which need to be mapped to the parent type - cards or results.
   The other data source types use the type passed through from value.
  */
  const getGameEvent = (value: string) => {
    switch (value) {
      case 'red_card':
      case 'yellow_card':
        return 'cards';
      case 'win':
      case 'draw':
      case 'loss':
        return 'results';
      default:
        return value;
    }
  };

  useEffect(() => {
    if (!selectedGameEvent && props.selectedEvent) {
      // on edit row/column, find Game Event Type to set in field
      const eventSelected =
        typeof props.selectedEvent === 'string'
          ? getGameEvent(props.selectedEvent)
          : getGameEvent(props.selectedEvent[0]);

      setSelectedGameEvent(eventSelected);
    }
  }, [selectedGameEvent, props.selectedEvent]);

  const gameEventOptions = [
    {
      label: props.t('Goals'),
      value: 'goal',
    },
    {
      label: props.t('Assists'),
      value: 'assist',
    },
    {
      label: props.t('Cards'),
      value: 'cards',
    },
    {
      label: props.t('Results'),
      value: 'results',
    },
  ];

  const configureGameEventOptions = useMemo(() => {
    const options = [];

    if (window.getFlag('rep-show-time-in-formation-table-widget')) {
      options.push({
        label: props.t('Time in Formation'),
        value: 'formation_change',
      });
    }

    if (window.getFlag('rep-show-time-in-position-table-widget')) {
      options.push({
        label: props.t('Time in Position'),
        value: 'position_change',
      });
    }

    if (window.getFlag('league-ops-game-events-own-goal')) {
      options.push({
        label: props.t('Own Goal'),
        value: 'own_goal',
      });
    }

    return [...gameEventOptions, ...options];
  }, [gameEventOptions]);

  const getGameEventTypes = (gameEvent: string) => {
    if (gameEvent === 'cards') {
      return [
        {
          label: props.t('Yellow'),
          value: 'yellow_card',
        },
        {
          label: props.t('Red'),
          value: 'red_card',
        },
      ];
    }
    if (gameEvent === 'results') {
      return [
        {
          label: props.t('Win'),
          value: 'win',
        },
        {
          label: props.t('Draw'),
          value: 'draw',
        },
        {
          label: props.t('Loss'),
          value: 'loss',
        },
      ];
    }
    return [];
  };

  // multiGameEvents are one-to-many, so we can select multiple options e.g. red and yellow cards
  // singleGameEvents are one-to-one, so we can only select one option e.g. win, or loss, or draw.
  const multiGameEvent = ['cards'];
  const singleGameEvent = ['results'];

  return (
    <>
      <Panel.Field>
        <Select
          label={props.t('Game Event')}
          data-testid="GameActivityModule|GameEvent"
          options={configureGameEventOptions}
          onChange={(value) => {
            setSelectedGameEvent(value);

            if (
              !multiGameEvent.includes(value) &&
              !singleGameEvent.includes(value)
            ) {
              const selectedActivity = configureGameEventOptions.find(
                (option) => value === option.value
              );

              if (!props.hideColumnTitle && props.onSetTitle)
                props.onSetTitle(selectedActivity?.label);

              props.onSetGameActivityKinds([value], selectedActivity?.label);
            } else {
              props.onSetGameActivityKinds([], '');
              if (!props.hideColumnTitle && props.onSetTitle)
                props.onSetTitle('');
            }
          }}
          value={selectedGameEvent}
          searchable
        />
      </Panel.Field>
      {multiGameEvent.includes(selectedGameEvent) && (
        <Panel.Field>
          <Select
            label={
              configureGameEventOptions.find(
                (option) => selectedGameEvent === option.value
              )?.label
            }
            data-testid="GameActivityModule|MultiGameEventTypes"
            options={getGameEventTypes(selectedGameEvent)}
            onChange={(value) => {
              // set columnTitle to parent data type for multi-select options
              const gameEvent = getGameEvent(value[0]);
              const selectedActivity = configureGameEventOptions.find(
                (option) => gameEvent === option.value
              );
              if (!props.hideColumnTitle && props.onSetTitle)
                props.onSetTitle(selectedActivity?.label);

              props.onSetGameActivityKinds(value, selectedActivity?.label);
            }}
            value={props.selectedEvent}
            searchable
            isMulti
          />
        </Panel.Field>
      )}
      {singleGameEvent.includes(selectedGameEvent) && (
        <Panel.Field>
          <Select
            label={
              configureGameEventOptions.find(
                (option) => selectedGameEvent === option.value
              )?.label
            }
            data-testid="GameActivityModule|SingleGameEventTypes"
            options={getGameEventTypes(selectedGameEvent)}
            onChange={(value) => {
              // set columnTitle to data type for single-select options
              const gameEvent = getGameEvent(value);
              const selectedActivity = getGameEventTypes(gameEvent).find(
                (option) => value === option.value
              );
              if (!props.hideColumnTitle && props.onSetTitle)
                props.onSetTitle(selectedActivity?.label);

              props.onSetGameActivityResult(value, selectedActivity?.label);
            }}
            value={props.selectedEvent}
            searchable
          />
        </Panel.Field>
      )}
      {isTimeInPosition && (
        <Panel.Field>
          <Select
            label={props.t('Positions')}
            data-testid="GameActivityModule|PositionOptions"
            options={positionOptions}
            onChange={(value) => {
              props.onSetTimeInPositions(value || []);
            }}
            value={props?.positionsIds}
            isLoading={isPositionsLoading}
            css={{
              '.kitmanReactSelect__menu': {
                width: '220px',
              },
            }}
            searchable
            isMulti
            selectAllGroups
            hideOnSearch
            allowClearAll={displayPositionSelector}
            allowSelectAll={displayPositionSelector}
            customSelectStyles={fullWidthMenuCustomStyles}
          />
        </Panel.Field>
      )}
      {isTimeInFormation && (
        <Panel.Field>
          <Select
            label={props.t('Formations')}
            data-testid="GameActivityModule|FormationOptions"
            options={formationOptions}
            onChange={(value) => {
              props.onSetTimeInFormation(value || []);
            }}
            value={props?.formationIds}
            isLoading={isFormationsLoading}
            css={{
              '.kitmanReactSelect__menu': {
                width: '220px',
              },
            }}
            searchable
            isMulti
            selectAllGroups
            hideOnSearch
            allowClearAll={displayFormationSelector}
            allowSelectAll={displayFormationSelector}
            customSelectStyles={fullWidthMenuCustomStyles}
          />
        </Panel.Field>
      )}
      {!props.hideColumnTitle && (
        <Panel.Field>
          <InputTextField
            data-testid="GameActivityModule|ColumnTitle"
            label={
              props.panelType === 'row'
                ? props.t('Row Title')
                : props.t('Column Title')
            }
            inputType="text"
            value={props.title || ''}
            onChange={(e) => {
              if (props.onSetTitle) props.onSetTitle(e.currentTarget.value);
            }}
            kitmanDesignSystem
          />
        </Panel.Field>
      )}

      <Panel.Field>
        <Select
          data-testid="GameActivityModule|Calculation"
          label={props.t('Calculation')}
          value={props.calculation}
          options={baseCalculationOptions}
          onChange={(calc) => {
            props.onSetCalculation(calc);
          }}
          appendToBody
        />
      </Panel.Field>
    </>
  );
}

export const GameActivityModuleTranslated: ComponentType<Props> =
  withNamespaces()(GameActivityModule);
export default GameActivityModule;
