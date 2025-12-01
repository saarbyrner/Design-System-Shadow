import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/osics';
import {
  getInjuryOsics,
  getIllnessOsics,
  getInjuryOsicsPathologies,
  getIllnessOsicsPathologies,
  getInjuryOsicsClassifications,
  getIllnessOsicsClassifications,
  getInjuryOsicsBodyAreas,
  getIllnessOsicsBodyAreas,
} from '../osics';

describe('osics services', () => {
  describe('getInjuryOsics', () => {
    let getInjuryOsicsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getInjuryOsicsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data.injuries.osics));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getInjuryOsics();

      expect(returnedData).toEqual(data.injuries.osics);

      expect(getInjuryOsicsRequest).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/injuries/osics',
      });
    });
  });

  describe('getIllnessOsics', () => {
    let getIllnessOsicsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getIllnessOsicsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data.illnesses.osics));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getIllnessOsics();

      expect(returnedData).toEqual(data.illnesses.osics);

      expect(getIllnessOsicsRequest).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/illnesses/osics',
      });
    });
  });

  describe('getInjuryOsicsPathologies', () => {
    let getInjuryOsicsPathologiesRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getInjuryOsicsPathologiesRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.injuries.osics_pathologies)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getInjuryOsicsPathologies();

      expect(returnedData).toEqual(data.injuries.osics_pathologies);

      expect(getInjuryOsicsPathologiesRequest).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsPathologiesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/injuries/osics_pathologies',
      });
    });
  });

  describe('getIllnessOsicsPathologies', () => {
    let getIllnessOsicsPathologiesRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getIllnessOsicsPathologiesRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.illnesses.osics_pathologies)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getIllnessOsicsPathologies();

      expect(returnedData).toEqual(data.illnesses.osics_pathologies);

      expect(getIllnessOsicsPathologiesRequest).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsPathologiesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/illnesses/osics_pathologies',
      });
    });
  });

  describe('getInjuryOsicsClassifications', () => {
    let getInjuryOsicsClassificationsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getInjuryOsicsClassificationsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.injuries.osics_classifications)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getInjuryOsicsClassifications();

      expect(returnedData).toEqual(data.injuries.osics_classifications);

      expect(getInjuryOsicsClassificationsRequest).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsClassificationsRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/injuries/osics_classifications',
      });
    });
  });

  describe('getIllnessOsicsClassifications', () => {
    let getIllnessOsicsClassificationsRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getIllnessOsicsClassificationsRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.illnesses.osics_classifications)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getIllnessOsicsClassifications();

      expect(returnedData).toEqual(data.illnesses.osics_classifications);

      expect(getIllnessOsicsClassificationsRequest).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsClassificationsRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/illnesses/osics_classifications',
      });
    });
  });

  describe('getInjuryOsicsBodyAreas', () => {
    let getInjuryOsicsBodyAreasRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      deferred.resolveWith(null, [data.injuries.osics_body_areas]);

      getInjuryOsicsBodyAreasRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.injuries.osics_body_areas)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getInjuryOsicsBodyAreas();

      expect(returnedData).toEqual(data.injuries.osics_body_areas);

      expect(getInjuryOsicsBodyAreasRequest).toHaveBeenCalledTimes(1);
      expect(getInjuryOsicsBodyAreasRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/injuries/osics_body_areas',
      });
    });
  });

  describe('getIllnessOsicsBodyAreas', () => {
    let getIllnessOsicsBodyAreasRequest;

    beforeEach(() => {
      const deferred = $.Deferred();

      getIllnessOsicsBodyAreasRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(data.illnesses.osics_body_areas)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getIllnessOsicsBodyAreas();

      expect(returnedData).toEqual(data.illnesses.osics_body_areas);

      expect(getIllnessOsicsBodyAreasRequest).toHaveBeenCalledTimes(1);
      expect(getIllnessOsicsBodyAreasRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/medical/illnesses/osics_body_areas',
      });
    });
  });
});
