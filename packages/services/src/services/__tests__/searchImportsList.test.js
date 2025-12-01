import { data } from '@kitman/services/src/mocks/handlers/searchImportsList';

import searchImportsList from '../searchImportsList';

describe('searchImportsList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const { data: returnedData } = await searchImportsList({});

    expect(returnedData).toEqual(data);
  });
});
