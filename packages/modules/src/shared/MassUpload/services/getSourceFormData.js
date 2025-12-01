// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SourceFormDataResponse = {
  file_sources: { [string]: string },
  integrations: Array<{
    id: number,
    name: string,
    source_identifier: string,
    third_party_source_id: number,
  }>,
};

const getSourceFormData = async (): Promise<SourceFormDataResponse> => {
  const { data } = await axios.get(
    '/workloads/import_workflow/source_form_data'
  );
  return data;
};

export default getSourceFormData;
