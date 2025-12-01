import $ from 'jquery';
import serverResponse from '@kitman/services/src/mocks/handlers/saveAnnotation/data.mock';

import saveAnnotation from '../saveAnnotation';

describe('saveAnnotation', () => {
  let request;

  const annotationForm = {
    annotationable_type: 'Athlete',
    annotationable_id: 1,
    organisation_annotation_type_id: 2,
    title: 'Annotation title',
    annotation_date: '2018-01-01',
    content: 'Annotation content',
    illness_occurrence_ids: [1, 2],
    injury_occurrence_ids: [3, 4],
    restricted_to_doc: true,
    restricted_to_psych: true,
    attachments_attributes: [],
    annotation_actions_attributes: [],
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    request = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveAnnotation(annotationForm);

    expect(returnedData).toEqual(serverResponse);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/annotations',
      contentType: 'application/json',
      data: JSON.stringify(annotationForm),
    });
  });
});
