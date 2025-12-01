// @flow
import { axios } from '@kitman/common/src/utils/services';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

const deleteMassUpload = async ({
  attachmentId,
  importType,
}: {
  attachmentId: number,
  importType: $Values<typeof IMPORT_TYPES>,
}): Promise<void> => {
  await axios.delete(
    `/settings/mass_upload/${attachmentId}/${importType}_import`
  );
};

export default deleteMassUpload;
