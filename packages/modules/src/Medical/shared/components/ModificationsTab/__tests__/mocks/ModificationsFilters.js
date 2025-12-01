import { getDefaultNotesFilters } from '../../../../utils';

export const defaultFilters = getDefaultNotesFilters({
  athleteId: null,
});

export const squads = [
  { value: 1, label: 'Squad 1' },
  { value: 2, label: 'Squad 2' },
];

export const authors = [
  { value: 1, label: 'Author 1' },
  { value: 2, label: 'Author 2' },
];

export const squadAthletes = [
  { value: 1, label: 'Player 1' },
  { value: 2, label: 'Player 2' },
];
