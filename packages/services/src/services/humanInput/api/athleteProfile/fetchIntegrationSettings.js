// @flow
import { axios } from '@kitman/common/src/utils/services';

export const generateFetchIntegrationSettingsUrl = (athleteId: number) =>
  `/athletes/${athleteId}/integration_settings/edit`;

export type IntegrationSettingsResponse = {
  inputs: Array<{ name: string, key: string, value: string }>,
  links: Array<{ name: string, url: string }>,
};

const fetchIntegrationSettings = async (
  athleteId: number
): Promise<IntegrationSettingsResponse> => {
  const url = generateFetchIntegrationSettingsUrl(athleteId);
  const { data } = await axios.get(url);

  return data;
};

export default fetchIntegrationSettings;
