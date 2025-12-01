import { evaluateCondition } from '../conditional';

describe('evaluateCondition()', () => {
  describe('operator: ==', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: true },
      { variableA: 1, variableB: 2, expected: false },
      { variableA: 2, variableB: 1, expected: false },
      { variableA: 'one', variableB: 'one', expected: true },
      { variableA: 'one', variableB: 'two', expected: false },
      { variableA: 'two', variableB: 'one', expected: false },
      { variableA: true, variableB: true, expected: true },
      { variableA: true, variableB: false, expected: false },
      { variableA: false, variableB: true, expected: false },
      { variableA: false, variableB: false, expected: true },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '==',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: <=', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: true },
      { variableA: 1, variableB: 2, expected: true },
      { variableA: 2, variableB: 1, expected: false },
      { variableA: 'one', variableB: 'one', expected: true },
      { variableA: 'one', variableB: 'two', expected: true },
      { variableA: 'two', variableB: 'one', expected: false },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '<=',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: !=', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: false },
      { variableA: 1, variableB: 2, expected: true },
      { variableA: 2, variableB: 1, expected: true },
      { variableA: 'one', variableB: 'one', expected: false },
      { variableA: 'one', variableB: 'two', expected: true },
      { variableA: 'two', variableB: 'one', expected: true },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '!=',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: <', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: false },
      { variableA: 1, variableB: 2, expected: true },
      { variableA: 2, variableB: 1, expected: false },
      { variableA: 'one', variableB: 'one', expected: false },
      { variableA: 'one', variableB: 'two', expected: true },
      { variableA: 'two', variableB: 'one', expected: false },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '<',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: >', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: false },
      { variableA: 1, variableB: 2, expected: false },
      { variableA: 2, variableB: 1, expected: true },
      { variableA: 'one', variableB: 'one', expected: false },
      { variableA: 'one', variableB: 'two', expected: false },
      { variableA: 'two', variableB: 'one', expected: true },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '>',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: >=', () => {
    const assertions = [
      { variableA: 1, variableB: 1, expected: true },
      { variableA: 1, variableB: 2, expected: false },
      { variableA: 2, variableB: 1, expected: true },
      { variableA: 'one', variableB: 'one', expected: true },
      { variableA: 'one', variableB: 'two', expected: false },
      { variableA: 'two', variableB: 'one', expected: true },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: '>=',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: and', () => {
    const assertions = [
      { variableA: true, variableB: true, expected: true },
      { variableA: false, variableB: false, expected: false },
      { variableA: true, variableB: false, expected: false },
      { variableA: false, variableB: true, expected: false },
      { variableA: null, variableB: null, expected: false },
      { variableA: true, variableB: null, expected: false },
      { variableA: null, variableB: true, expected: false },
      { variableA: undefined, variableB: undefined, expected: false },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: 'and',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: or', () => {
    const assertions = [
      { variableA: true, variableB: true, expected: true },
      { variableA: true, variableB: false, expected: true },
      { variableA: false, variableB: true, expected: true },
      { variableA: null, variableB: null, expected: false },
      { variableA: true, variableB: null, expected: true },
      { variableA: null, variableB: true, expected: true },
      { variableA: undefined, variableB: undefined, expected: false },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: 'or',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: not', () => {
    const assertions = [
      { variableA: true, variableB: true, expected: false },
      { variableA: false, variableB: false, expected: true },
      { variableA: true, variableB: false, expected: false },
      { variableA: false, variableB: true, expected: false },
      { variableA: null, variableB: null, expected: true },
      { variableA: true, variableB: null, expected: false },
      { variableA: null, variableB: true, expected: false },
      { variableA: undefined, variableB: undefined, expected: true },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: 'not',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });

  describe('operator: in', () => {
    const assertions = [
      { variableA: true, variableB: [true], expected: true },
      { variableA: false, variableB: [false], expected: true },
      { variableA: true, variableB: [false], expected: false },
      { variableA: false, variableB: [true], expected: false },
      { variableA: 1, variableB: [1], expected: true },
      { variableA: 1, variableB: [2], expected: false },
      { variableA: '1', variableB: ['1'], expected: true },
      { variableA: '1', variableB: ['2'], expected: false },
      { variableA: '1', variableB: [], expected: false },
      { variableA: [], variableB: '1', expected: false },
    ];

    assertions.forEach((assertion) => {
      test(`when variableA is ${assertion.variableA} and variableB is ${
        assertion.variableB
      }, expected is ${assertion.expected.toString()}`, () => {
        expect(
          evaluateCondition({
            operator: 'in',
            variableA: assertion.variableA,
            variableB: assertion.variableB,
          })
        ).toBe(assertion.expected);
      });
    });
  });
});
