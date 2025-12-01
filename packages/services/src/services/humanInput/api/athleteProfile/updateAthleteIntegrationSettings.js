// @flow

import { axios } from '@kitman/common/src/utils/services';

export type RequestProps = {
  athleteId: number,
  requestBody: {
    inputs: Array<{
      key: string,
      value: string,
    }>,
  },
};

const updateAthleteIntegrationSettings = async ({
  athleteId,
  requestBody,
}: RequestProps): Promise<void> => {
  await axios.put(`/athletes/${athleteId}/integration_settings`, requestBody);
};

export default updateAthleteIntegrationSettings;
