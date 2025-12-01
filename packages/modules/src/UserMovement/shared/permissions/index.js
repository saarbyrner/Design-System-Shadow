// @flow
import type { MovementPermissions } from '../types';

export const defaultUserMovementPermissions: MovementPermissions = {
  player: {
    medicalTrial: false,
    release: false,
    trade: false,
    viewHistory: false,
  },
};

export const setUserMovementPermissions = (
  permissions: ?Array<string>
): MovementPermissions => {
  return {
    player: {
      medicalTrial: !!permissions?.includes(
        'manage-player-movement-medical-trial'
      ),
      release: !!permissions?.includes('manage-player-movement-release'),
      trade: !!permissions?.includes('manage-player-movement-trade'),
      viewHistory: !!permissions?.includes('view-player-movement-history'),
    },
  };
};
