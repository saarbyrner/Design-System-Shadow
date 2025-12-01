import {
  emergencyContacts,
  insurancePolicyOwners,
} from '@kitman/services/src/mocks/handlers/getRelationTypes/data.mock';

import $ from 'jquery';
import getRelationTypes from '../getRelationTypes';

describe('getRelationTypes', () => {
  let request;

  describe('when using the emergency_contacts param', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve({ relations: emergencyContacts })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getRelationTypes('emergency_contacts');
      expect(returnedData).toEqual(emergencyContacts);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/relationships?context=emergency_contacts',
      });
    });
  });

  describe('when using the insurance_policy_owners param', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve({ relations: insurancePolicyOwners })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getRelationTypes('insurance_policy_owners');
      expect(returnedData).toEqual(insurancePolicyOwners);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/relationships?context=insurance_policy_owners',
      });
    });
  });
});
