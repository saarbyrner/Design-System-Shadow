import { axios } from '@kitman/common/src/utils/services';
import { data as MOCK_DATA } from '@kitman/services/src/mocks/handlers/analysis/getData';
import getData from '../getData';

describe('getData', () => {
  let mockAxiosPost;

  beforeEach(() => {
    mockAxiosPost = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getData({
      id: 'chart_id',
      chart_type: 'value',
    });
    expect(data.data[0].id).toBe('chart_id');
    expect(data.data[0].chart).toStrictEqual(MOCK_DATA.value);
  });

  it('calls the correct endpoint and returns the correct data for different chart types', async () => {
    Promise.all(
      ['value', 'donut', 'summary_stack', 'line', 'bar'].map(async (type) => {
        const data = await getData({
          id: 'chart_id',
          chart_type: type,
        });

        expect(data.data[0].chart).toStrictEqual(MOCK_DATA[type]);
      })
    );
  });

  it('calls the correct endpoint without name when not provided', async () => {
    await getData({
      id: 123,
      chart_type: 'value',
      chart_elements: [],
    });

    expect(mockAxiosPost).toHaveBeenCalledWith(
      '/reporting/charts/preview?id=123',
      expect.any(Object),
      expect.objectContaining({ timeout: 0 })
    );
  });

  it('calls the correct endpoint with encoded name when name contains %', async () => {
    const params = {
      id: 901,
      name: 'Illnesses - Count (Absolute)%',
      chart_type: 'bar',
      chart_elements: [],
    };

    await getData(params);

    // Build expected URL using URLSearchParams
    const expectedParams = new URLSearchParams();
    expectedParams.append('id', String(params.id));
    expectedParams.append('name', params.name);

    const expectedUrl = `/reporting/charts/preview?${expectedParams.toString()}`;

    expect(mockAxiosPost).toHaveBeenCalledWith(
      expectedUrl,
      expect.any(Object),
      expect.objectContaining({ timeout: 0 })
    );
  });
});
