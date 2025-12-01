// @flow
import { axios } from '@kitman/common/src/utils/services';

type RequestParams = {
  userId: number,
  registrationId: number,
  sectionId: number,
};

export type SectionStatusesType = Array<{
  id: number,
  name: string,
  type: string,
}>;

const fetchSectionStatuses = async ({
  userId,
  sectionId,
  registrationId,
}: RequestParams): Promise<SectionStatusesType> => {
  const { data } = await axios.post(
    `/registration/registrations/${registrationId}/sections/${sectionId}/available_statuses`,
    {
      user_id: userId,
    }
  );

  return data;
};

export default fetchSectionStatuses;
