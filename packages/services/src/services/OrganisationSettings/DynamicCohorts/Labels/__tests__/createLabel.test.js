import { axios } from '@kitman/common/src/utils/services';
import { createLabel } from '@kitman/services/src/services/OrganisationSettings/index';
import {
  labelRequest,
  labelResponse,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/createLabel';

describe('createLabel', () => {
  let createLabelRequest;

  beforeEach(() => {
    createLabelRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and does not return a value', async () => {
    const response = await createLabel(labelRequest);

    expect(createLabelRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(labelResponse);
  });
});
