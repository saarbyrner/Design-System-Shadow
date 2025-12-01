// @flow

import { getEmbedSDK } from '@looker/embed-sdk';
import { lookerConfig } from '@kitman/modules/src/analysis/LookerDashboardGroup/config/lookerConfig';

/**
 * Initialize Looker Embed SDK
 */

export const initLookerSdk = (host: string) => {
  getEmbedSDK().init(host, lookerConfig.embedPath);
};
