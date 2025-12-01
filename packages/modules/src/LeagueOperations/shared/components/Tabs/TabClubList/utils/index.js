// @flow
/* eslint-disable camelcase */
import type { Organisation } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { OrganisationRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { FALLBACK_DASH } from '@kitman/modules/src/LeagueOperations/shared/consts';

export default (rawRowData: Array<Organisation>): Array<OrganisationRow> => {
  return (
    rawRowData?.map(
      ({
        id,
        name,
        logo_full_path,
        total_squads,
        total_staff,
        total_athletes,
        address,
        payment_details,
      }) => {
        return {
          id,
          organisations: [
            {
              id,
              text: name,
              avatar_src: logo_full_path ?? '',
              href: `/registration/organisations?id=${id}`,
            },
          ],
          total_squads,
          total_staff,
          total_athletes,
          address: address ? [address?.state] : [FALLBACK_DASH],
          amount_paid: payment_details?.balance
            ? payment_details.balance.paid
            : FALLBACK_DASH,
          wallet: payment_details?.balance
            ? payment_details.balance.wallet
            : FALLBACK_DASH,
        };
      }
    ) || []
  );
};
