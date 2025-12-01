// @flow
import { axios } from '@kitman/common/src/utils/services';

type ThirdPartyImports = Array<{
  id: number,
  rows: Array<{
    [key: string]: {
      value: number | null,
      id: string | null,
      editable: boolean,
    },
  }>,
}>;

const getThirdPartyImports = async ({
  eventId,
  integrationName,
}: {
  eventId: string,
  integrationName: string,
}): Promise<ThirdPartyImports> => {
  const { data } = await axios.get(
    `planning_hub/events/${eventId}/third_party_imports/${integrationName}`
  );
  return data;
};

export default getThirdPartyImports;
