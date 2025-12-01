import {
  getInstructions,
  getSteps,
  getTitle,
  getMovementConfirmationLabel,
} from '../index';

describe('config utils', () => {
  describe('getInstructions()', () => {
    const assertions = [
      {
        type: 'medical_trial',
        step: 0,
        expected: {
          primary: 'Sharing a player will:',
          secondary:
            'Give the chosen club access to this players medical records for 3 days.',
        },
      },
      {
        type: 'medical_trial',
        step: 1,
        expected: {
          primary: 'You are about to share a player’s medical records.',
          secondary: 'Would you like to continue?',
        },
      },
      {
        type: 'trade',
        step: 0,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
      {
        type: 'trade',
        step: 1,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
      {
        type: 'release',
        step: 0,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
      {
        type: 'release',
        step: 1,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
      {
        type: 'loan',
        step: 0,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
      {
        type: 'loan',
        step: 1,
        expected: {
          primary: 'Not yet supported',
          secondary: 'Not yet supported',
        },
      },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct config for ${assertion.type} at step: ${assertion.step}`, () => {
        expect(
          getInstructions({ type: assertion.type, step: assertion.step })
        ).toEqual(assertion.expected);
      });
    });
  });

  describe('getSteps', () => {
    const assertions = [
      { type: 'medical_trial', expected: ['Review and share'] },
      { type: 'trade', expected: ['Review and trade'] },
      { type: 'release', expected: ['Review and release'] },
      { type: 'loan', expected: ['Review and loan'] },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct steps for ${assertion.type}`, () => {
        expect(getSteps({ type: assertion.type })).toEqual([
          'Gather information',
          ...assertion.expected,
        ]);
      });
    });
  });
  describe('getTitle', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Medical Trial' },
      { type: 'trade', expected: 'Unsupported' },
      { type: 'release', expected: 'Unsupported' },
      { type: 'loan', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getTitle({ type: assertion.type })).toEqual(assertion.expected);
      });
    });
  });

  describe('getMovementConfirmationLabel', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Medical trial with' },
      { type: 'trade', expected: 'Unsupported' },
      { type: 'release', expected: 'Unsupported' },
      { type: 'loan', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getMovementConfirmationLabel({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });
});
