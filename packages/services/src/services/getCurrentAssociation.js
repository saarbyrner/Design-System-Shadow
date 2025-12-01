// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type Period = {
  name: string,
  id: number,
  duration: number,
  order: number,
};

export type Association = {
  // id: number, Removed from returned data
  // country: string,  Removed from returned data
  // name: string,  Removed from returned data
  // abbreviation: string,  Removed from returned data
  periods: Array<Period>,
  period_term: string,
};

const getCurrentAssociation = (): Promise<Association> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/associations/current',
    contentType: 'application/json',
  });

export default getCurrentAssociation;
