import { setUserMovementPermissions, defaultUserMovementPermissions } from '..';

describe('User Movement Permissions', () => {
  const generateExpectation = (
    medicalTrialValue,
    releaseValue,
    tradeValue,
    viewHistoryValue
  ) => ({
    medicalTrial: medicalTrialValue,
    release: releaseValue,
    trade: tradeValue,
    viewHistory: viewHistoryValue,
  });

  const testPermissionCases = [
    {
      permissions: ['manage-player-movement-medical-trial'],
      expected: {
        player: generateExpectation(true, false, false, false),
      },
    },

    {
      permissions: ['manage-player-movement-release'],
      expected: {
        player: generateExpectation(false, true, false, false),
      },
    },
    {
      permissions: ['manage-player-movement-trade'],
      expected: {
        player: generateExpectation(false, false, true, false),
      },
    },

    {
      permissions: ['view-player-movement-history'],
      expected: {
        player: generateExpectation(false, false, false, true),
      },
    },
  ];

  it.each(testPermissionCases)(
    'returns the correct permissions when %p',
    ({ permissions, expected }) => {
      const result = setUserMovementPermissions(permissions);
      expect(result).toEqual(expected);
    }
  );

  it('returns the correct default permissions for user-movement module', () => {
    const result = setUserMovementPermissions();
    expect(result).toEqual(defaultUserMovementPermissions);
  });
});
