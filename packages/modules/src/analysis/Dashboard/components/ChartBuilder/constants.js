// @flow

export const GROUPING_OPTIONS = {
  timestamp: 'timestamp',
  microCycle: 'micro_cycle',
  drill: 'drill',
};

export default GROUPING_OPTIONS;

export const defaultPieOptions = ['show_label', 'show_legend'];

export const unsupportedMetrics = [
  'kitman',
  'kitman:tv',
  'kitman:athlete',
  'kitman:stiffness_indication',
  'kitman:soreness_indication',
  'kitman:injury_indication',
  'kitman:pain_indication',
];
