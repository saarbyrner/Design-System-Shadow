import $ from 'jquery';
import addTemplate from '../addTemplate';

const mockedQuestionnaireTemplate = {
  id: 1,
  name: 'Template name',
};

describe('addTemplate', () => {
  let addTemplateRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    addTemplateRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedQuestionnaireTemplate));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await addTemplate('Template name');

    expect(returnedData).toEqual(mockedQuestionnaireTemplate);

    expect(addTemplateRequest).toHaveBeenCalledTimes(1);
    expect(addTemplateRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/settings/questionnaire_templates/',
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
