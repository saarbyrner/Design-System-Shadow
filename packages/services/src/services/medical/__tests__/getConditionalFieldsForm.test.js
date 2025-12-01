import { data } from '@kitman/services/src/mocks/handlers/medical/getConditionalFieldsForm';

import getConditionalFieldsForm from '../getConditionalFieldsForm';

jest.mock('../getConditionalFieldsForm');

describe('getConditionalFieldsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const conditionContext = {
    athlete_id: 10,
    activity_id: 1,
    activity_group_id: 2,
    osics_classification_id: 3,
    osics_pathology_id: 4,
    osics_body_area_id: 5,
    event_type_id: 6,
    illness_onset_id: 7,
  };

  it('calls the correct endpoint and returns the expected conditional fields', async () => {
    getConditionalFieldsForm.mockResolvedValue(data);
    const returnedData = await getConditionalFieldsForm(conditionContext);

    expect(getConditionalFieldsForm).toHaveBeenCalledWith(conditionContext);
    expect(returnedData).toEqual(data);
  });

  it('handles the error correctly when the request fails', async () => {
    const errorMessage = 'Failed to fetch conditional fields';
    getConditionalFieldsForm.mockRejectedValue(new Error(errorMessage));

    await expect(getConditionalFieldsForm(conditionContext)).rejects.toThrow(
      errorMessage
    );
  });
});
