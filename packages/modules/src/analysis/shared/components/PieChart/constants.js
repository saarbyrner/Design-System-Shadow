// @flow
import i18n from '@kitman/common/src/utils/i18n';

const MARGIN = 50;
export const PAD_ANGLE = 0.015;
export const INNER_RADIUS_RATIO = 0.6;

export const defaultMargin = {
  top: MARGIN,
  right: MARGIN,
  bottom: MARGIN,
  left: MARGIN,
};

export const PIE_SERIES_TYPES = {
  pie: 'pie',
  donut: 'donut',
};

export const transitionConfig = { tension: 170, friction: 26, duration: 300 };

export const getOtherSegementLabel = () => i18n.t('Other Categories');
