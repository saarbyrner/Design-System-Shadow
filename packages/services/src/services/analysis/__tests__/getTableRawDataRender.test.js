import { axios } from '@kitman/common/src/utils/services';
import getTableRawDataRender from '../getTableRowDataRender';

const mockServerResponse = {
  123: { value: { numerator: 236, denominator: 236 } },
};
const params = {
  tableContainerId: 1,
  rowId: 2,
  pivotParams: null,
};

const timeoutConfig = {
  timeout: 0,
};

describe('getTableRawDataRender', () => {
  let getTableRawRequest;

  beforeEach(() => {
    getTableRawRequest = jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: mockServerResponse });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the endpoint with the correct arguments', async () => {
    const { data } = await getTableRawDataRender(params);

    expect(data).toEqual(mockServerResponse);
    expect(getTableRawRequest).toHaveBeenCalledTimes(1);
    expect(getTableRawRequest).toHaveBeenCalledWith(
      `/table_containers/${params.tableContainerId}/table_rows/${params.rowId}/data_render`,
      null,
      timeoutConfig
    );
  });

  it('calls the endpoint with the correct body', async () => {
    const { data } = await getTableRawDataRender({
      ...params,
      pivotParams: {
        time_period_length: 123,
      },
    });

    expect(data).toEqual(mockServerResponse);
    expect(getTableRawRequest).toHaveBeenCalledWith(
      `/table_containers/${params.tableContainerId}/table_rows/${params.rowId}/data_render`,
      {
        time_period_length: 123,
      },
      timeoutConfig
    );
  });
});
