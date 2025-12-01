import { data as MOCK_DATA } from '@kitman/services/src/mocks/handlers/analysis/getFormations';
import { getFormations } from '../getFormations';

describe('getFormations', () => {
  it('getFormations calls the correct endpoint and returns the correct data', async () => {
    const data = await getFormations();

    expect(data[0].id).toBe(MOCK_DATA[0].id);
    expect(data[0].name).toBe(MOCK_DATA[0].name);
  });
});
