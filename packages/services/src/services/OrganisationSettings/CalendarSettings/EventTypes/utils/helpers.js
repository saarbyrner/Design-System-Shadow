// @flow

import { customEventTypesUrlBase } from './consts';

export const createUpdateEventTypesUrl = (id: number) =>
  `${customEventTypesUrlBase}/${id}`;
