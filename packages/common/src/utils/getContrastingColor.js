// @flow
import { colors } from '@kitman/common/src/variables';

/**
 * Function to calculate luminance and determine contrasting text color
 * Returns either black or white based on the provided background color.
 *
 * @param {string} hexColor - color provided in hex format (e.g., '#RRGGBB').
 * @returns {string} - The contrasting text color (either black or white).
 */

const getContrastingColor = (hexColor: string): string => {
  // Remove the # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate relative luminance using the formula from WCAG
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? colors.black_100 : colors.white;
};

export default getContrastingColor;
