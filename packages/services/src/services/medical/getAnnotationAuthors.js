// @flow
import { axios } from '@kitman/common/src/utils/services';

export type AnnotationAuthor = {
  id: number,
  fullname: string,
};
export type AnnotationAuthors = Array<AnnotationAuthor>;

export type AuthorsScope = {
  athleteId: ?number,
  injuryId: ?number,
  illnessId: ?number,
  isModification: boolean,
};

const getAnnotationAuthors = async ({
  athleteId,
  injuryId,
  illnessId,
  isModification = false,
}: AuthorsScope): Promise<AnnotationAuthors> => {
  const { data } = await axios.get('/medical/notes/authors', {
    params: {
      athlete_id: athleteId || null,
      ...((injuryId || illnessId) && {
        issue_occurrence: {
          id: injuryId || illnessId,
          type: injuryId ? 'injury' : 'illness',
        },
      }),
      // null means BE will return all authors
      organisation_annotation_type: isModification
        ? ['OrganisationAnnotationTypes::Modification']
        : null,
    },
  });

  return data;
};

export default getAnnotationAuthors;
