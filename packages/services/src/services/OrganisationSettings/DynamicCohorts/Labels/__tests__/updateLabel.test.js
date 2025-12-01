import { axios } from '@kitman/common/src/utils/services';
import { updateLabel } from '@kitman/services/src/services/OrganisationSettings/index';
import { labelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/createLabel';

describe('updateLabel', () => {
  let updateLabelRequest;

  beforeEach(() => {
    updateLabelRequest = jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the updated label', async () => {
    const response = await updateLabel(labelResponse);

    expect(updateLabelRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(labelResponse);
  });
});
