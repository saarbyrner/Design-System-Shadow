import { data } from '../mocks/data/mock_fetch_import_types';

import fetchImportTypeOptions from '../api/fetchImportTypeOptions';

describe('fetchImportTypeOptions', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchImportTypeOptions();

    expect(returnedData).toEqual(data);
  });
});
