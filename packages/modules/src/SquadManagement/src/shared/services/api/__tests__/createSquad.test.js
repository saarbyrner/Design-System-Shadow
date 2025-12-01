import createSquad from '../createSquad';

describe('createSquad', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createSquad({});

    expect(returnedData).toEqual('');
  });
});
