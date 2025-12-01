import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/getTemplateDashboards';
import getTemplateDashboards from '../getTemplateDashboards';

describe('getTemplateDashboards', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    const returnedData = await getTemplateDashboards('coaching');

    expect(returnedData).toEqual(serverResponse);
  });
});
