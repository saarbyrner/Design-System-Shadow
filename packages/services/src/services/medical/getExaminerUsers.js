// @flow
import $ from 'jquery';
import type { ConcussionExaminerGroupType } from '@kitman/modules/src/Medical/shared/types/medical/ConcussionExaminerGroup';

export type ExaminerUser = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type ExaminerUsers = Array<ExaminerUser>;

const getExaminerUsers = (
  group: ConcussionExaminerGroupType
): Promise<ExaminerUsers> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/users/medical_examiners?group=${group}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getExaminerUsers;
