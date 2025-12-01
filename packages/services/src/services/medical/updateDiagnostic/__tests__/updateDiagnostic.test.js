import { axios } from '@kitman/common/src/utils/services';
import updateDiagnostic from '..';

describe('updateDiagnostic', () => {
  let request;
  const diagnosticsBillingParams = {
    athleteId: 1,
    cptCode: '1234A',
    isBillable: true,
    amountPaidInsurance: '100',
    amountPaidAthlete: '50',
    queuedBillableItems: [
      {
        cptCode: 'ABC27',
        isBillable: true,
        amountCharged: 200,
        discountOrReduction: 50,
        amountPaidInsurance: 100,
        amountDue: 150,
        amountPaidAthlete: 50,
        datePaidDate: '2022-06-04T00:00:00+01:00',
      },
    ],
  };
  const serverResponse = {
    diagnostic: {
      cpt_code: '1234A',
      is_billable: true,
      amount_paid_insurance: '100',
      amount_paid_athlete: '50',
      billable_items: [
        {
          cpt_code: 'ABC27',
          is_billable: true,
          amount_charged: 200,
          discount: 50,
          amount_paid_insurance: 100,
          amount_due: 150,
          amount_paid_athlete: 50,
          date_paid: '2022-06-04T00:00:00+01:00',
        },
      ],
    },
    scope_to_org: true,
  };

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'patch')
      .mockResolvedValueOnce({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateDiagnostic(
      12345,
      diagnosticsBillingParams
    );

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(
      '/athletes/1/diagnostics/12345',
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          cpt_code: '1234A',
          is_billable: true,
          amount_paid_insurance: '100',
          amount_paid_athlete: '50',
          billable_items: [
            expect.objectContaining({
              cpt_code: 'ABC27',
              is_billable: true,
              amount_charged: 200,
              discount: 50,
              amount_paid_insurance: 100,
              amount_due: 150,
              amount_paid_athlete: 50,
              date_paid: '2022-06-04T00:00:00+01:00',
            }),
          ],
        }),
        scope_to_org: true,
      })
    );
    expect(returnedData).toEqual(serverResponse);
  });
});
