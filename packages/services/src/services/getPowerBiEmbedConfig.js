// @flow
import { axios } from '@kitman/common/src/utils/services';

export type EmbedConfig = {
  report_id: number,
  report_name: string,
  embed_url: string,
  embed_token: string,
  ms_report_id: string,
};

const getPowerBiEmbedConfig = async (
  reportId: number
): Promise<EmbedConfig> => {
  const { data } = await axios.get(`/pbi_reports/${reportId}`);
  return data;
};

export default getPowerBiEmbedConfig;
