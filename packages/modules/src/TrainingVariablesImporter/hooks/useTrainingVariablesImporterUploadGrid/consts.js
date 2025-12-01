// @flow
import { mapHeaderKeysToColumnDef } from '@kitman/modules/src/shared/MassUpload/New/utils';
import { ExpectedHeaders, OptionalExpectedHeaders } from '../../consts';

export const columns = mapHeaderKeysToColumnDef([
  ExpectedHeaders.Id,
  ExpectedHeaders.FirstName,
  ExpectedHeaders.LastName,
  ExpectedHeaders.TimeMeasured,
  OptionalExpectedHeaders.MicroCycle,
]);
