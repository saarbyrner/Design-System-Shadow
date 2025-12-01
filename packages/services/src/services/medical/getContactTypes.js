// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type ContactType = {
  id: number,
  name: string,
};
export type ContactTypes = Array<ContactType>;

const getContactTypes = (): Promise<ContactTypes> =>
  ajaxPromise({
    url: '/ui/medical/injuries/contact_types',
    contentType: 'application/json',
    method: 'GET',
  });

export default getContactTypes;
