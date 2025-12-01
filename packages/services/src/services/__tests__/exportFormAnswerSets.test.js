import { axios } from '@kitman/common/src/utils/services';
import exportFormAnswerSets from '../medical/exportFormAnswerSets';

describe('exportFormAnswerSets', () => {
  let request;
  const exportQuery = {
    category: 'testCategory',
    formType: null,
    group: 'testGroup',
    population: [
      {
        all_squads: false,
        applies_to_squad: false,
        athletes: [],
        context_squads: [1],
        position_groups: [],
        positions: [],
        squads: [1],
      },
    ],
  };

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData = await exportFormAnswerSets(exportQuery);
    const expectedResult = {
      csvData: 'Testing,One,Two,Three',
      contentDisposition: 'attachment; filename="testFilename.csv"',
    };
    expect(returnedData).toEqual(expectedResult);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      await exportFormAnswerSets(exportQuery);

      const bodyData = {
        population: exportQuery.population,
        category: exportQuery.category,
        form_type: null,
        group: exportQuery.group,
        start_date: undefined,
        end_date: undefined,
      };
      expect(request).toHaveBeenCalledWith(
        '/ui/concussion/form_answers_sets/export',
        bodyData
      );
    });
  });
});
