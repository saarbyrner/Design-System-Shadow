import { axios } from '@kitman/common/src/utils/services';
import { response as mock } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/handlers/searchMovementOrganisationsList';
import getAssociationsOrgs from '../../getAssociationsOrgs';

describe('getAssociationsOrgs', () => {
  it('calls the correct endpoint', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const returnedData = await getAssociationsOrgs({});

    expect(returnedData).toEqual(mock);

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('/ui/associations/organisations', {
      skip_exclude_organisation_ids: true,
    });
  });

  it('calls the correct endpoint with division ids', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const returnedData = await getAssociationsOrgs({ divisionIds: 1 });

    expect(returnedData).toEqual(mock);
    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith('/ui/associations/organisations', {
      division_ids: [1],
      skip_exclude_organisation_ids: true,
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'post').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getAssociationsOrgs();
    }).rejects.toThrow();
  });
});
