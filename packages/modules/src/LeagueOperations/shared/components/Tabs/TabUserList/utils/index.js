// @flow
/* eslint-disable camelcase */
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { UserRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  USER_ENDPOINT_DATE_FORMAT,
  FALLBACK_DASH,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import {
  getDateOrFallback,
  getClubAvatar,
  getLeagueText,
} from '@kitman/modules/src/LeagueOperations/shared/utils';

export default (rawRowData: Array<User>): Array<UserRow> => {
  return (
    rawRowData?.map(
      ({
        id,
        firstname,
        lastname,
        organisations,
        address,
        date_of_birth,
        avatar_url,
        registration_status,
        registration_system_status,
        registrations,
        user_title,
      }) => {
        return {
          id,
          user: [
            {
              id,
              text: `${firstname} ${lastname}`,
              avatar_src: avatar_url ?? '',
              href: `/registration/profile?id=${id}`,
            },
          ],
          id_number: id,
          organisations: organisations.map((org) => getClubAvatar(org)),
          leagues: getLeagueText(registrations),
          address: address ? [address?.state] : [FALLBACK_DASH],
          date_of_birth: getDateOrFallback(
            date_of_birth,
            USER_ENDPOINT_DATE_FORMAT
          ),
          registration_system_status,
          registration_status: registration_status?.status || null,
          registration_status_reason:
            registration_status?.registration_status_reason,
          registrations,
          title: user_title ?? FALLBACK_DASH,
        };
      }
    ) || []
  );
};
