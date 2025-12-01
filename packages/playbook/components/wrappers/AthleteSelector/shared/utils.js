// @flow

import type { Athlete, Group } from './types';

const STATUS_MAP: {
  [string]: 'available' | 'injured' | 'unavailable' | 'unknown',
} = {
  available: 'available',
  injured: 'injured',
  unavailable: 'unavailable',
};

export const Z_INDEX_ABOVE_DRAWER = 2147483007;

export const matchesSearch = (athlete: Athlete, search: string) => {
  if (!search) {
    return true;
  }

  return athlete.name?.toLowerCase().includes(search.toLocaleLowerCase());
};

export const filterGroup = ({
  group,
  search,
  filterAthletes = false,
}: {
  group: Group,
  search: string,
  filterAthletes?: boolean,
}): Group | null => {
  const filteredAthletes =
    group.athletes?.filter((athlete) => matchesSearch(athlete, search)) ?? [];
  const filteredChildren =
    group.children
      ?.map((childGroup) =>
        filterGroup({
          group: childGroup,
          search,
          filterAthletes,
        })
      )
      .filter(Boolean) ?? [];

  if (filteredAthletes.length === 0 && filteredChildren.length === 0) {
    return null;
  }

  return {
    ...group,
    children: filteredChildren,
    athletes: filterAthletes ? filteredAthletes : group.athletes,
  };
};

export const collectGroupKeys = (groups: Group[]): string[] =>
  groups.flatMap((group) => [
    group.key,
    ...(group.children ? collectGroupKeys(group.children) : []),
  ]);

export const collectAthleteIds = (g: Group): number[] => [
  ...(g.athletes?.map((a) => a.id) ?? []),
  ...(g.children ? g.children.flatMap(collectAthleteIds) : []),
];

/**
 * Get the first uppercase character for avatar fallback.
 */
export function getInitial(name: string): string {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

/**
 * Normalize the backend status to a canonical key used in the UI.
 */
export function normalizeStatus(
  status?: ?string
): 'available' | 'injured' | 'unavailable' | 'unknown' {
  if (!status) return 'unknown';
  const key = String(status).toLowerCase();
  return STATUS_MAP[key] || 'unknown';
}

/**
 * Map normalized status to MUI Chip color.
 */
export const chipColorFor = (
  status: ?string
): 'success' | 'error' | 'default' => {
  const s = normalizeStatus(status);
  if (s === 'available') return 'success';
  if (s === 'injured') return 'error';
  if (s === 'unavailable') return 'default';
  return 'default';
};
