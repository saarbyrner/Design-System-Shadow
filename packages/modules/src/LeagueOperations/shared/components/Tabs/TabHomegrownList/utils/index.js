// @flow
/* eslint-disable camelcase */
import type { Homegrown } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { HomegrownRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import { getDateOrFallback } from '@kitman/modules/src/LeagueOperations/shared/utils';
import { USER_ENDPOINT_DATE_FORMAT } from '@kitman/modules/src/LeagueOperations/shared/consts';

export default (rawRowData: Array<Homegrown>): Array<HomegrownRow> => {
  return (
    rawRowData?.map(
      ({
        id,
        title,
        date_submitted,
        submitted_by,
        certified_by,
        homegrown_document,
        certified_document,
      }) => {
      // gets the documents and filters out any falsy values
      // this is useful in case one of the documents is not provided (as homegrown_document is optional )
      const documents = [homegrown_document, certified_document].filter(Boolean);

      return {
        id,
        title,
        date_submitted: getDateOrFallback(
          date_submitted,
          USER_ENDPOINT_DATE_FORMAT
        ),
        submitted_by,
        certified_by,
        documents,
      };
      }
    ) || []
  );
};
