// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { MovementType, Mode } from '../types';

export const MEDICAL_TRIAL: MovementType = 'medical_trial';
export const MEDICAL_TRIAL_V2: MovementType = 'medical_trial_v2';
export const TRADE: MovementType = 'trade';
export const RELEASE: MovementType = 'release';
export const LOAN: MovementType = 'loan';
export const RETIRE: MovementType = 'retire';
export const MULTI_ASSIGN: MovementType = 'multi_assign';
// To be as closely aligned with the DB, a trial type represents a medical trial
export const TRIAL: MovementType = 'trial';

export const MOVEMENT_ACTIVITY: string = 'movement_activity';

export const EDIT: Mode = 'EDIT';
export const VIEW: Mode = 'VIEW';

export const movementTypeOptions = [
  { value: TRADE, label: i18n.t('Trade') },
  { value: MULTI_ASSIGN, label: i18n.t('Multi Assign') },
  { value: MEDICAL_TRIAL, label: i18n.t('Medical Trial') },
  { value: MEDICAL_TRIAL_V2, label: i18n.t('Medical Trial') },
  { value: RELEASE, label: i18n.t('Release') },
  { value: RETIRE, label: i18n.t('Retire') },
];
