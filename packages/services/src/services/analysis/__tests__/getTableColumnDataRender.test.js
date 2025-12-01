import { axios } from '@kitman/common/src/utils/services';
import getTableColumnDataRender from '../getTableColumnDataRender';

const mockServerResponse = {
  123: { value: { numerator: 236, denominator: 236 } },
};
const params = {
  tableContainerId: 1,
  columnId: 2,
  data: {},
};

const timeoutConfig = {
  timeout: 0,
};

describe('getTableColumnDataRender', () => {
  let getTableColumnRequest;

  beforeEach(() => {
    getTableColumnRequest = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: mockServerResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the endpoint with the correct arguments', async () => {
    const { data } = await getTableColumnDataRender(params);

    expect(data).toEqual(mockServerResponse);
    expect(getTableColumnRequest).toHaveBeenCalledTimes(1);
    expect(getTableColumnRequest).toHaveBeenCalledWith(
      `/table_containers/${params.tableContainerId}/table_columns/${params.columnId}/data_render`,
      {},
      timeoutConfig
    );
  });

  it('calls the endpoint with the correct body', async () => {
    const { data } = await getTableColumnDataRender({
      ...params,
      data: {
        time_period_length: 123,
      },
    });

    expect(data).toEqual(mockServerResponse);
    expect(getTableColumnRequest).toHaveBeenCalledWith(
      `/table_containers/${params.tableContainerId}/table_columns/${params.columnId}/data_render`,
      {
        time_period_length: 123,
      },
      timeoutConfig
    );
  });
});
