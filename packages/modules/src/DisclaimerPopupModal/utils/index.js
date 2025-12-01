// @flow
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import {
  nflPlayerDisclaimer1Content,
  nflPlayerDisclaimer2Content,
} from './nflPlayerDisclaimers';

export type DisclaimerContentType = {
  title?: string,
  content?: Node,
  footerButtonText?: string,
};

export const DISCLAIMER_TYPE = {
  NFL_PLAYER_DISCLAIMER_ON_LOAD: 'NFL_PLAYER_DISCLAIMER_ON_LOAD',
  NFL_PLAYER_DISCLAIMER_ON_EXPORT: 'NFL_PLAYER_DISCLAIMER_ON_EXPORT',
};

export const getDisclaimerContent = (
  disclaimerType: string
): DisclaimerContentType => {
  switch (disclaimerType) {
    case DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_LOAD: {
      return {
        title: i18n.t('Disclaimer'),
        content: nflPlayerDisclaimer1Content(),
        footerButtonText: i18n.t('I agree'),
      };
    }
    case DISCLAIMER_TYPE.NFL_PLAYER_DISCLAIMER_ON_EXPORT: {
      return {
        title: i18n.t('Disclaimer'),
        content: nflPlayerDisclaimer2Content(),
        footerButtonText: i18n.t('I acknowledge'),
      };
    }
    default:
      return {};
  }
};
