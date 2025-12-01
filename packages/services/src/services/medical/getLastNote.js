// @flow
import $ from 'jquery';

type LastNote = {
  id: number,
  title: string,
  content: string,
  annotation_date: string,
};

const getLastNote = (
  athleteId: number,
  organisationAnnotationTypeId: ?number
): Promise<LastNote> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/medical/athletes/${athleteId}/notes/last_authored`,
      data: { organisation_annotation_type_id: organisationAnnotationTypeId },
    })
      .done((data) => resolve(data))
      .fail(() => reject());
  });

export default getLastNote;
