import { axios } from '@kitman/common/src/utils/services';

import organisationSwitcher from '../put';

describe('put', () => {
  const organisationId = 123;

  it('calls the correct endpoint with the correct data and headers', async () => {
    const axiosPut = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.resolve());

    await organisationSwitcher(organisationId);

    expect(axiosPut).toHaveBeenCalledTimes(1);
    expect(axiosPut).toHaveBeenCalledWith(
      '/settings/organisation_switcher',
      { organisationId, isInCamelCase: true },
      { headers: { Accept: 'application/json' } }
    );
  });

  it('throws an error if the request fails', async () => {
    jest.spyOn(axios, 'put').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () =>
      organisationSwitcher(organisationId)
    ).rejects.toThrow();
  });
});
