import moment from 'moment-timezone';
import { axios } from '@kitman/common/src/utils/services';
import { renderHook, act } from '@testing-library/react-hooks';
import formattedResult from '@kitman/services/src/mocks/handlers/medical/getFormResults/formattedResults.mock';
import useFormResultsData from '../useFormResultsData';

describe('useFormResultsData hook', () => {
  let locale;

  beforeEach(() => {
    locale = moment.locale();
    moment.locale('en');
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    moment.locale(locale);
    moment.tz.setDefault();
  });

  it('makes calls the expected data source endpoints', async () => {
    jest.spyOn(axios, 'get');

    let renderHookResult;

    await act(async () => {
      renderHookResult = await renderHook(() => useFormResultsData()).result;
      await renderHookResult.current.fetchFormResultsData(1);
    });

    expect(axios.get).toHaveBeenCalledTimes(2);

    expect(axios.get).toHaveBeenCalledWith(
      '/ui/concussion/form_answers_sets/1',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    expect(axios.get).not.toHaveBeenCalledWith(
      '/forms/form_elements/data_source_items?data_source=injuries'
    );
    expect(axios.get).toHaveBeenCalledWith(
      '/forms/form_elements/data_source_items?data_source=timezones'
    );
  });

  it('returns the expected data when fetching form results', async () => {
    let renderHookResult;
    await act(async () => {
      renderHookResult = await renderHook(() => useFormResultsData()).result;
      await renderHookResult.current.fetchFormResultsData(1);
    });
    expect(renderHookResult.current.formResults).toEqual(formattedResult);
  });

  it('restores the list of forms when resetting', async () => {
    let renderHookResult;
    await act(async () => {
      renderHookResult = await renderHook(() => useFormResultsData()).result;
      await renderHookResult.current.fetchFormResultsData(1);
      renderHookResult.current.resetFormData();
    });

    expect(renderHookResult.current.formResults).toEqual([]);
  });
});
