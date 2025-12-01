// @flow
import moment from 'moment';

export const MOVEMENT_ENUM_LIKE = {
  tryout: 'tryout',
  continuousCare: 'continuous_care',
};

export type POSITION_TYPE = 'start' | 'end';

export type MOVEMENT_TYPE = 'tryout' | 'continuous_care' | '';

export type MOMENT_DATE_RANGE = [moment.Moment | null, moment.Moment | null];
