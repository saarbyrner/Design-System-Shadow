import {
  getTitle,
  getMovementDate,
  getInstructions,
  getMovementFromLabel,
  getMovementToLabel,
  getMovementRowActions,
  getMovementToSquadLabel,
  getCreateRecordQueryParams,
  getRetryText,
  getMovementAlertNoDataContent,
  getMovementAlertTitle,
  getTradeDateLabel,
  getConfirmationModalTitle,
  getMovementHistoryAction,
} from '../index';

describe('config utils', () => {
  describe('getTitle', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Medical Trial' },
      { type: 'multi_assign', expected: 'Multi Assign' },
      { type: 'retire', expected: 'Retire' },
      { type: 'trade', expected: 'Trade' },
      { type: 'release', expected: 'Release' },
      { type: 'loan', expected: 'Loan' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getTitle({ type: assertion.type })).toEqual(assertion.expected);
      });
    });
  });
  describe('getMovementDate', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Medical Trial Date' },
      { type: 'multi_assign', expected: 'Multi Assign Date' },
      { type: 'retire', expected: 'Retired Date' },
      { type: 'trade', expected: 'Date of Trade' },
      { type: 'release', expected: 'Release Date' },
      { type: 'loan', expected: 'Loan Date' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getMovementDate({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });
  describe('getInstructions', () => {
    const assertions = [
      {
        type: 'medical_trial',
        expected: {
          title: 'Medical Trial will',
          steps: [
            'Give the chosen club access to this players medical records for 3 days.',
          ],
        },
      },
      {
        type: 'trial',
        expected: {
          title: 'Medical Trial will',
          steps: [
            'Give the chosen club access to this players medical records for 3 days.',
          ],
        },
      },
      {
        type: 'multi_assign',
        expected: {
          title: 'Multi Assignment will',
          steps: [
            'Add the player to the selected club.',
            'Keep the player in their current club(s) if any.',
          ],
        },
      },
      {
        type: 'retire',
        expected: {
          title: 'Retiring will',
          steps: [
            'Remove the player from the selected club.',
            'Add the player to the league as a retired player.',
          ],
        },
      },
      {
        type: 'trade',
        expected: {
          title: 'Trade will',
          steps: [
            'Remove the player from the selected club.',
            'Add the player to the new club.',
            'Add the player to the new team/squad.',
          ],
        },
      },
      {
        type: 'release',
        expected: {
          title: 'Releasing will',
          steps: ['Remove the player from the selected club.'],
        },
      },
      {
        type: 'loan',
        expected: {
          title: 'Loan will',
          steps: [
            'Remove the player from the selected club.',
            'Keep the player in their current club(s) if any.',
          ],
        },
      },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct instructions for ${assertion.type}`, () => {
        const expected = getInstructions({ type: assertion.type });
        expect(expected.title).toEqual(assertion.expected.title);
        expect(expected.steps).toEqual(assertion.expected.steps);
      });
    });
  });
  describe('getMovementFromLabel', () => {
    const assertions = [
      { type: 'retire', expected: 'Retiring from' },
      { type: 'trade', expected: 'Traded from' },
      { type: 'release', expected: 'Release from' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getMovementFromLabel({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });
  describe('getMovementToLabel', () => {
    const assertions = [
      { type: 'multi_assign', expected: 'Assign to' },
      { type: 'trade', expected: 'Traded to' },
      { type: 'medical_trial', expected: 'Medical trial with' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getMovementToLabel({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });

  describe('getMovementRowActions', () => {
    it('does not return anything if no permissions are present', () => {
      expect(getMovementRowActions()).toStrictEqual([]);
    });

    describe('medicalTrialAction', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('only returns the medicalTrialAction if the correct feature flag and permission is on and is not isAssociationAdmin', () => {
        window.featureFlags = {
          'league-ops-player-movement-medical-trial': true,
        };
        const expected = {
          id: 'medical_trial',
          onCallAction: expect.any(Function),
          text: 'Medical Trial',
        };

        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {
              player: {
                medicalTrial: true,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual([expected]);
      });
      it('does not otherwise', () => {
        window.featureFlags = {
          'league-ops-player-movement-medical-trial': false,
        };
        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {
              player: {
                medicalTrial: false,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });

    describe('multiAssignAction', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('does not return the action', () => {
        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {},
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });

    describe('retireAction', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('does not return the action', () => {
        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {},
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });

    describe('releaseAction', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('does not return the action', () => {
        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {},
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });

    describe('tradeAction', () => {
      afterEach(() => {
        window.featureFlags = {};
      });
      it('only returns the tradeAction if the correct feature flag and permission is on and isAssociationAdmin', () => {
        window.featureFlags = {
          'league-ops-player-movement-trade': true,
        };
        const expected = [
          {
            id: 'trade',
            onCallAction: expect.any(Function),
            text: 'Trade',
          },
          {
            id: 'multi_assign',
            onCallAction: expect.any(Function),
            text: 'Multi Assign',
          },
        ];

        expect(
          getMovementRowActions({
            isAssociationAdmin: true,
            permissions: {
              player: {
                trade: true,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual(expected);
      });
      it('does not otherwise', () => {
        window.featureFlags = {
          'league-ops-player-movement-trade': false,
        };
        expect(
          getMovementRowActions({
            isAssociationAdmin: false,
            permissions: {
              player: {
                trade: false,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });
  });
  describe('getMovementToSquadLabel', () => {
    it(`returns the correct title for anything really`, () => {
      expect(getMovementToSquadLabel({ type: 'anything' })).toEqual('Team');
    });
  });
  describe('getRetryText', () => {
    it(`returns the correct title for anything really`, () => {
      expect(getRetryText({ type: 'anything' })).toEqual('Retry');
    });
  });

  describe('getCreateRecordQueryParams', () => {
    const assertions = [
      {
        type: 'medical_trial',
        expected: { user_id: 1, exclude_trials: true, exclude_trials_v2: true },
      },
      { type: 'trade', expected: { user_id: 1, exclude_trades: true } },
      {
        type: 'multi_assign',
        expected: { user_id: 1, exclude_trades: true },
      },
      {
        type: 'release',
        expected: {
          user_id: 1,
          exclude_trades: false,
          exclude_trials: false,
          exclude_trials_v2: false,
          exclude_memberships: false,
        },
      },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(
          getCreateRecordQueryParams({ type: assertion.type, user_id: 1 })
        ).toEqual(assertion.expected);
      });
    });
  });

  describe('getMovementAlertTitle', () => {
    const assertions = [
      { type: 'multi_assign', expected: 'Assign to options failed to load' },
      { type: 'trade', expected: 'Traded to options failed to load' },
      {
        type: 'medical_trial',
        expected: 'Medical trial with options failed to load',
      },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getMovementAlertTitle({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });

  describe('getMovementAlertNoDataContent', () => {
    const assertions = [
      {
        type: 'medical_trial',
        expected: {
          title: 'Medical trial with options failed to load',
          message:
            'An association must have at least 2 organisations to continue',
        },
      },
      {
        type: 'multi_assign',
        expected: {
          title: 'Assign to organisations not available',
          message:
            'An association must have at least 2 organisations to continue',
        },
      },
      {
        type: 'trade',
        expected: {
          title: 'Traded to organisations not available',
          message:
            'An association must have at least 2 organisations to continue',
        },
      },

      {
        type: 'something_else',
        expected: {
          title: 'Unsupported',
          message: 'Unsupported',
        },
      },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct instructions for ${assertion.type}`, () => {
        const expected = getMovementAlertNoDataContent({
          type: assertion.type,
        });
        expect(expected.title).toEqual(assertion.expected.title);
        expect(expected.message).toEqual(assertion.expected.message);
      });
    });
  });

  describe('getTradeDateLabel', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Sharing Start Date' },
      { type: 'multi_assign', expected: 'Multi Assign date' },
      { type: 'retire', expected: 'Retired Date' },
      { type: 'trade', expected: 'Date of Trade' },
      { type: 'release', expected: 'Release Date' },
      { type: 'loan', expected: 'Loan Start Date' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getTradeDateLabel({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });

  describe('getConfirmationModalTitle', () => {
    const assertions = [
      { type: 'medical_trial', expected: 'Medical Trial Confirmation' },
      { type: 'multi_assign', expected: 'Multi Assign Confirmation' },
      { type: 'retire', expected: 'Retired Confirmation' },
      { type: 'trade', expected: 'Trade Confirmation' },
      { type: 'release', expected: 'Release Confirmation' },
      { type: 'loan', expected: 'Loan Confirmation' },
      { type: 'something_else', expected: 'Unsupported' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title for ${assertion.type}`, () => {
        expect(getConfirmationModalTitle({ type: assertion.type })).toEqual(
          assertion.expected
        );
      });
    });
  });

  describe('getMovementHistoryAction', () => {
    it('does not return anything if no permissions are present', () => {
      expect(getMovementHistoryAction()).toStrictEqual([]);
    });

    describe('permissions.player.viewHistory', () => {
      it('only returns the movementActivityAction if the permission is on', () => {
        const expected = {
          id: 'movement_activity',
          onCallAction: expect.any(Function),
          text: 'Activity',
        };

        expect(
          getMovementHistoryAction({
            permissions: {
              player: {
                viewHistory: true,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual([expected]);
      });
      it('does not otherwise', () => {
        expect(
          getMovementHistoryAction({
            permissions: {
              player: {
                viewHistory: false,
              },
            },
            onClick: jest.fn(),
          })
        ).toStrictEqual([]);
      });
    });
  });
});
