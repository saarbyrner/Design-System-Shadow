import $ from 'jquery';
import { data as mockedAllergyMedicationsData } from '../../../mocks/handlers/medical/getAllergyMedicationsData';
import getAllergyMedications from '../getAllergyMedications';

describe('getAllergyMedications', () => {
  let getAllergyMedicationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getAllergyMedicationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAllergyMedicationsData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getAllergyMedications('ibuprofen');

    expect(returnedData).toEqual(mockedAllergyMedicationsData);

    expect(getAllergyMedicationsRequest).toHaveBeenCalledTimes(1);

    expect(getAllergyMedicationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/fdb/allergen_picklist',
      data: {
        search_expression: 'ibuprofen',
      },
    });
  });
});
