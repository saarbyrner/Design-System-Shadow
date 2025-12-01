// @flow
import { mapHeaderKeysToColumnDef } from '@kitman/modules/src/shared/MassUpload/New/utils';

const massUploadKitManagementColumns = mapHeaderKeysToColumnDef([
  'Type',
  'Club',
  'Season',
  'Kit name',
  'Kit Color',
  'Jersey Color',
  'Jersey URL',
  'Shorts Color',
  'Shorts URL',
  'Socks Color',
  'Socks URL',
]);

export default massUploadKitManagementColumns;
