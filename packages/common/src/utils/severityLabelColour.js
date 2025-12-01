// @flow
import { colors } from '@kitman/common/src/variables';

/**
 * Takes in a severity (string) value, returns the correct backgroundColor.
 * For use in Allergies / future sections that utilise the Severity param & label
 */

const severityLabelColour = (severity: string) =>
  ({
    none: colors.neutral_200,
    mild: colors.yellow_100,
    moderate: colors.orange_100,
    severe: colors.red_100,
  }[severity || 'mild']);

export const severityFontColor = (severity: string) =>
  severity === 'severe' ? colors.white : colors.grey_400;

export default severityLabelColour;
