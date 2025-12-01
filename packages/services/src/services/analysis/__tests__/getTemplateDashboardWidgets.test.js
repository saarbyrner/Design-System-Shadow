import { data as serverResponse } from '@kitman/services/src/mocks/handlers/analysis/getTemplateDashboardWidgets';
import getTemplateDashboardWidgets from '../getTemplateDashboardWidgets';

describe('getTemplateDashboardWidgets', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    const returnedData = await getTemplateDashboardWidgets('coaching');

    expect(returnedData).toEqual(serverResponse);
  });
});
