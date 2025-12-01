// @flow
import type { Node } from 'react';

import type { Athlete } from '@kitman/common/src/types/Athlete';

export const sortAthletes = (athletes: Array<Athlete>): Array<Athlete> =>
  athletes.sort((a, b) => {
    // athletes are order by lastname then firstname
    const firstAthleteName = `${a.lastname} ${a.firstname}`;
    const secondAthleteName = `${b.lastname} ${b.firstname}`;

    return firstAthleteName.localeCompare(secondAthleteName);
  });

export const athletesToIds = (athletes: Array<Athlete>): Array<Athlete> =>
  sortAthletes(athletes).map((athlete) => athlete.id);

export const athletesToMap = (
  athletes: Array<Athlete>
): { [$PropertyType<Athlete, 'id'>]: Athlete } =>
  athletes.reduce((hash, athlete) => {
    // Using Object.assign as that's what eslint recommends
    // https://github.com/airbnb/javascript/issues/719
    Object.assign(hash, { [athlete.id]: athlete });
    return hash;
  }, {});

export const getEmptyCells = (
  amount: ?number,
  cellClassName: string
): Array<Node> => {
  const emptyCells = [];
  if (amount === 0) {
    return [];
  }

  if (amount) {
    for (let i = 0; i < amount; i++) {
      emptyCells.push(<div key={i} className={cellClassName} />);
    }
  }

  return emptyCells;
};
