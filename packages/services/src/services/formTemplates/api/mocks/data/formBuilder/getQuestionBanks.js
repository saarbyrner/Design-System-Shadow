// @flow

export const numberData = {
  questions: [
    {
      source: 'kitman:tv',
      variable: 'body_weight',
      description: 'Body Weight',
      type: 'float',
      unit: 'kg',
      min: 50,
      max: 150,
    },
    {
      source: 'kitman:tv',
      variable: 'sit_and_reach',
      description: 'Sit & Reach',
      type: 'float',
      unit: 'cm',
      min: -20,
      max: 50,
    },
  ],
};

export const multipleChoiceData = {
  questions: [
    {
      source: 'kitman:choice',
      variable: 'sleep_quality',
      description: 'Sleep Quality',
      type: 'choice',
      choices: [
        {
          name: 'Poor',
          key: 'poor',
          default_score: 1,
          default_colour: '#abc123',
        },
        {
          name: 'OK',
          key: 'ok',
          default_score: 3,
          default_colour: '#abc456',
        },
        {
          name: 'Great',
          key: 'great',
          default_score: 10,
          default_colour: '#abc999',
        },
      ],
    },
  ],
};
