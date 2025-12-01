// @flow
import { useEffect, useMemo, useState, useCallback } from 'react';
import _isEqual from 'lodash/isEqual';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { InputTextField, TextButton } from '@kitman/components';
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import {
  AthleteProvider,
  AthletesBySquadSelector,
} from '@kitman/components/src/Athletes/components';
import type {
  SquadAthletes,
  SquadAthletesSelection,
  ID,
  OptionType,
  SelectorOption,
} from '@kitman/components/src/Athletes/types';
import { mergeWithEmptySelection } from '@kitman/components/src/Athletes/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  RowGroupingParams,
  SelectedGroupingsItem,
  SelectedPopulationItems,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';

import { SquadModuleTranslated as SquadModule } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/SquadModule';
import { HistoricSquadsToggleTranslated as HistoricSquadsToggle } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/components/HistoricSquadsToggle';
import { FormControlLabel, Checkbox } from '@kitman/playbook/components';
import { useGetPermissionsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { useGetAllGroupingsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  filterGroupingsByCategory,
  filterGroupingsByKey,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { orderGroupings } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { NO_GROUPING } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import Panel from '../../Panel';
import { EditSquadDataTranslated as EditSquadData } from './EditSquadData';
import {
  EditGroupingDataTranslated as EditGroupingData,
  getGroupingKey,
} from './EditGroupingData';
import { ExtentedPopulationSelectorTranslated as ExtentedPopulationSelector } from '../../ExtendedPopulationSelector';
import { GroupingSelectorTranslated as GroupingSelector } from './GroupingSelector';

type Props = {
  activeSquad: { id: null | number, name: string },
  isEditMode: boolean,
  selectedPopulation: SquadAthletesSelection[],
  selectedGrouping?: Array<string>,
  onSetPopulation: Function,
  squadAthletes: SquadAthletes,
  onApply: Function,
  isLoading: boolean,
  isOpen: boolean,
  onSetGroupings: (params: RowGroupingParams) => void,
};

const styles = {
  historicSquadList: {
    marginLeft: '40px',
    display: 'flex',
    flexDirection: 'column',
  },
  bulkPopulationButtons: {
    display: 'flex',
    gap: '10px',
  },
};

export const useSelectedPopulation = () => {
  const [selectedPopulationItems, setSelectedPopulationItems] =
    useState<SelectedPopulationItems>([]);
  const [selectedGroupings, setSelectedGroupings] =
    useState<SelectedGroupingsItem>({});

  const findItemIndex = useCallback(
    (id: ID, type: OptionType, squadId: ?ID) => {
      return selectedPopulationItems.findIndex(
        (item) =>
          item.id === id && item.type === type && item.squadId === squadId
      );
    },
    [selectedPopulationItems]
  );

  const isSelected = useCallback(
    (id: ID, type: OptionType, squadId: ?ID) =>
      findItemIndex(id, type, squadId) > -1,
    [findItemIndex]
  );
  const selectPopulationItem = (
    id: ID,
    type: OptionType,
    squadId: ?ID,
    option: ?SelectorOption,
    historic?: boolean
  ) => {
    setSelectedPopulationItems((existingState) => {
      return [
        ...existingState,
        {
          id,
          type,
          squadId,
          option,
          contextSquads: [],
          historic,
        },
      ];
    });
  };
  const deselectPopulationItem = (id: ID, type: OptionType, squadId: ?ID) => {
    setSelectedPopulationItems((existingState) => {
      const updatedState = [...existingState];
      const index = findItemIndex(id, type, squadId);
      updatedState.splice(index, 1);

      return [...updatedState];
    });

    const groupingKey = getGroupingKey(id, type, squadId);

    if (selectedGroupings[groupingKey]) {
      // Remove grouping when deselecting population item
      setSelectedGroupings((existingState) => {
        const { [groupingKey]: _, ...updatedState } = existingState;

        return updatedState;
      });
    }
  };

  const onClick = (
    id: ID,
    type: OptionType,
    squadId: ?ID,
    option?: SelectorOption,
    historic?: boolean
  ) => {
    if (isSelected(id, type, squadId)) {
      deselectPopulationItem(id, type, squadId);
    } else {
      selectPopulationItem(id, type, squadId, option, historic);
    }
  };

  const onSelectAll = (options: Array<SelectorOption>, squadId: ?ID) => {
    options.forEach((option) => {
      if (!isSelected(option.id, option.type, squadId)) {
        selectPopulationItem(option.id, option.type, squadId, option);
      }
    });
  };

  const onClearAll = (options: Array<SelectorOption>, squadId: ?ID) => {
    setSelectedPopulationItems((existingState) => {
      return existingState.filter((item) => {
        return !options.find(
          (option) =>
            item.id === option.id &&
            item.type === option.type &&
            item.squadId === squadId
        );
      });
    });
  };

  const setAllContextSquads = (contextSquads: ID[]) => {
    setSelectedPopulationItems((existingState) => {
      return existingState.map((item) => {
        const newItem = _cloneDeep(item);

        newItem.contextSquads = _cloneDeep(contextSquads);

        return newItem;
      });
    });
  };

  const onChangeContextSquads = (
    id: ID,
    type: OptionType,
    squadId: ID | null,
    contextSquads: ID[]
  ) => {
    const indexToUpdate = findItemIndex(id, type, squadId);

    setSelectedPopulationItems((existingState) => {
      const newState = _cloneDeep(existingState);

      newState[indexToUpdate].contextSquads = _cloneDeep(contextSquads);

      return [...newState];
    });
  };

  return {
    selectedPopulationItems,
    onClearAll,
    onSelectAll,
    setAllContextSquads,
    onChangeContextSquads,
    isSelected,
    onClick,
    selectPopulationItem,
    setSelectedGroupings,
    selectedGroupings,
    findItemIndex,
  };
};

function ComparisonPanel(props: I18nProps<Props>) {
  const [searchValue, setSearchValue] = useState('');
  const [isEditSquadDataModeActive, setEditSquadActiveMode] = useState(false);
  const [isEditGroupingModeActive, setEditGroupingModeActive] = useState(false);
  const [isHistoricSquadActive, setHistoricSquadActive] = useState(false);

  const canApply = useCallback(() => {
    if (props.isEditMode) {
      return (
        !props.isLoading &&
        !_isEqual(props.selectedPopulation[0], EMPTY_SELECTION)
      );
    }

    return !props.isLoading && props.selectedPopulation.length > 0;
  }, [props.isLoading, props.selectedPopulation]);
  const [selectedSquadId, setSelectedSquadId] = useState(props.activeSquad.id);

  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const { data: groupings, isFetching } = useGetAllGroupingsQuery();

  const isLabelsAndSegmentsEnabled =
    window.featureFlags['rep-labels-and-groups'];
  const canReportHistoricSquads =
    isSuccess &&
    permissions.analysis.historicReporting.canReport &&
    window.featureFlags['rep-historic-reporting'];
  const isDynamicRowsEnabled = window.getFlag('rep-table-widget-dynamic-rows');
  const showAdditionalFilters =
    isEditSquadDataModeActive || isEditGroupingModeActive;

  const groupingOptions = useMemo(() => {
    // groupings get filtered for population, then ordered, then mapped to the correct format
    const options =
      orderGroupings(filterGroupingsByCategory(groupings, 'population')).map(
        (grouping) => {
          return {
            label: grouping.name,
            value: grouping.key,
          };
        }
      ) || [];

    const drillOption = filterGroupingsByKey(groupings, 'drill').map(
      (grouping) => ({ label: grouping.name, value: grouping.key })
    );

    const showDrillGrouping =
      drillOption && window.getFlag('rep-group-by-drill');

    const noGroupingOption = {
      label: props.t('No grouping'),
      value: NO_GROUPING,
    };

    return [
      ...options,
      ...(showDrillGrouping ? drillOption : []),
      noGroupingOption,
    ];
  }, [groupings]);

  const {
    selectedPopulationItems,
    isSelected,
    onClick,
    onClearAll,
    onSelectAll,
    setAllContextSquads,
    onChangeContextSquads,
    setSelectedGroupings,
    selectedGroupings,
    findItemIndex,
  } = useSelectedPopulation();

  useEffect(() => {
    if (props.isEditMode) {
      return;
    }
    // Check if there are groupings selected
    const groupingsSelected = Object.keys(selectedGroupings).length;

    const updatedPopulation = selectedPopulationItems.reduce((val, item) => {
      const newValue = _cloneDeep(val);
      newValue.push(
        mergeWithEmptySelection({
          [`${item.type}`]: [item.id],
          context_squads: [...item.contextSquads],
          historic: item.historic,
        })
      );

      return newValue;
    }, []);

    if (isDynamicRowsEnabled && groupingsSelected) {
      const updatedSelectedGroupings = {};

      // Assign groupings to the correct population item
      Object.values(selectedGroupings).forEach((value) => {
        // $FlowIgnore - Flow doesn't interpretate selectedGroupings type
        const { grouping, id, type, squadId } = value;
        const index = findItemIndex(id, type, squadId);
        updatedSelectedGroupings[index] = grouping;
      });

      props.onSetGroupings(updatedSelectedGroupings);
    }

    props.onSetPopulation(updatedPopulation);
  }, [selectedPopulationItems, selectedGroupings]);

  const onKeyDown = useCallback(
    ({ keyCode }) => {
      const RIGHT_ARROW_KEY_CODE = 39;

      if (keyCode === RIGHT_ARROW_KEY_CODE && canApply()) {
        props.onApply(false);
      }
    },
    [props.onApply, canApply]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [props.isOpen, onKeyDown]);

  const renderBulkPopulation = () => {
    return (
      !showAdditionalFilters && (
        <div
          css={{
            margin: '0 16px',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLabelsAndSegmentsEnabled && (
            <>
              <span
                css={{
                  visibility: `${
                    selectedPopulationItems.length > 0 ? 'visible' : 'hidden'
                  }`,
                }}
              >
                {props.t('{{x}} selected', {
                  x: selectedPopulationItems.length,
                })}
              </span>
              <ExtentedPopulationSelector
                updateSquad={setSelectedSquadId}
                squadId={selectedSquadId}
              />
            </>
          )}
          {!isLabelsAndSegmentsEnabled && (
            <>
              <InputTextField
                data-testid="ComparisonPanel|SearchInput"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputType="text"
                searchIcon
                kitmanDesignSystem
              />
              <div css={{ height: '100%' }}>
                <AthletesBySquadSelector
                  data-testid="ComparisonPanel|AthleteSelector"
                  searchValue={searchValue}
                  selectedSquadId={selectedSquadId}
                  onSquadClick={setSelectedSquadId}
                  subtitle={`(${props.t('Aggregate')})`}
                />
              </div>
            </>
          )}
        </div>
      )
    );
  };

  const renderHistoricSquad = () => {
    const squadsType = 'squads';
    return (
      !showAdditionalFilters && (
        <div css={styles.historicSquadList} data-testid="HistoricalSquadList">
          {props.squadAthletes.map(({ id, name }) => {
            const option = {
              id,
              type: squadsType,
              name,
            };
            return (
              <FormControlLabel
                key={`${id}-${name}`}
                control={<Checkbox value={id} size="small" key={id} />}
                label={name}
                checked={isSelected(id, squadsType, id)}
                onChange={(e) => {
                  onClick(
                    parseInt(e.target.value, 10),
                    squadsType,
                    parseInt(e.target.value, 10),
                    option,
                    // historic needs to be set to true
                    true
                  );
                }}
              />
            );
          })}
        </div>
      )
    );
  };

  return (
    <Panel>
      <Panel.Content
        styles={{
          padding: '0',
          margin: '0 0',
          borderTop: `solid 1px ${colors.neutral_300}`,
        }}
      >
        {!props.isEditMode && (
          <>
            {canReportHistoricSquads && !showAdditionalFilters && (
              <HistoricSquadsToggle
                isHistoricSquadActive={isHistoricSquadActive}
                setHistoricSquadActive={setHistoricSquadActive}
              />
            )}
            <AthleteProvider
              data-testid="ComparisonPanel|AthleteProvider"
              squadAthletes={props.squadAthletes}
              value={props.selectedPopulation}
              isSelected={isSelected}
              onOptionClick={onClick}
              onClearAllClick={onClearAll}
              onSelectAllClick={onSelectAll}
              isMulti
            >
              {!(canReportHistoricSquads && isHistoricSquadActive)
                ? renderBulkPopulation()
                : renderHistoricSquad()}
              {isEditSquadDataModeActive && (
                <EditSquadData
                  setAllContextSquads={setAllContextSquads}
                  onChangeContextSquads={onChangeContextSquads}
                  selectedPopulation={selectedPopulationItems}
                />
              )}
              {isEditGroupingModeActive && (
                <EditGroupingData
                  selectedPopulation={selectedPopulationItems}
                  groupingOptions={groupingOptions}
                  selectedGroupings={selectedGroupings}
                  onSelectedGrouping={({ id, type, squadId, grouping }) => {
                    const groupingKey = getGroupingKey(id, type, squadId);

                    setSelectedGroupings({
                      ...selectedGroupings,
                      [groupingKey]: {
                        id,
                        type,
                        squadId,
                        grouping,
                      },
                    });
                  }}
                />
              )}
            </AthleteProvider>
          </>
        )}

        {props.isEditMode && (
          <>
            <SquadModule
              data-testid="ComparisonPanel|SquadModule"
              selectedPopulation={props.selectedPopulation}
              onSetPopulation={props.onSetPopulation}
              onSelectGrouping={props.onSetGroupings}
              showExtendedPopulationOptions
            />
            {isDynamicRowsEnabled && (
              <GroupingSelector
                selectedGrouping={props.selectedGrouping?.[0]}
                options={groupingOptions}
                onSelectGroupings={props.onSetGroupings}
                isLoading={isFetching}
                isHistoric={props.selectedPopulation[0]?.historic}
              />
            )}
          </>
        )}
      </Panel.Content>
      <Panel.Loading isLoading={props.isLoading} />
      <Panel.Actions
        styles={
          !props.isEditMode && selectedPopulationItems.length > 0
            ? { justifyContent: 'space-between' }
            : {}
        }
      >
        {!props.isEditMode && selectedPopulationItems.length > 0 && (
          <div css={styles.bulkPopulationButtons}>
            {showAdditionalFilters && (
              <TextButton
                data-testid="ComparisonPanel|EditSquadData"
                onClick={() => {
                  setEditSquadActiveMode(false);
                  setEditGroupingModeActive(false);
                }}
                type="secondary"
                text={props.t('Back')}
                kitmanDesignSystem
              />
            )}
            {!showAdditionalFilters && (
              <TextButton
                data-testid="ComparisonPanel|EditSquadData"
                onClick={() =>
                  setEditSquadActiveMode(!isEditSquadDataModeActive)
                }
                type="secondary"
                text={props.t('Squad inclusion')}
                kitmanDesignSystem
              />
            )}
            {isDynamicRowsEnabled &&
              !showAdditionalFilters &&
              !isHistoricSquadActive && (
                <TextButton
                  data-testid="ComparisonPanel|EditSquadData"
                  onClick={() =>
                    setEditGroupingModeActive(!isEditGroupingModeActive)
                  }
                  type="secondary"
                  text={props.t('Add grouping')}
                  kitmanDesignSystem
                />
              )}
          </div>
        )}
        <TextButton
          data-testid="ComparisonPanel|Apply"
          onClick={() => props.onApply(false)}
          isDisabled={!canApply()}
          type="primary"
          text={props.t('Apply')}
          kitmanDesignSystem
        />
      </Panel.Actions>
    </Panel>
  );
}

export const ComparisonPanelTranslated: ComponentType<Props> =
  withNamespaces()(ComparisonPanel);
export default ComparisonPanel;
