import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getPreliminarySchema';
import getPreliminarySchema, {
  GET_PRELIMINARY_SCHEMA_URL,
} from '../getPreliminarySchema';

describe('getPreliminarySchema', () => {
  const params = {
    issue_type: 'new_injury',
    issue_occurrence_date: '2025-11-24',
  };
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPreliminarySchema(params);
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('issue_occurrence_date', () => {
      it('calls the correct endpoint with issue_occurrence_date present', async () => {
        await getPreliminarySchema(params);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(GET_PRELIMINARY_SCHEMA_URL, {
          params,
        });
      });

      it('calls the correct endpoint when issue_occurrence_date is null', async () => {
        const nullDateParams = {
          issue_type: 'new_injury',
          issue_occurrence_date: null,
        };
        await getPreliminarySchema(nullDateParams);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(GET_PRELIMINARY_SCHEMA_URL, {
          params: nullDateParams,
        });
      });

      it('calls the correct endpoint when issue_occurrence_date is an empty string', async () => {
        const emptyDateParams = {
          issue_type: 'new_injury',
          issue_occurrence_date: '',
        };
        await getPreliminarySchema(emptyDateParams);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(GET_PRELIMINARY_SCHEMA_URL, {
          params: emptyDateParams,
        });
      });
    });
  });
});
