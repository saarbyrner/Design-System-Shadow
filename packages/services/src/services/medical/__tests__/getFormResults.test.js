import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/medical/getFormResults';
import getFormResults from '@kitman/services/src/services/medical/getFormResults';

describe('getFormResults', () => {
  describe('Handler response', () => {
    it('returns handler data', async () => {
      const returnedData = await getFormResults(123);
      expect(returnedData).toEqual(data);
    });
  });

  describe('Axios mocked', () => {
    let getFormResultsRequest;

    beforeEach(() => {
      getFormResultsRequest = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct concussion endpoint with the correct arguments', async () => {
      const formId = 123;
      const returnedData = await getFormResults(formId);
      expect(getFormResultsRequest).toHaveBeenCalledTimes(1);
      expect(getFormResultsRequest).toHaveBeenCalledWith(
        `/ui/concussion/form_answers_sets/${formId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(returnedData).toEqual(data);
    });

    describe('[FEATURE FLAG] medical-forms-new-endpoints', () => {
      beforeEach(() => {
        window.featureFlags['medical-forms-new-endpoints'] = true;
      });
      afterEach(() => {
        window.featureFlags = {};
      });

      it('calls the correct endpoint with the correct arguments', async () => {
        const formId = 456;
        const returnedData = await getFormResults(formId);
        expect(getFormResultsRequest).toHaveBeenCalledTimes(1);
        expect(getFormResultsRequest).toHaveBeenCalledWith(
          `/forms/form_answers_sets/${formId}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        expect(returnedData).toEqual(data);
      });
    });
  });
});
