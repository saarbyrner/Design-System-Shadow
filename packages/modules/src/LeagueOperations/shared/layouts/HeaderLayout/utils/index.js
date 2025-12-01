// @flow
import AvatarItem from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/AvatarItem';
import {
  FALLBACK_REGISTRATION_SYSTEM_STATUS,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  renderRegistrationSystemStatusChip,
  renderStatusChip,
} from '@kitman/modules/src/LeagueOperations/shared/utils';
import type {
  Organisation,
  Division,
  RegistrationObject,
  RegistrationStatus,
  RegistrationSystemStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import BackLink from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/BackLink';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import HeaderAvatar from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/HeaderAvatar';

import { getLogoByDivision } from '@kitman/modules/src/LeagueOperations/technicalDebt';

export const buildOrganisationHeaderItem = ({
  org,
  registrationStatus,
}: {
  org: Organisation,
  registrationStatus: ?RegistrationObject,
}) => {
  return (
    <AvatarItem
      key={org.id}
      src={org?.logo_full_path}
      primary={org.name}
      secondary={renderStatusChip(
        registrationStatus?.status || RegistrationStatusEnum.INCOMPLETE
      )}
    />
  );
};

export const buildDivisionHeaderItem = ({
  division,
  registrationStatus,
  registrationSystemStatus,
}: {
  division: Division,
  registrationStatus: ?RegistrationStatus,
  registrationSystemStatus: ?RegistrationSystemStatus,
}) => {
  const source = getLogoByDivision(division?.name);
  const useRegistrationSystemStatus =
    window.featureFlags['league-ops-update-registration-status'];
  const status = useRegistrationSystemStatus
    ? renderRegistrationSystemStatusChip(
        registrationSystemStatus || FALLBACK_REGISTRATION_SYSTEM_STATUS
      )
    : renderStatusChip(registrationStatus || RegistrationStatusEnum.INCOMPLETE);
  return (
    <AvatarItem
      sx={{
        minWidth: 'auto',
        textWrap: 'nowrap',
      }}
      key={division?.id}
      src={source}
      primary={division?.name}
      secondary={status}
    />
  );
};

export const buildBackBar = ({ hasUrlParams }: { hasUrlParams: boolean }) => {
  if (!hasUrlParams) {
    return null;
  }

  return (
    <HeaderLayout.BackBar>
      <BackLink />
    </HeaderLayout.BackBar>
  );
};

export const buildHeaderAvatar = ({
  name,
  avatarUrl,
}: {
  name: string,
  avatarUrl: ?string,
}) => {
  return (
    <HeaderLayout.Avatar>
      <HeaderAvatar alt={name} src={avatarUrl} variant="large" />
    </HeaderLayout.Avatar>
  );
};
