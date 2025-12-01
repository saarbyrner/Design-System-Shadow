import getConcussionFormAnswersSetsList from '../getConcussionFormAnswersSetsList';
import {
  concussionBaselinesData,
  concussionIncidentFormsData,
} from '../../../mocks/handlers/medical/getConcussionFormAnswersSetsList';

describe('getConcussionFormAnswersSetsList', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const filter = {
      athleteId: 1,
      category: 'concussion',
    };

    const returnedData = await getConcussionFormAnswersSetsList(filter);
    expect(returnedData).toEqual(concussionBaselinesData);
  });

  it('calls the correct endpoint with correct filter values', async () => {
    const filter = {
      athleteId: 1,
      category: 'concussion',
      group: 'incident',
      formType: 'incident',
    };

    const returnedData = await getConcussionFormAnswersSetsList(filter);
    expect(returnedData).toEqual(concussionIncidentFormsData);
  });
});
