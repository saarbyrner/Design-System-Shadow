import style from '../style';

const tests = [
  {
    description: 'when there is no input',
    input: {},
    expectedWidth: 'calc(100% + -1.5rem)',
    expectedRight: '-1.5rem',
  },
  {
    description: 'when there are no athletes nor staff',
    input: {
      athletes: {},
      staff: {},
    },
    expectedWidth: 'calc(100% + -1.5rem)',
    expectedRight: '-1.5rem',
  },
  {
    description:
      'when the numbers describing athletes form a longer string than staff’s ones',
    input: {
      athletes: { available: 10, total: 100 },
      staff: { available: 1, total: 1 },
    },
    expectedWidth: 'calc(100% + calc(-2.5rem - (.5rem * 5)))',
    expectedRight: 'calc(-2.5rem - (.5rem * 5))',
  },
  {
    description:
      'when the numbers describing staff form a longer string than athletes’ ones',
    input: {
      athletes: { available: 1, total: 1 },
      staff: { available: 10, total: 100 },
    },
    expectedWidth: 'calc(100% + calc(-2.5rem - (.5rem * 5)))',
    expectedRight: 'calc(-2.5rem - (.5rem * 5))',
  },
  {
    description: 'when the amount of athletes equals the amount of staff',
    input: {
      athletes: { available: 1, total: 1 },
      staff: { available: 1, total: 1 },
    },
    expectedWidth: 'calc(100% + calc(-2.5rem - (.5rem * 2)))',
    expectedRight: 'calc(-2.5rem - (.5rem * 2))',
  },
];

describe('style', () => {
  describe('wrapper()', () => {
    it.each(tests)('$description', ({ input, expectedWidth }) =>
      expect(style.wrapper(input).width).toBe(expectedWidth)
    );
  });

  describe('activityParticipantsCounts()', () => {
    it.each(tests)('$description', ({ input, expectedRight }) =>
      expect(style.activityParticipantsCounts(input).right).toBe(expectedRight)
    );
  });
});
