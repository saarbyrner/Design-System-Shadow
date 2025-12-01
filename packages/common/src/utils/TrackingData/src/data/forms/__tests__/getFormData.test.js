import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { getFormData } from '@kitman/common/src/utils/TrackingData/src/data/forms/getFormData';

describe('getFormData', () => {
  it('getAddDrillToSessionData', () => {
    expect(getFormData(humanInputFormMockData)).toEqual({
      category: 'registration',
      editorId: 155134,
      formId: 140,
      name: 'Premier League Athlete Profile',
      type: 'athlete_profile',
      athleteId: 40211,
    });
  });
});
