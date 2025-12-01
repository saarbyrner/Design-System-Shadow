// @flow

import type { DivisionSquad } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { localeSort } from '@kitman/common/src/utils/localeSort';

interface FlatItem {
  name: string;
  id: string | number;
  indentLevel: number;
  disabled: boolean;
}

/**
 * 'divisionsAndConferences': Treats root squads as top-level conferences.
 * 'divisionsAndSquads': Treats root divisions as top-level, followed by their squads.
 */
type FlattenMode = 'divisionsAndConferences' | 'divisionsAndSquads';

/**
 * Returns a flat array of divisions/conferences and squads with indentation levels,
 * based on squad hierarchy and a specified output mode.
 * We're following the following pattern: division --> parent division  to achieve the indentation
 * Tier ---> conference ---> division structure which is require
 * For example at the league level, we have: KLS Next2 --> Pacific Northwest --> New England
 *
 * @param {Array<DivisionSquad>} squads - Array of squad objects, each possibly containing division and parent division info.
 * @param {string} locale - Locale string for sorting division names.
 * @param {FlattenMode} mode - Determines the output structure: (see FlattenMode type for options).
 * @returns {Array<FlatItem>} Array of objects with name, id, indentLevel, and disabled properties.
 *
 * Squads are organized into root divisions, child divisions, and orphan squads.
 * If a squad's parent division is not present in the data, its division is treated as a root division.
 */
export const getFlatHierarchy = (
  squads: Array<DivisionSquad>,
  locale: string,
  mode: FlattenMode
): Array<FlatItem> => {
  // check if allDivisionIds is defined and if squads is an array
  const allDivisionIds = new Set(
    squads.map((squad) => squad?.division?.id).filter(Boolean)
  );

  // Organize squads into their hierarchical categories using reduce
  const { rootDivisions, childDivisions, orphanSquads } = squads.reduce(
    (acc, squad) => {
      const division = squad?.division;
      let parentDivisionId = division?.parent_division_id;

      // if squad or division is undefined, skip this iteration
      if (!division) {
        acc.orphanSquads.push(squad);
        return acc;
      }

      // If a parentDivisionId exists but is not in our list of known divisions,
      // treat the current division as a root division.
      if (parentDivisionId && !allDivisionIds.has(parentDivisionId)) {
        parentDivisionId = null;
      }

      if (!parentDivisionId) {
        // If the division has no valid parent, treat it as a root division
        const divisionName = division.name;
        if (!acc.rootDivisions[divisionName]) {
          acc.rootDivisions[divisionName] = [];
        }
        acc.rootDivisions[divisionName].push(squad);
      } else {
        // If the division has a parent, group it under that parent division
        const parentId = parentDivisionId;
        if (!acc.childDivisions[parentId]) {
          acc.childDivisions[parentId] = [];
        }
        acc.childDivisions[parentId].push(squad);
      }
      return acc;
    },
    {
      rootDivisions: {},
      childDivisions: {},
      orphanSquads: [],
    }
  );

  const result: FlatItem[] = [];
  // Sort root divisions by their names using localeSort
  const sortedRootDivisionNames = localeSort(
    Object.keys(rootDivisions),
    locale
  );

  // Flatten the organized data based on the mode, this is to determine how we want to display the hierarchy
  // If we want to display the hierarchy as divisions and conferences or divisions and squads
  sortedRootDivisionNames.forEach((divisionName) => {
    const squadsInRootDivision = rootDivisions[divisionName];
    if (!squadsInRootDivision || squadsInRootDivision.length === 0) return;

    const firstSquadInDivision = squadsInRootDivision[0];
    const rootDivision = firstSquadInDivision.division;
    // If the root division is not defined, we skip this iteration
    if (!rootDivision) return;

    if (mode === 'divisionsAndConferences') {
      result.push({
        name: firstSquadInDivision.name,
        id: firstSquadInDivision.id,
        indentLevel: 0,
        disabled: false,
      });

      const children = childDivisions[rootDivision.id];
      if (children) {
        children.forEach((childSquad) => {
          result.push({
            name: childSquad.name,
            id: childSquad.id,
            indentLevel: 1,
            disabled: false,
          });

          const grandchildren = childDivisions[childSquad.division?.id];
          if (grandchildren?.length) {
            grandchildren.forEach((grandchild) => {
              result.push({
                name: grandchild.name,
                id: grandchild.id,
                indentLevel: 2,
                disabled: false,
              });
            });
          }
        });
      }
    } else if (mode === 'divisionsAndSquads') {
      result.push({
        name: rootDivision.name,
        id: rootDivision.id,
        disabled: true,
        indentLevel: 0,
      });

      squadsInRootDivision.forEach((squad) => {
        result.push({
          name: squad.name,
          id: squad.id,
          indentLevel: 1,
          disabled: false,
        });
      });

      const childrenOfRootDivision = childDivisions[rootDivision.id];
      if (childrenOfRootDivision) {
        childrenOfRootDivision.forEach((childSquad) => {
          result.push({
            name: childSquad.name,
            id: childSquad.id,
            indentLevel: 1,
            disabled: false,
          });

          const grandchildren =
            childSquad.division && childDivisions[childSquad.division.id];
          if (grandchildren?.length) {
            grandchildren.forEach((grandchild) => {
              result.push({
                name: grandchild.name,
                id: grandchild.id,
                indentLevel: 2,
                disabled: false,
              });
            });
          }
        });
      }
    }
  });
  // Add orphan squads at the end of the result
  // Orphan squads are those that do not belong to any division or have a parent division
  orphanSquads.forEach((squad) => {
    result.push({
      name: squad.name,
      id: squad.id,
      indentLevel: 0,
      disabled: false,
    });
  });

  return result;
};
