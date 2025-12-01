// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  MEDICAL_TRIAL,
  MEDICAL_TRIAL_V2,
  LOAN,
  TRADE,
  MULTI_ASSIGN,
  RELEASE,
} from '@kitman/modules/src/UserMovement/shared/constants';

import type { MovementType } from '../../../types';

type Instructions = {
  primary: string,
  secondary: string,
};

const NOT_YET_SUPPORTED: string = i18n.t('Not yet supported');

export const getInstructions = ({
  type,
  step,
}: {
  type: MovementType,
  step: number,
}): Instructions => {
  if (!(type || step)) return { primary: '', secondary: '' };
  const notYetSupported = {
    '0': {
      primary: NOT_YET_SUPPORTED,
      secondary: NOT_YET_SUPPORTED,
    },
    '1': {
      primary: NOT_YET_SUPPORTED,
      secondary: NOT_YET_SUPPORTED,
    },
  };

  // Not tested any further. Only use is medical trial and this will be deprecated from here soon
  const config = {
    medical_trial: {
      '0': {
        primary: i18n.t('Sharing a player will:'),
        secondary: i18n.t(
          'Give the chosen club access to this players medical records for 3 days.'
        ),
      },
      '1': {
        primary: i18n.t('You are about to share a player’s medical records.'),
        secondary: i18n.t('Would you like to continue?'),
      },
    },
    medical_trial_v2: {
      '0': {
        primary: i18n.t('Sharing a player will:'),
        secondary: i18n.t(
          'Give the chosen club access to this players medical records for 3 days.'
        ),
      },
      '1': {
        primary: i18n.t('You are about to share a player’s medical records.'),
        secondary: i18n.t('Would you like to continue?'),
      },
    },
    trade: notYetSupported,
    trial: notYetSupported,
    release: notYetSupported,
    loan: notYetSupported,
    multi_assign: notYetSupported,
    retire: notYetSupported,
  };
  return config[type][step.toString()];
};

export const getSteps = ({ type }: { type: MovementType }): Array<string> => {
  const steps = {
    medical_trial: [i18n.t('Gather information'), i18n.t('Review and share')],
    medical_trial_v2: [
      i18n.t('Gather information'),
      i18n.t('Review and share'),
    ],
    trade: [i18n.t('Gather information'), i18n.t('Review and trade')],
    trial: [i18n.t('Gather information'), i18n.t('Review and trade')],
    release: [i18n.t('Gather information'), i18n.t('Review and release')],
    loan: [i18n.t('Gather information'), i18n.t('Review and loan')],
    multi_assign: [i18n.t('Gather information'), i18n.t('Review and loan')],
    retire: [i18n.t('Gather information'), i18n.t('Review and loan')],
  };

  return steps[type];
};

export const getTitle = ({ type }: { type: MovementType }): string => {
  switch (type) {
    case MEDICAL_TRIAL:
    case MEDICAL_TRIAL_V2:
      return i18n.t('Medical Trial');
    case LOAN:
    case TRADE:
    case MULTI_ASSIGN:
    case RELEASE:
    default:
      return i18n.t('Unsupported');
  }
};

export const getMovementConfirmationLabel = ({
  type,
}: {
  type: MovementType,
}): string => {
  switch (type) {
    case MEDICAL_TRIAL:
    case MEDICAL_TRIAL_V2:
      return i18n.t('Medical trial with');
    case LOAN:
    case TRADE:
    case MULTI_ASSIGN:
    case RELEASE:
    default:
      return i18n.t('Unsupported');
  }
};
