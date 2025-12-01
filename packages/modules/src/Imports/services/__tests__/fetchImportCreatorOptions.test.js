import { data } from '../mocks/data/mock_fetch_import_creators';

import fetchImportCreatorOptions from '../api/fetchImportCreatorOptions';

describe('fetchImportCreatorOptions', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchImportCreatorOptions();

    expect(returnedData).toEqual(data);
  });
});
