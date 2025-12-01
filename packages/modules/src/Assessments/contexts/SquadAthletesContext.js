// @flow
import { createContext } from 'react';
import type { SquadAthletes } from '@kitman/components/src/types';

export const defaultSquadAthletes = {
  position_groups: [],
};

const SquadAthletesContext = createContext<SquadAthletes>(defaultSquadAthletes);

export default SquadAthletesContext;
