import {
  data as MOCK_DATA,
  dataById as MOCK_DATA_BY_ID,
} from '@kitman/services/src/mocks/handlers/analysis/labels';
import { getLabel, getLabels } from '../labels';

describe('labels', () => {
  it('getLabels calls the correct endpoint and returns the correct data', async () => {
    const data = await getLabels();

    expect(data[0].id).toBe(MOCK_DATA[0].id);
    expect(data[0].name).toBe(MOCK_DATA[0].name);
  });

  it('getLabel calls the correct endpoint and returns the correct data', async () => {
    const data = await getLabel(MOCK_DATA_BY_ID.id);

    expect(data.id).toBe(MOCK_DATA_BY_ID.id);
    expect(data.name).toStrictEqual(MOCK_DATA_BY_ID.name);
  });
});
