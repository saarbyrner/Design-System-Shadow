import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/getAssessmentTemplates';
import getAssessmentTemplates, {
  GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT,
} from '@kitman/services/src/services/getAssessmentTemplates';

describe('getAssessmentTemplates', () => {
  it('calls the correct endpoint using the correct HTTP method and returns expected data', async () => {
    const getAssessmentTemplatesRequest = jest.spyOn(axios, 'get');
    const returnedData = await getAssessmentTemplates();

    expect(returnedData).toEqual(data);
    expect(getAssessmentTemplatesRequest).toHaveBeenCalledTimes(1);
    expect(getAssessmentTemplatesRequest).toHaveBeenCalledWith(
      GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT
    );
  });
});
