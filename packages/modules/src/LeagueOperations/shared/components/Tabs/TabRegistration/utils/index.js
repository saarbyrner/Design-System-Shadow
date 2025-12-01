// @flow
/* eslint-disable camelcase */
import uuid from 'uuid';
import type {
  Registrations,
  RegistrationRows,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { FALLBACK_DASH } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { getClubAvatar } from '@kitman/modules/src/LeagueOperations/shared/utils';

export default (
  rawRowData: Array<Registrations>,
  profile: ?User
): Array<RegistrationRows> => {
  return (
    rawRowData?.map(
      ({
        id,
        user_id,
        division,
        registration_requirement,
        athlete,
        status,
        registration_system_status,
        user,
      }) => {
        const params = new URLSearchParams({
          requirement_id: registration_requirement.id.toString(),
          user_id: user_id?.toString(),
        }).toString();
        const tabItems: RegistrationRows = {
          id: id || uuid.v4(),
          league: {
            text: division.name,
            href: `/registration/requirements?${params}`,
          },
          jersey_no:
            athlete && athlete.squad_numbers.length > 0
              ? athlete?.squad_numbers.map((number) => number)
              : FALLBACK_DASH,
          position: athlete?.position.name || FALLBACK_DASH,
          type: profile?.type || FALLBACK_DASH,
          title: FALLBACK_DASH,
          registration_status: status || null,
          registration_system_status,
          club: profile?.organisations.map((org) => getClubAvatar(org, true)),
          squad:
            user?.squads && user.squads.length > 0
              ? user.squads.map((squad) => ` ${squad.name}`)
              : FALLBACK_DASH,
        };

        return tabItems;
      }
    ) || []
  );
};
