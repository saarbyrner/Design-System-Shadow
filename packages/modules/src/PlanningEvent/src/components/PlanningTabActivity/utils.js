// @flow
import { areaSize, sportType } from '@kitman/common/src/types/Event';
import type { AreaSize, SportType } from '@kitman/common/src/types/Event';
import i18n from '@kitman/common/src/utils/i18n';

export const EMPTY_TAGS_REGEXP = /(((<\w+>)+[ \n(<br>)]*(<\/\w+>)+)+)|<br>/g;

export const getAreaSizeLabel = (size: AreaSize): string =>
  ({
    [areaSize.Small]: i18n.t('Small'),
    [areaSize.Medium]: i18n.t('Medium'),
    [areaSize.Large]: i18n.t('Large'),
    [areaSize.Xlarge]: i18n.t('X-Large'),
  }[size]);

export const getDiagramPlaceholder = (sport: SportType): string => {
  switch (sport) {
    case sportType.Soccer: {
      return '/img/soccer_drill_diagram_placeholder.svg';
    }

    case sportType.GAA: {
      return '/img/gaa_drill_diagram_placeholder.svg';
    }

    case sportType.RugbyUnion:
    case sportType.RugbyLeague: {
      return '/img/rugby_drill_diagram_placeholder.svg';
    }

    // Defaulting to soccer pitch, shouldn’t be needed.
    default: {
      return '/img/soccer_drill_diagram_placeholder.svg';
    }
  }
};
