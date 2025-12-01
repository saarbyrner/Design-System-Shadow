import getMovementType from '../MovementSelect/getMovementType';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

beforeEach(() => {
  window.featureFlags['league-ops-player-movement-trade'] = true;
  window.featureFlags['league-ops-player-movement-medical-trial'] = true;
});

describe('getMovementType', () => {
  it('returns association type options for association admin', () => {
    const props = {
      isAssociationAdmin: true,
      userMovementPermissions: {
        player: {
          trade: true,
          medicalTrial: true,
        },
      },
    };

    const result = getMovementType(props);

    expect(result).toEqual([{ value: 'trade', label: 'Move Player' }]);
  });

  it('returns organization type options for non-association admin', () => {
    const props = {
      isAssociationAdmin: false,
      userMovementPermissions: {
        player: {
          trade: false,
          medicalTrial: true,
        },
      },
    };

    const result = getMovementType(props);

    expect(result).toEqual([
      { value: 'medical_trial', label: 'Medical Trial' },
    ]);
  });

  it('filters options based on feature flags and user permissions', () => {
    window.featureFlags['league-ops-player-movement-trade'] = false;
    window.featureFlags['league-ops-player-movement-medical-trial'] = false;

    const props = {
      isAssociationAdmin: true,
      userMovementPermissions: {
        player: {
          trade: true,
          medicalTrial: true,
        },
      },
    };

    const result = getMovementType(props);

    expect(result).toEqual([]);
  });

  it('returns player movement release', () => {
    window.featureFlags['league-ops-player-movement-release'] = true;

    const props = {
      isAssociationAdmin: true,
      userMovementPermissions: {
        player: {
          release: true,
          medicalTrial: true,
        },
      },
    };

    const result = getMovementType(props);

    expect(result).toEqual([
      {
        label: 'Release',
        value: 'release',
      },
    ]);
  });
});
