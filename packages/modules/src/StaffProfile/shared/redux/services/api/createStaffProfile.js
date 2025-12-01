// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  ValueTypes,
  HumanInputForm,
} from '@kitman/modules/src/HumanInput/types/forms';

export type Answer = {
  form_element_id: number,
  value: ValueTypes,
};

export type RequestBody = {
  answers: Array<Answer>,
};

type Props = {
  requestBody: RequestBody,
};

export type RequestResponse = {
  data: HumanInputForm,
};

const createStaffProfile = async (props: Props): Promise<RequestResponse> => {
  const { requestBody } = props;

  try {
    const { data } = await axios.post('/administration/staff', requestBody);

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

export default createStaffProfile;
