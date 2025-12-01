import { data } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';
import { axios } from '@kitman/common/src/utils/services';
import fetchExportableElements from '@kitman/services/src/services/exports/generic/redux/services/apis/fetchExportableElements';
import { ExportTypeValues } from '@kitman/services/src/services/exports/generic/redux/services/types';

describe('fetchExportableElements', () => {
  let fetchExportableElementsRequest;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    fetchExportableElementsRequest = jest.spyOn(axios, 'get');

    const returnedData = await fetchExportableElements(
      ExportTypeValues.ATHLETE_PROFILE
    );

    expect(returnedData).toEqual(data);
    expect(fetchExportableElementsRequest).toHaveBeenCalledTimes(1);
    expect(fetchExportableElementsRequest).toHaveBeenCalledWith(
      `/ui/exports/exportable_elements?export_type=${ExportTypeValues.ATHLETE_PROFILE}`,
      {
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
        },
      }
    );
  });

  it('calls the new endpoint - error response', async () => {
    fetchExportableElementsRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await fetchExportableElements();
    }).rejects.toThrow();
  });
});
