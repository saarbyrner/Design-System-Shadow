// @flow
export const data = {
  abbreviations: [
    'GK',
    'RB',
    'RWB',
    'CB',
    'LB',
    'LWB',
    'SWP',
    'DM',
    'RW',
    'CM',
    'LW',
    'AM',
    'WF',
    'CF',
  ],
  names: [
    'Goalkeeper',
    'Right Back',
    'Right Wing Back',
    'Centre Back',
    'Left Back',
    'Left Wing Back',
    'Sweeper',
    'Defensive Midfielder',
    'Right wing',
    'Central Midfielder',
    'Left Wing',
    'Attacking Midfielder',
    'Wing Forward',
    'Centre Forward',
  ],
};

type Options = {
  abbreviations: Array<string>,
  names: Array<string>,
};
const fetchValidPositionOptions = async (): Promise<Options> => {
  const response = data;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, 1000)
  );
};

export default fetchValidPositionOptions;
