// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RegistrationFormsResponse = {
  id: number,
  category: string,
  group: string,
  key: string,
  name: string,
  fullname: string,
  form_type: string,
  config: null,
  enabled: boolean,
  created_at: string,
  updated_at: string,
};

type Props = {
  category: string,
};

const fetchForms = async ({
  category,
}: Props): Promise<Array<RegistrationFormsResponse>> => {
  const params = new URLSearchParams({
    category,
  }).toString();

  try {
    const { data } = await axios.get(`/ui/forms?${params}`);

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchForms;
