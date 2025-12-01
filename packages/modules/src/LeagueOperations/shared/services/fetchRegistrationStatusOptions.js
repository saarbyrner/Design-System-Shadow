// @flow
// import { axios } from '@kitman/common/src/utils/services';

import type { SelectOption } from '../types/common';
import response from './mocks/data/mock_registration_statuses';

const fetchRegistrationStatusOptions = async (): Promise<
  Array<SelectOption>
> => {
  // try {
  //   const { data } = await axios.get(`/ui/registration/statuses`, {
  //     headers: {
  //       'content-type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });
  //   return data;
  // } catch (err) {
  //   console.error(err);
  //   return response;
  // }

  return response;
};

export default fetchRegistrationStatusOptions;
