// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type ImportType } from '@kitman/common/src/types/Imports';
import type { CsvUploadAdditionalUserTypes } from '@kitman/modules/src/AdditionalUsers/shared/types';

const massUpload = async (
  id: number,
  type: ImportType | string,
  userType: ?CsvUploadAdditionalUserTypes
): Promise<string> => {
  try {
    let params = {
      id,
      import_type: type,
    };

    if (userType) {
      params = { ...params, user_type: userType };
    }

    const { data } = await axios.post('/settings/mass_upload/create', params);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default massUpload;
