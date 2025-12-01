import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formBuilder/getFormHeaderDefaults';
import getFormHeaderDefaults, {
  GET_FORM_HEADER_DEFAULTS_ROUTE,
} from '../getFormHeaderDefaults';

describe('getFormHeaderDefaults', () => {
  let getFormHeaderDefaultsRequest;

  beforeEach(() => {
    getFormHeaderDefaultsRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getFormHeaderDefaults();

    expect(returnedData).toEqual(data);
    expect(getFormHeaderDefaultsRequest).toHaveBeenCalledTimes(1);
    expect(getFormHeaderDefaultsRequest).toHaveBeenCalledWith(
      GET_FORM_HEADER_DEFAULTS_ROUTE
    );
  });
});
