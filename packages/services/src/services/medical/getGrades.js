// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type Grade = {
  id: number,
  name: string,
  sites: Array<{
    id: number,
    name: string,
  }>,
};
export type Grades = Array<Grade>;

const getGrades = (): Promise<Grades> =>
  ajaxPromise({
    method: 'GET',
    url: '/ui/medical/bamic_grades',
  });

export default getGrades;
