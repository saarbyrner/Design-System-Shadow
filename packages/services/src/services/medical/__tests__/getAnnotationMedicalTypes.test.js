import $ from 'jquery';
import { data as mockedAnnotationTypes } from '@kitman/services/src/mocks/handlers/medical/getAnnotationMedicalTypes';
import getAnnotationMedicalTypes from '../getAnnotationMedicalTypes';

describe('getAnnotationMedicalTypes', () => {
  let getAnnotationMedicalTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getAnnotationMedicalTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAnnotationTypes));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.featureFlags = {};
  });

  describe('When rehab-note and display-telephone-note feature flags are on', () => {
    beforeEach(() => {
      window.featureFlags['rehab-note'] = true;
      window.featureFlags['display-telephone-note'] = true;
    });
    afterEach(() => {
      window.featureFlags = {};
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAnnotationMedicalTypes();

      expect(returnedData).toEqual(mockedAnnotationTypes);

      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledTimes(1);
      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/annotations/medical_types',
      });
    });
  });

  describe('When rehab-note feature flag is off', () => {
    beforeEach(() => {
      window.featureFlags['rehab-note'] = false;
      window.featureFlags['display-telephone-note'] = true;
    });
    afterEach(() => {
      window.featureFlags = {};
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAnnotationMedicalTypes();
      const withoutRehab = mockedAnnotationTypes.filter(
        (annotation) =>
          annotation.type !== 'OrganisationAnnotationTypes::RehabSession'
      );
      expect(returnedData).toEqual(withoutRehab);

      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledTimes(1);
      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/annotations/medical_types',
      });
    });
  });

  describe('When display-telephone-note feature flag is off', () => {
    beforeEach(() => {
      window.featureFlags['rehab-note'] = true;
      window.featureFlags['display-telephone-note'] = false;
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAnnotationMedicalTypes();
      const withoutTelephone = mockedAnnotationTypes.filter(
        (annotation) =>
          annotation.type !== 'OrganisationAnnotationTypes::Telephone'
      );
      expect(returnedData).toEqual(withoutTelephone);

      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledTimes(1);
      expect(getAnnotationMedicalTypesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/annotations/medical_types',
      });
    });
  });
});
