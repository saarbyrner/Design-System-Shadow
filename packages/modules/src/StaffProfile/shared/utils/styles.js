// @flow

import { colors } from '@kitman/common/src/variables';
import {
  APP_BAR_HEIGHT,
  TITLE_BAR_HEIGHT,
  TABS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';

export const tabContainerSx = {
  height: `calc(100vh - ${APP_BAR_HEIGHT + TITLE_BAR_HEIGHT + TABS_HEIGHT}px)`,
  flexGrow: 1,
  background: colors.white,
  padding: 2,
};
