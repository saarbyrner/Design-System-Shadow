import { axios } from '@kitman/common/src/utils/services';
import {
  data as getCustomEventTypesResponse,
  squadResponseData,
} from '@kitman/services/src/mocks/handlers/planning/getCustomEventTypes';
import getCustomEventTypes, {
  getCustomEventTypesRoute,
} from '../getCustomEventTypes';

describe('getCustomEventTypes', () => {
  it('calls the correct endpoint when archived is true', async () => {
    const spiedFunction = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: getCustomEventTypesResponse });

    const returnedData = await getCustomEventTypes({
      archived: true,
      selectable: false,
    });
    expect(returnedData).toEqual(getCustomEventTypesResponse);

    expect(spiedFunction).toHaveBeenCalledTimes(1);
    expect(spiedFunction).toHaveBeenCalledWith(getCustomEventTypesRoute, {
      params: { is_archived: true, is_selectable: false },
    });
  });

  it('calls the correct endpoint when archived is false', async () => {
    const spiedFunction = jest.spyOn(axios, 'get').mockResolvedValue({
      data: getCustomEventTypesResponse.filter(
        (eventType) =>
          eventType.is_archived !== true || eventType.is_selectable === true
      ),
    });

    const returnedData = await getCustomEventTypes({
      archived: false,
      selectable: true,
    });
    expect(returnedData).toEqual(getCustomEventTypesResponse);

    expect(spiedFunction).toHaveBeenCalledTimes(1);
    expect(spiedFunction).toHaveBeenCalledWith(getCustomEventTypesRoute, {
      params: { is_archived: false, is_selectable: true },
    });
  });

  it('passes through squad ids when it exists', async () => {
    const spiedFunction = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: squadResponseData });

    const returnedData = await getCustomEventTypes({
      archived: false,
      selectable: true,
      squadIds: [8],
    });
    expect(returnedData).toEqual(squadResponseData);

    expect(spiedFunction).toHaveBeenCalledTimes(1);
    expect(spiedFunction).toHaveBeenCalledWith(getCustomEventTypesRoute, {
      params: { is_archived: false, is_selectable: true, squads: [8] },
    });
  });
});
