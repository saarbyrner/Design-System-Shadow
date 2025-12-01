import { setDefaultSquadForPastAthlete } from '../utils';

const mockSquads = [
  { name: 'Squad 1', id: 1 },
  { name: 'Squad 2', id: 2 },
  { name: 'Squad 3', id: 3 },
  { name: 'Squad 4', id: 4 },
];

describe('setDefaultSquadForPastAthlete', () => {
  it('returns the correct value when the athlete is in the current squad', () => {
    const expectedResult = 1;
    const result = setDefaultSquadForPastAthlete(23, mockSquads);

    expect(result).toBe(expectedResult);
  });

  it('returns the correct value when the athlete is a past athlete', () => {
    const expectedResult = 23;
    const result = setDefaultSquadForPastAthlete(23, []);

    expect(result).toBe(expectedResult);
  });
});
