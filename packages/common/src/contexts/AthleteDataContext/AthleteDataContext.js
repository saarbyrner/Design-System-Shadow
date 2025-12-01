// @flow
import { createContext } from 'react';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';

export const AthleteDataContext = createContext<AthleteData>({});
