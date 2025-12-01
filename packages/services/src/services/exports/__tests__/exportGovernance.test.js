import { axios } from '@kitman/common/src/utils/services';
import { data as exportGovernanceResponse } from '@kitman/services/src/mocks/handlers/exports/exportGovernance';
import exportGovernance from '../exportGovernance';

describe('exportGovernance', () => {
  let exportGovernanceRequest;

  beforeEach(() => {
    exportGovernanceRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: exportGovernanceResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return the correct response value', async () => {
    const result = await exportGovernance({ competitionIds: [] });

    expect(result).toEqual(exportGovernanceResponse);
    expect(exportGovernanceRequest).toHaveBeenCalledTimes(1);
    expect(exportGovernanceRequest).toHaveBeenCalledWith(
      '/export_jobs/governance_export',
      {
        competition_ids: [],
      }
    );
  });
});
