import $ from 'jquery';
import saveAssessmentDetails from '../assessments';

const mockedAssessmentDetails = {
  assessment_group: { id: 1234, name: 'Test Name' },
};

describe('saveAssessmentDetails', () => {
  let saveAssessmentDetailsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveAssessmentDetailsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAssessmentDetails));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveAssessmentDetails(1234, 'Test Name');

    expect(returnedData).toEqual(mockedAssessmentDetails);

    expect(saveAssessmentDetailsRequest).toHaveBeenCalledTimes(1);
    expect(saveAssessmentDetailsRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/assessment_groups/1234',
      contentType: 'application/json',
      data: JSON.stringify({
        name: 'Test Name',
      }),
    });
  });
});
