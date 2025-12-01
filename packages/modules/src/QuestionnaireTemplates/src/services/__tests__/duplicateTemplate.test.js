import $ from 'jquery';
import duplicateTemplate from '../duplicateTemplate';

const mockedQuestionnaireTemplate = {
  id: 1,
  name: 'Template name',
};

describe('duplicateTemplate', () => {
  let duplicateTemplateRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    duplicateTemplateRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedQuestionnaireTemplate));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await duplicateTemplate(1, 'Template name');

    expect(returnedData).toEqual(mockedQuestionnaireTemplate);

    expect(duplicateTemplateRequest).toHaveBeenCalledTimes(1);
    expect(duplicateTemplateRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/settings/questionnaire_templates/1/duplicate',
      headers: {
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
      data: JSON.stringify({
        name: 'Template name',
      }),
    });
  });
});
