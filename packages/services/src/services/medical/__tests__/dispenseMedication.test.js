import $ from 'jquery';
import { data as mockedMedicationData } from '../../../mocks/handlers/medical/dispenseMedication';
import dispenseMedication from '../dispenseMedication';

describe('dispenseMedication', () => {
  let dispenseMedicationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    dispenseMedicationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedMedicationData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formState = {
      athlete_id: 27280,
      type: 'InternalStock',
      drug_type: 'FdbDispensableDrug',
      drug_id: '4',
      stock_lots: [
        {
          id: 2,
          dispensed_quantity: 10,
        },
        {
          id: 3,
          dispensed_quantity: 20,
        },
      ],
      name: 'Drug name',
      prescriber_id: 26486,
      external_prescriber_name: '',
      prescription_date: '2022-02-02T00:00:00Z',
      reason: 'Any reason',
      directions: 'Inhale',
      quantity: '8.5',
      quantity_units: 'gram',
      frequency: 'twice a day',
      route: 'inhlusing inhaler',
      start_date: '2022-02-02T00:00:00Z',
      end_date: '2022-02-12T00:00:00Z',
      note: 'My Note 1',
      issues: [
        {
          type: 'InjuryOccurrence',
          id: 1,
        },
        {
          type: 'IllnessOccurrence',
          id: 2,
        },
      ],
    };

    const returnedData = await dispenseMedication(formState);

    expect(returnedData).toEqual(mockedMedicationData);

    expect(dispenseMedicationRequest).toHaveBeenCalledTimes(1);

    expect(dispenseMedicationRequest).toHaveBeenCalledWith({
      contentType: 'application/json',
      method: 'POST',
      url: '/ui/medical/medications',
      data: JSON.stringify(formState),
    });
  });
});
