import { axios } from '@kitman/common/src/utils/services';
import { data as mockedDrFirstMedicationsData } from '../../../mocks/handlers/medical/getDrFirstMedicationsData';
import getDrFirstMedications from '../getDrFirstMedications';

describe('getDrFirstMedications', () => {
  let getDrFirstMedicationsDataRequest;

  beforeEach(() => {
    getDrFirstMedicationsDataRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) =>
          resolve({ data: mockedDrFirstMedicationsData })
        );
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formState = {
      athlete_id: 40211,
      archived: false,
      status: ['paused'],
    };

    const returnedData = await getDrFirstMedications(formState);

    expect(returnedData).toEqual(mockedDrFirstMedicationsData);

    expect(getDrFirstMedicationsDataRequest).toHaveBeenCalledTimes(1);

    expect(getDrFirstMedicationsDataRequest).toHaveBeenCalledWith(
      '/ui/medical/medications/search',
      {
        filters: {
          ...formState,
        },
      }
    );
  });
});
