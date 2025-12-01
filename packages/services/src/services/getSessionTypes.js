// @flow
import $ from 'jquery';

export type SessionTypeCategory = {
  id: number,
  name: string,
};
export type SessionType = {
  id: number,
  name: string,
  is_joint_practice: boolean,
  category: ?SessionTypeCategory,
};
export type SessionTypes = Array<SessionType>;

const getSessionTypes = (): Promise<SessionTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/session_types',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSessionTypes;
