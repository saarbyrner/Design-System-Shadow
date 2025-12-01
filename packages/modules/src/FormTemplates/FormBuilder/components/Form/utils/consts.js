// @flow
import {
  APP_BAR_HEIGHT,
  TABS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';

const FORM_HEADER_HEIGHT = 155;
const FORM_MENU_HEADER_HEIGHT = 86;
const FORM_CONTENT_HEADER_HEIGHT_WITH_PADDING = 108;

const extraFormHeight = APP_BAR_HEIGHT + FORM_HEADER_HEIGHT + TABS_HEIGHT;

export const menuStructureHeight = `calc(100vh - ${
  extraFormHeight + FORM_MENU_HEADER_HEIGHT
}px)`;

export const formContentHeightWithoutHeader = `calc(100vh - ${
  extraFormHeight + FORM_CONTENT_HEADER_HEIGHT_WITH_PADDING
}px)`;
