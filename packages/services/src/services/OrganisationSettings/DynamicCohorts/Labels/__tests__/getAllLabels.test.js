import { axios } from '@kitman/common/src/utils/services';
import { getAllLabels } from '@kitman/services/src/services/OrganisationSettings/index';
import { labels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';

describe('getAllLabels', () => {
  let getAllLabelsRequest;

  beforeEach(() => {
    getAllLabelsRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the right response', async () => {
    const response = await getAllLabels();

    expect(getAllLabelsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(labels);
  });

  it('calls the endpoint with the correct parameters when isSystemManaged is true', async () => {
    const response = await getAllLabels({ isSystemManaged: true });

    expect(getAllLabelsRequest).toHaveBeenCalledWith(
      expect.stringContaining('/labels'),
      expect.objectContaining({
        params: { include_system_managed: true },
      })
    );
    expect(response).toEqual(labels);
  });
});
