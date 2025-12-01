// @flow
import { axios } from '@kitman/common/src/utils/services';

type ThirdPartyEvent = {
  type: string,
  datetime: string,
  duration: number,
  unique_identifier: string,
  integration_date: string,
};

export type IntegrationEvents = Array<{
  event: ThirdPartyEvent,
  athletes: Array<{
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  }>,
  non_setup_athletes_identifiers: Array<string>,
}>;

export type IntegrationDataResponse = {
  events: IntegrationEvents,
  success: boolean,
};

const getIntegrationData = async ({
  integrationId,
  eventDate,
}: {
  integrationId: string | number,
  eventDate: string,
}): Promise<IntegrationDataResponse> => {
  const { data } = await axios.post(
    `/workloads/integrations/${integrationId}/fetch_data`,
    {
      date: eventDate,
    }
  );
  return data;
};

export default getIntegrationData;
