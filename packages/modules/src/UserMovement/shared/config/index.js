/* eslint-disable camelcase */
// @flow
import type { RowAction } from '@kitman/components/src/DataGrid';
import i18n from '@kitman/common/src/utils/i18n';
import {
  MEDICAL_TRIAL,
  LOAN,
  TRADE,
  RELEASE,
  RETIRE,
  MULTI_ASSIGN,
  MOVEMENT_ACTIVITY,
} from '@kitman/modules/src/UserMovement/shared/constants';
import type { MovementPermissions } from '@kitman/modules/src/UserMovement/shared/types';

import type { MovementType } from '../types';

import type { Filters } from '../redux/services/api/searchMovementOrganisationsList';

export const getTitle = ({ type }: { type: MovementType }): string => {
  switch (type) {
    case MEDICAL_TRIAL:
      return i18n.t('Medical Trial');
    case LOAN:
      return i18n.t('Loan');
    case TRADE:
      return i18n.t('Trade');
    case RELEASE:
      return i18n.t('Release');
    case RETIRE:
      return i18n.t('Retire');
    case MULTI_ASSIGN:
      return i18n.t('Multi Assign');
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementDate = ({ type }: { type: MovementType }): string => {
  switch (type) {
    case MEDICAL_TRIAL:
      return i18n.t('Medical Trial Date');
    case LOAN:
      return i18n.t('Loan Date');
    case TRADE:
      return i18n.t('Date of Trade');
    case RELEASE:
      return i18n.t('Release Date');
    case RETIRE:
      return i18n.t('Retired Date');
    case MULTI_ASSIGN:
      return i18n.t('Multi Assign Date');
    default:
      return i18n.t('Unsupported');
  }
};

type Instructions = {
  title: string,
  steps: Array<string>,
};

export const getInstructions = ({
  type,
}: {
  type: MovementType,
}): Instructions => {
  const title = {
    medical_trial: i18n.t('Medical Trial will'),
    medical_trial_v2: i18n.t('Medical Trial will'),
    trial: i18n.t('Medical Trial will'),
    trade: i18n.t('Trade will'),
    release: i18n.t('Releasing will'),
    loan: i18n.t('Loan will'),
    multi_assign: i18n.t('Multi Assignment will'),
    retire: i18n.t('Retiring will'),
  };

  const removeMessage = i18n.t('Remove the player from the selected club.');
  const keepCurrentMessage = i18n.t(
    'Keep the player in their current club(s) if any.'
  );

  const config = {
    medical_trial: [
      i18n.t(
        'Give the chosen club access to this players medical records for 3 days.'
      ),
    ],
    medical_trial_v2: [
      i18n.t(
        'Give the chosen club access to this players medical records for 3 days.'
      ),
    ],
    trade: [
      removeMessage,
      i18n.t('Add the player to the new club.'),
      i18n.t(`Add the player to the new team/squad.`),
    ],
    release: [removeMessage],
    loan: [removeMessage, keepCurrentMessage],
    multi_assign: [
      i18n.t('Add the player to the selected club.'),
      keepCurrentMessage,
    ],
    trial: [
      i18n.t(
        'Give the chosen club access to this players medical records for 3 days.'
      ),
    ],
    retire: [
      removeMessage,
      i18n.t('Add the player to the league as a retired player.'),
    ],
  };
  return {
    title: title[type],
    steps: config[type],
  };
};

export const getMovementFromLabel = ({
  type,
}: {
  type: MovementType,
}): string => {
  switch (type) {
    case TRADE:
      return i18n.t('Traded from');
    case RELEASE:
      return i18n.t('Release from');
    case RETIRE:
      return i18n.t('Retiring from');
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementToLabel = ({
  type,
}: {
  type: MovementType,
}): string => {
  switch (type) {
    case MULTI_ASSIGN:
      return i18n.t('Assign to');
    case TRADE:
      return i18n.t('Traded to');
    case MEDICAL_TRIAL:
      return i18n.t('Medical trial with');
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementAlertTitle = ({
  type,
}: {
  type: MovementType,
}): string => {
  switch (type) {
    case MULTI_ASSIGN:
      return i18n.t('Assign to options failed to load');
    case TRADE:
      return i18n.t('Traded to options failed to load');
    case MEDICAL_TRIAL:
      return i18n.t('Medical trial with options failed to load');
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementAlertNoDataContent = ({
  type,
}: {
  type: MovementType,
}): { title: string, message: string } => {
  switch (type) {
    case MULTI_ASSIGN:
      return {
        title: i18n.t('Assign to organisations not available'),
        message: i18n.t(
          'An association must have at least 2 organisations to continue'
        ),
      };
    case TRADE:
      return {
        title: i18n.t('Traded to organisations not available'),
        message: i18n.t(
          'An association must have at least 2 organisations to continue'
        ),
      };
    case MEDICAL_TRIAL:
      return {
        title: i18n.t('Medical trial with options failed to load'),
        message: i18n.t(
          'An association must have at least 2 organisations to continue'
        ),
      };
    default:
      return { title: i18n.t('Unsupported'), message: i18n.t('Unsupported') };
  }
};

type RowActionArgs = {
  onClick: Function,
  isAssociationAdmin?: boolean,
  permissions: MovementPermissions,
};

export const getMovementRowActions = (
  args: RowActionArgs = {
    onClick: () => {},
    isAssociationAdmin: false,
    permissions: {},
  }
): Array<RowAction> => {
  const medicalTrialAction = {
    id: MEDICAL_TRIAL,
    text: getTitle({ type: MEDICAL_TRIAL }),
    onCallAction: (currentAthleteId) => {
      args.onClick(currentAthleteId, MEDICAL_TRIAL);
    },
    isVisible:
      window.featureFlags['league-ops-player-movement-medical-trial'] &&
      !!args.permissions?.player?.medicalTrial,
  };

  const multiAssignAction = {
    id: MULTI_ASSIGN,
    text: getTitle({ type: MULTI_ASSIGN }),
    onCallAction: (currentAthleteId) => {
      args.onClick(currentAthleteId, MULTI_ASSIGN);
    },
    isVisible:
      window.featureFlags['league-ops-player-movement-trade'] &&
      !!args.permissions?.player?.trade,
  };

  const releaseAction = {
    id: RELEASE,
    text: getTitle({ type: RELEASE }),
    onCallAction: (currentAthleteId) => {
      args.onClick(currentAthleteId, RELEASE);
    },
    isVisible:
      window.featureFlags['league-ops-player-movement-release'] &&
      !!args.permissions?.player?.release,
  };

  const retireAction = {
    id: RETIRE,
    text: getTitle({ type: RETIRE }),
    onCallAction: (currentAthleteId) => {
      args.onClick(currentAthleteId, RETIRE);
    },
    isVisible: false,
  };

  const tradeAction = {
    id: TRADE,
    text: getTitle({ type: TRADE }),
    onCallAction: (currentAthleteId) => {
      args.onClick(currentAthleteId, TRADE);
    },
    isVisible:
      window.featureFlags['league-ops-player-movement-trade'] &&
      !!args.permissions?.player?.trade,
  };

  if (args.isAssociationAdmin) {
    return [tradeAction, releaseAction, retireAction, multiAssignAction]
      .filter((i) => i.isVisible)
      .map(({ isVisible, ...attrs }) => attrs);
  }

  return [medicalTrialAction]
    .filter((i) => i.isVisible)
    .map(({ isVisible, ...attrs }) => attrs);
};

export const getMovementToSquadLabel = ({
  type,
}: {
  type: MovementType,
}): string => {
  // Intentionally one case.
  switch (type) {
    default:
      return i18n.t('Team');
  }
};

export const getRetryText = ({ type }: { type: MovementType }): string => {
  // Intentionally one case.
  switch (type) {
    default:
      return i18n.t('Retry');
  }
};

export const getCreateRecordQueryParams = ({
  type,
  user_id,
}: {
  type: MovementType,
  user_id: number,
}): $Shape<Filters> => {
  const DEFAULT_QUERY_PARAMS = {
    exclude_memberships: false,
    exclude_trials: false,
    exclude_trials_v2: false,
    exclude_trades: false,
  };

  switch (type) {
    case MEDICAL_TRIAL:
      return {
        user_id,
        exclude_trials: true,
        exclude_trials_v2: true,
      };
    case MULTI_ASSIGN:
    case TRADE:
      return {
        user_id,
        exclude_trades: true,
      };
    default:
      return {
        ...DEFAULT_QUERY_PARAMS,
        user_id,
      };
  }
};

export const getTradeDateLabel = ({ type }: { type: MovementType }): string => {
  switch (type) {
    case MEDICAL_TRIAL:
      return i18n.t('Sharing Start Date');
    case LOAN:
      return i18n.t('Loan Start Date');
    case TRADE:
      return i18n.t('Date of Trade');
    case RELEASE:
      return i18n.t('Release Date');
    case RETIRE:
      return i18n.t('Retired Date');
    case MULTI_ASSIGN:
      return i18n.t('Multi Assign date');
    default:
      return i18n.t('Unsupported');
  }
};

export const getConfirmationModalTitle = ({
  type,
}: {
  type: MovementType,
}): string => {
  switch (type) {
    case MEDICAL_TRIAL:
      return i18n.t('Medical Trial Confirmation');
    case LOAN:
      return i18n.t('Loan Confirmation');
    case TRADE:
      return i18n.t('Trade Confirmation');
    case RELEASE:
      return i18n.t('Release Confirmation');
    case RETIRE:
      return i18n.t('Retired Confirmation');
    case MULTI_ASSIGN:
      return i18n.t('Multi Assign Confirmation');
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementHistoryAction = (
  args: RowActionArgs = {
    onClick: () => {},
    permissions: {},
  }
): Array<RowAction> => {
  if (!args?.permissions?.player?.viewHistory) return [];

  return [
    {
      id: MOVEMENT_ACTIVITY,
      text: i18n.t('Activity'),
      onCallAction: (currentAthleteId) => {
        args.onClick(currentAthleteId);
      },
    },
  ];
};
