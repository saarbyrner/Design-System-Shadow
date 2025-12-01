// @flow
import $ from 'jquery';

export type AnnotationAuthor = {
  id: number,
  fullname: string,
};
export type AnnotationAuthors = Array<AnnotationAuthor>;

export type AuthorsScope = {
  athleteId: ?number,
  injuryId: ?number,
  illnessId: ?number,
};

const getModificationAuthors = ({
  athleteId,
  injuryId,
  illnessId,
}: AuthorsScope): Promise<AnnotationAuthors> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/medical/modifications/authors',
      data: {
        athlete_id: athleteId || null,
        ...((injuryId || illnessId) && {
          issue_occurrence: {
            id: injuryId || illnessId,
            type: injuryId ? 'injury' : 'illness',
          },
        }),
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getModificationAuthors;
