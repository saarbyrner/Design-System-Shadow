// @flow
/* eslint-disable camelcase */
import uuid from 'uuid';
import type {
  AthleteRow,
  MultiRegistrationRow,
  MultiSquadRow,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import type {
  Squad,
  Athlete,
  MultiRegistration,
  UserType,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  FALLBACK_DASH,
  USER_TYPES,
  USER_ENDPOINT_DATE_FORMAT,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  getDateOrFallback,
  getClubAvatar,
  displayRegistrationStatus,
  getLeagueText,
  getSquadText,
  getSquadNumbers,
  MOCK_ORGANISATION,
} from '@kitman/modules/src/LeagueOperations/shared/utils';

export const transformToAthleteRows = ({
  rawRowData,
  currentUserType,
}: {
  rawRowData: Array<Athlete>,
  currentUserType: UserType,
}): Array<AthleteRow> => {
  return (
    rawRowData?.map(
      ({
        id,
        fullname,
        organisations,
        squads,
        date_of_birth,
        avatar_url,
        user_id,
        registrations,
        address,
        type,
        position,
        squad_numbers,
        non_registered = false,
        registration_system_status,
        registration_status,
        labels,
      }) => {
        const athlete = [
          {
            id,
            text: fullname,
            avatar_src: avatar_url ?? '',
            href: `/registration/profile?id=${user_id}`,
          },
        ];

        const commmonColumns = {
          id,
          id_number: id,
          user_id,
          athlete,
          organisations: organisations.map((org) => getClubAvatar(org)),
          leagues: getLeagueText(registrations),
          date_of_birth: getDateOrFallback(
            date_of_birth,
            USER_ENDPOINT_DATE_FORMAT
          ),
          position: position?.name ? position.name : FALLBACK_DASH,
          non_registered,
          registration_status: displayRegistrationStatus(registrations),
          registration_system_status,
          registrations,
          registration_status_reason:
            registration_status?.registration_status_reason,
          labels,
        };

        if (currentUserType === USER_TYPES.ORGANISATION_ADMIN) {
          return {
            ...commmonColumns,
            squads,
            teams:
              squads.length > 0
                ? squads.map((squad) => ` ${squad.name}`)
                : FALLBACK_DASH,
            address: address ? [address?.state] : [FALLBACK_DASH],
            type,
            jersey_no: getSquadNumbers(squad_numbers),
          };
        }
        return {
          ...commmonColumns,
          team: {
            id: squads[0].id,
            text: squads[0].name,
          },
          teams: getSquadText(squads),
        };
      }
    ) || []
  );
};

export const transformMultiRegistrationToRows = (
  rawRowData: Array<MultiRegistration>
): Array<MultiRegistrationRow> => {
  return (
    rawRowData?.map(({ id, division, status }) => {
      return {
        id: id || uuid.v4(),
        organisations: [MOCK_ORGANISATION],
        dob: null,
        leagues: division?.name || FALLBACK_DASH,
        position: FALLBACK_DASH,
        registration_status: status || null,
      };
    }) || []
  );
};

export const transformMultiSquadToRows = (
  rawRowData: Array<Squad>
): Array<MultiSquadRow> => {
  return (
    rawRowData?.map(({ id, name }) => {
      return {
        id,
        team: { text: name, href: `/registration/squads/${id}` },
      };
    }) || []
  );
};
