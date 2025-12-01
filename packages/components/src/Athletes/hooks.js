// @flow
import { useCallback, useContext, useMemo } from 'react';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import type { AthleteContextType } from './components/AthleteContext';
import { AthleteContext } from './components/AthleteContext';
import type { ID, OptionType, SelectorOption, UseOptionsReturn } from './types';
import { mergeWithEmptySelection } from './utils';

export const useAthleteContext = (): AthleteContextType =>
  useContext(AthleteContext);

type SquadData = { id: ID, name: string };

export const useSquads = (): {
  data: Array<SquadData>,
} => {
  const { squadAthletes } = useAthleteContext();

  const data: Array<SquadData> = squadAthletes.map(({ id, name }) => ({
    id,
    name,
  }));

  return {
    data,
  };
};

const selectItem = (
  startValue: $PropertyType<AthleteContextType, 'value'>,
  id: ID,
  type: OptionType,
  squadId: ?ID,
  includeContextSquad: ?boolean
) => {
  const valueIndex = startValue.findIndex((valueItem) => {
    if (includeContextSquad) {
      return valueItem.context_squads?.includes(squadId);
    }

    return !!valueItem;
  });

  if (valueIndex === -1) {
    const contextSquads =
      includeContextSquad && squadId ? { context_squads: [squadId] } : {};

    const updatededVal = mergeWithEmptySelection(contextSquads);

    updatededVal[type] = [id];

    return [...startValue, updatededVal];
  }

  return startValue.map((val, index) => {
    if (index === valueIndex) {
      const updatedVal = _cloneDeep(val);

      updatedVal[type]?.push(id);

      return updatedVal;
    }

    return val;
  });
};

const deselectItem = (
  startValue: $PropertyType<AthleteContextType, 'value'>,
  id: ID,
  type: OptionType,
  squadId: ?ID,
  includeContextSquad: ?boolean
) => {
  const valueIndex = startValue.findIndex((valueItem) => {
    if (includeContextSquad) {
      return valueItem.context_squads?.includes(squadId);
    }

    return !!valueItem;
  });

  if (startValue[valueIndex][type]) {
    const idIndex = startValue[valueIndex][type].findIndex(
      (selectionId) => selectionId === id
    );

    const updatedValue = _cloneDeep(startValue);

    updatedValue[valueIndex][type]?.splice(idIndex, 1);

    const contextSquads =
      includeContextSquad && squadId ? { context_squads: [squadId] } : {};

    if (
      _isEqual(updatedValue[valueIndex], mergeWithEmptySelection(contextSquads))
    ) {
      updatedValue.splice(valueIndex, 1);
    }

    return updatedValue;
  }
  return [];
};

export const useOptionSelect = (): ({
  onClick: (
    id: ID,
    type: OptionType,
    squadId: ?ID,
    option?: SelectorOption
  ) => void,
  isSelected: (id: ID, type: OptionType, squadId: ?ID) => boolean,
  selectMultiple: (options: Array<SelectorOption>, squadId: ?ID) => void,
  deselectMultiple: (options: Array<SelectorOption>, squadId: ?ID) => void,
}) => {
  const {
    value,
    onChange,
    isMulti,
    includeContextSquad,
    isSelected: isSelectedProp,
    onOptionClick,
  } = useAthleteContext();
  const isSelected = useCallback(
    (id: ID, type: OptionType, squadId: ?ID) => {
      if (typeof isSelectedProp === 'function') {
        return isSelectedProp(id, type, squadId);
      }

      const matchingValues = value.filter((valueItem) => {
        // Ruling out any selected items that don't have the id selected
        if (!valueItem[type]?.includes(id)) {
          return false;
        }

        const contextSquads = valueItem.context_squads || [];

        if (contextSquads.length > 0 && includeContextSquad) {
          // If this value has context squads, then that will determine the
          // selected scope of this option, it is only "selected" if the
          // context_squads contains the squadId supplied

          return (
            valueItem[type]?.includes(id) && contextSquads.includes(squadId)
          );
        }

        // If we've gotten this far, then the last criteria
        // to determine if an option is selected is to
        // check if the id is in its subsequent type
        return valueItem[type]?.includes(id);
      });

      return matchingValues.length > 0;
    },
    [value, includeContextSquad]
  );

  const singleSelectItem = (id: ID, type: OptionType, squadId: ?ID) => {
    const newValue = [mergeWithEmptySelection({})];

    newValue[0][type] = [id];

    if (squadId && includeContextSquad) {
      newValue[0].context_squads = [squadId];
    }

    return [...newValue];
  };

  const onClick = (
    id: ID,
    type: OptionType,
    squadId: ?ID,
    option?: SelectorOption
  ) => {
    if (typeof onOptionClick === 'function') {
      onOptionClick(id, type, squadId, option);

      return;
    }

    let newValue = [];

    if (isMulti) {
      if (isSelected(id, type, squadId)) {
        newValue = deselectItem(value, id, type, squadId, includeContextSquad);
      } else {
        newValue = selectItem(value, id, type, squadId, includeContextSquad);
      }
    } else {
      newValue = singleSelectItem(id, type, squadId);
    }

    onChange([...newValue]);
  };

  const selectMultiple = (options: Array<SelectorOption>, squadId: ?ID) => {
    let newValue = _cloneDeep(value);

    options.forEach((option) => {
      if (!isSelected(option.id, option.type, squadId)) {
        newValue = selectItem(
          newValue,
          option.id,
          option.type,
          squadId,
          includeContextSquad
        );
      }
    });

    onChange([...newValue]);
  };

  const deselectMultiple = (options: Array<SelectorOption>, squadId: ?ID) => {
    let newValue = _cloneDeep(value);

    options.forEach((option) => {
      if (isSelected(option.id, option.type, squadId)) {
        newValue = deselectItem(
          newValue,
          option.id,
          option.type,
          squadId,
          includeContextSquad
        );
      }
    });

    onChange([...newValue]);
  };

  return {
    isSelected,
    onClick,
    selectMultiple,
    deselectMultiple,
  };
};

type SquadOptionsConfig = {
  squadId?: ID,
  searchText?: string,
  hiddenTypes?: Array<OptionType>,
  groupBy?: 'squad' | 'position_groups',
};
export const useOptions = (
  config: SquadOptionsConfig
): {
  data: Array<UseOptionsReturn>,
} => {
  const {
    squadId,
    searchText,
    groupBy = 'position_groups',
    hiddenTypes = [],
  } = config;
  const { squadAthletes } = useAthleteContext();

  const mapPositionGroupToOptions = (positionGroup) => {
    const optionList = [];
    const positionGroupOption = {
      type: 'position_groups',
      id: positionGroup.id,
      name: positionGroup.name,
    };

    if (hiddenTypes.indexOf('position_groups') === -1) {
      optionList.push(positionGroupOption);
    }

    const athleteMapper = (position) => (athlete) => {
      optionList.push({
        type: 'athletes',
        id: athlete.id,
        name: athlete.fullname,
        fullname: athlete.fullname,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        avatar_url: athlete.avatar_url || null,
        position,
        positionGroup: positionGroupOption,
      });
    };

    positionGroup.positions.forEach((position) => {
      const positionOption = {
        type: 'positions',
        id: position.id,
        name: position.name,
      };
      if (hiddenTypes.indexOf('positions') === -1) {
        optionList.push(positionOption);
      }

      if (hiddenTypes.indexOf('athletes') === -1) {
        position.athletes.forEach(athleteMapper(positionOption));
      }
    });

    return {
      id: positionGroup.id,
      name: positionGroup.name,
      options: optionList.filter((option) => {
        if (searchText && searchText === '') {
          return true;
        }
        const value = option.name.toUpperCase();
        const filter = searchText?.toUpperCase() || '';

        return value.toUpperCase().indexOf(filter) > -1;
      }),
    };
  };

  const flatList = useMemo(() => {
    let optionList = [];
    const squads = squadAthletes.filter(({ id }) => {
      if (!squadId) {
        return true;
      }

      return id === squadId;
    });

    squads.forEach((squad) => {
      const positionGroupOptions = squad.position_groups.map(
        mapPositionGroupToOptions
      );

      if (groupBy === 'position_groups') {
        optionList = [...optionList, ...positionGroupOptions];
      } else {
        optionList = [
          ...optionList,
          {
            id: squad.id,
            name: squad.name,
            options: positionGroupOptions.flatMap(({ options }) => {
              return [...options];
            }),
          },
        ];
      }
    });

    return optionList.filter(({ options }) => options.length > 0);
  }, [squadAthletes, squadId, searchText, groupBy]);

  return { data: flatList };
};
