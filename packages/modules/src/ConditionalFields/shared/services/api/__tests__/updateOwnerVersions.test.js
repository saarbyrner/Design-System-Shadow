import updateOwnerVersions from '../updateOwnerVersions';

describe('updateOwnerVersions', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateOwnerVersions({
      rulesetId: 12345,
    });

    expect(returnedData).toEqual({ message: 'Success' });
  });
});
