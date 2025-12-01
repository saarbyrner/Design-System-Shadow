// @flow
import type { Squad } from '@kitman/common/src/types/__common';
import type { InitialData } from '@kitman/services/src/services/getInitialData';

export type AppHeaderProps = {
  locale: string,
  logoPath: string,
  logoPathRetina: string,
  currentUser: Object,
  currentSquad: ?Squad,
  availableSquads: Array<Squad>,
  orgNickname: string,
  adminBar?: $PropertyType<InitialData, 'admin_bar'>,
  currentOrganisation?: boolean,
};
