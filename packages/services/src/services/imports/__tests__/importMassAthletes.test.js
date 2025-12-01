import { data as response } from '@kitman/services/src/mocks/handlers/imports/importMassAthletes';
import $ from 'jquery';
import importMassAthletes from '../importMassAthletes';

describe('importMassAthletes', () => {
  let getImportMassAthletesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getImportMassAthletesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(response));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await importMassAthletes(1, 25);

    expect(returnedData).toEqual(response);
  });

  describe('filters by import_type', () => {
    it('filters by import_type athlete_import', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: 'athlete_import', status: null };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: 'athlete_import',
          status: null,
        },
      });
    });
    it('filters by import_type user_import', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: 'user_import', status: null };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: 'user_import',
          status: null,
        },
      });
    });
    it('filters by import_type official_import', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: 'official_import', status: null };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: 'official_import',
          status: null,
        },
      });
    });
  });

  describe('filters by status', () => {
    it('filters by status pending', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: null, status: 'pending' };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: null,
          status: 'pending',
        },
      });
    });
    it('filters by status completed', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: null, status: 'completed' };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: null,
          status: 'completed',
        },
      });
    });

    it('filters by status errored', async () => {
      const nextPage = null;
      const itemsPerPage = null;
      const filters = { import_type: null, status: 'errored' };
      await importMassAthletes({
        nextPage,
        itemsPerPage,
        filters,
      });

      expect(getImportMassAthletesRequest).toHaveBeenCalledTimes(1);
      expect(getImportMassAthletesRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/import_jobs',
        data: {
          page: null,
          per_page: null,
          import_type: null,
          status: 'errored',
        },
      });
    });
  });
});
