// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ExportableElements,
  ExportType,
} from '@kitman/services/src/services/exports/generic/redux/services/types';

const fetchExportableElements = async (
  exportType: ExportType
): Promise<ExportableElements> => {
  try {
    const { data } = await axios.get(
      `/ui/exports/exportable_elements?export_type=${exportType}`,
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchExportableElements;
