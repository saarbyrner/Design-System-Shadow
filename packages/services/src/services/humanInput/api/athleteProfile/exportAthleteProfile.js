// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportType } from '@kitman/services/src/services/exports/generic/redux/services/types';

type Field = {
  object: string,
  field: string,
  address?: string,
};

export type RequestBody = {
  ids: Array<number>,
  filename?: string,
  export_type: ExportType,
  fields: Array<Field>,
};

const exportAthleteProfile = async (
  requestBody: RequestBody
  // This string contains the CSV
): Promise<string> => {
  try {
    const { data } = await axios.post(
      '/administration/athletes/export_profile',
      requestBody
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default exportAthleteProfile;
