// @flow
import type { Node } from 'react';
import { createContext } from 'react';
import type {
  SquadAthletes,
  SquadAthletesSelection,
  IsSelectedCallback,
  OnOptionClickCallback,
  OnSelectAllClickCallback,
  OnClearAllClickCallback,
} from '../types';

export type AthleteContextType = {
  isMulti: boolean,
  squadAthletes: SquadAthletes,
  value: Array<SquadAthletesSelection>,
  onChange: Function,
  includeContextSquad?: boolean,
  isSelected?: IsSelectedCallback,
  onOptionClick?: OnOptionClickCallback,
  onSelectAllClick?: OnSelectAllClickCallback,
  onClearAllClick?: OnClearAllClickCallback,
};

type ProviderProps = {
  children: Node,
  squadAthletes: SquadAthletes,
  value: $PropertyType<AthleteContextType, 'value'>,
  onChange?: Function,
  includeContextSquad?: boolean,
  isMulti: $PropertyType<AthleteContextType, 'isMulti'>,
  isSelected?: $PropertyType<AthleteContextType, 'isSelected'>,
  onOptionClick?: $PropertyType<AthleteContextType, 'onOptionClick'>,
  onSelectAllClick?: $PropertyType<AthleteContextType, 'onSelectAllClick'>,
  onClearAllClick?: $PropertyType<AthleteContextType, 'onClearAllClick'>,
};

const DEFAULT_CONTEXT_VALUE = {
  squadAthletes: [],
  value: [],
  onChange: () => {},
  includeContextSquad: false,
  isMulti: false,
};
export const AthleteContext = createContext<AthleteContextType>(
  DEFAULT_CONTEXT_VALUE
);

function AthleteProvider(props: ProviderProps) {
  return (
    <AthleteContext.Provider
      value={{
        squadAthletes: props.squadAthletes,
        value: props.value,
        onChange: props.onChange,
        includeContextSquad: props.includeContextSquad,
        isMulti: props.isMulti,
        isSelected: props.isSelected,
        onOptionClick: props.onOptionClick,
        onSelectAllClick: props.onSelectAllClick,
        onClearAllClick: props.onClearAllClick,
      }}
    >
      {props.children}
    </AthleteContext.Provider>
  );
}
AthleteProvider.defaultProps = {
  isMulti: DEFAULT_CONTEXT_VALUE.isMulti,
  onChange: DEFAULT_CONTEXT_VALUE.onChange,
};

export { AthleteProvider };
