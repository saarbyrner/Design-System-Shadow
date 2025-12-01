// @flow
import type { Intensities } from '@kitman/common/src/types/Event';
import type { Translation } from '@kitman/common/src/types/i18n';
import { intensities } from '@kitman/common/src/types/Event';
import { colors } from '@kitman/common/src/variables';

export const eventIntensityStyles: {
  [Intensities]: {
    color: string,
    backgroundColor: string,
  },
} = {
  [intensities.Light]: {
    color: colors.white,
    backgroundColor: colors.teal_300,
  },
  [intensities.Moderate]: {
    color: colors.grey_400,
    backgroundColor: colors.yellow_100,
  },
  [intensities.High]: {
    color: colors.white,
    backgroundColor: colors.red_100,
  },
};

export const getIntensityTranslation = (
  // intensity’s type isn’t ?Intensities because it equals to
  // Intensities | null | typeof undefined, but back end returns null
  // explicitly.
  intensity: Intensities | null,
  t: Translation
): string => {
  const intensityNotAvailable = t('N/A');
  const translations: { [Intensities | null]: string } = {
    [intensities.Light]: t('Light'),
    [intensities.Moderate]: t('Moderate'),
    [intensities.High]: t('High'),
    null: intensityNotAvailable,
  };
  // If intensity === undefined or intensity === '', something went wrong. To
  // not break functionality of the app, there’s a || check. There’re no
  // mappings for undefined and '' in translations to denote that these values
  // are unexpected.
  return translations[intensity] || intensityNotAvailable;
};
