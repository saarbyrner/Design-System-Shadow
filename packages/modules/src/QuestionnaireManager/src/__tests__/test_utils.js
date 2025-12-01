// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { PlatformType } from '@kitman/common/src/types/__common';
import type { QuestionnaireVariable } from '@kitman/common/src/types';

const platformTypes = ['msk', 'capture', 'well_being', 'gym_scores'];

export const groupVariables = (variables: Array<QuestionnaireVariable>) => {
  const platforms = {};

  platformTypes.forEach((platform: PlatformType) => {
    platforms[platform] = [];
  });

  variables.forEach((variable: QuestionnaireVariable, index) => {
    platforms[variables[index].key].push(variable);
  });

  return platforms;
};

export const buildVariable = (platformType: PlatformType, index: string) => ({
  id: index,
  key: platformType,
  name: Math.random().toString(36).slice(2), // random string for name
});

export const buildVariables = (amount: number) => {
  const variables = [];
  for (let index = 0; index < amount; index++) {
    variables.push(buildVariable(platformTypes[index % 4], `tv_${index}`));
  }
  return variables;
};

const availabilities = ['available', 'unavailable', 'injured', 'returning'];

export const buildAthlete = (
  availability: $PropertyType<Athlete, 'availability'>,
  index: number
) => ({
  id: index,
  firstname: 'Foo',
  lastname: `Bar Baz ${index}`,
  availability,
  position: 'Blindside Flanker',
  positionGroup: 'Back',
  variable_ids: [
    `tv_${Math.floor(Math.random() * 100 + 1)}`,
    `tv_${Math.floor(Math.random() * 100 + 1)}`,
    `tv_${Math.floor(Math.random() * 100 + 1)}`,
  ],
  last_screening: '2017-05-05T10:31:14+01:00',
  screened_today: false,
});

export const buildAthletes = (numberAthletes: number) => {
  const athletes = [];
  for (let index = 0; index < numberAthletes; index++) {
    athletes.push(buildAthlete(availabilities[index % 4], index + 1));
  }
  return athletes;
};

export const platformOptions = [
  { name: 'Well-being', value: 'well_being' },
  { name: 'MSK', value: 'msk' },
  { name: 'Gym Scores', value: 'gym_scores' },
  { name: 'Capture', value: 'capture' },
];
